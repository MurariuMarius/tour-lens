# app.py

from flask import Flask, request, jsonify
from PIL import Image
import io
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import ViTImageProcessor, ViTForImageClassification, Trainer, TrainingArguments
import numpy as np
import evaluate
from sklearn.model_selection import train_test_split
from datasets import Dataset, DatasetDict


app = Flask(__name__)

# In-memory storage for images and labels
image_data_list = []
labels_set = set()

# Label mappings
label_to_id = {}
id_to_label = {}


# Initialize the processor
model_name_or_path = 'google/vit-base-patch16-224-in21k'
processor = ViTImageProcessor.from_pretrained(model_name_or_path)

# Endpoint to receive images via POST requests
@app.route('/upload', methods=['POST'])
def upload_images():
    """
    Endpoint to receive images via POST requests.
    Image files should be sent with the key 'images'.
    Filenames should follow the format <class>_number.jpg to derive labels.
    """
    try:
        if 'images' not in request.files:
            return jsonify({'error': 'No images part in the request.'}), 400

        files = request.files.getlist('images')

        if not files:
            return jsonify({'error': 'No images uploaded.'}), 400

        for file in files:
            filename = file.filename
            if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                return jsonify({'error': f'Unsupported file format for file {filename}.'}), 400

            # Extract class label from filename
            try:
                class_label = filename.split('_')[0]
            except IndexError:
                return jsonify({'error': f'Filename {filename} does not follow the <class>_number.jpg format.'}), 400

            print(f'Received file {file.filename} with label {class_label}')

            # Read image bytes and open image
            img_bytes = file.read()
            image = Image.open(io.BytesIO(img_bytes)).convert('RGB')

            # Append to dataset
            image_data_list.append({
                'image': image,
                'label': class_label
            })
            labels_set.add(class_label)

        print(f'The dataset contains {len(image_data_list)} files')
        
        train_model()

        return jsonify({'message': f'Successfully uploaded {len(files)} images.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def train_model():
    """
    Endpoint to trigger model training using the uploaded images and labels.
    """
    
    print("Preparing model")
    
    try:            
        if len(image_data_list) == 0:
            return jsonify({'error': 'No data available for training. Please upload images first.'}), 400

        # Create label mappings
        global label_to_id, id_to_label
        label_to_id = {label: idx for idx, label in enumerate(sorted(labels_set))}
        id_to_label = {idx: label for label, idx in label_to_id.items()}

        # Create the dataset
        dataset = {
            'image': [item['image'] for item in image_data_list],
            'label': [label_to_id[item['label']] for item in image_data_list]
        }
        hf_dataset = Dataset.from_dict(dataset)

        # Split into training and validation sets
        split_dataset = hf_dataset.train_test_split(test_size=0.3, seed=42)
        dataset_dict = DatasetDict({
            'train': split_dataset['train'],
            'validation': split_dataset['test']
            })

        print("Created dataset")
        
        print(f'\nLabels: {id_to_label}', end='\n\n')

        print(dataset_dict)
        print(dataset_dict['train'][0])
        
        def transform(example_batch):
            print(example_batch)

            # Take a list of PIL images and turn them to pixel values
            inputs = processor([x for x in example_batch['image']], return_tensors='pt')

            # Don't forget to include the labels!
            inputs['label'] = example_batch['label']
            return inputs
        
        
        dataset_dict = dataset_dict.with_transform(transform)
        
        print(dataset_dict['train'][0])

        
        # Load the pretrained model
        model = ViTForImageClassification.from_pretrained(
            model_name_or_path,
            num_labels=len(labels_set),
            id2label=id_to_label,
            label2id=label_to_id,
        )

        print("Loaded pretrained model")

        # Define the metrics
        metric = evaluate.load("accuracy")

        def compute_metrics(p):
            return metric.compute(predictions=np.argmax(p.predictions, axis=1), references=p.label_ids)
        
        
        def collate_fn(batch):
            return {
                'pixel_values': torch.stack([x['pixel_values'] for x in batch]),
                'labels': torch.tensor([x['label'] for x in batch])
            }

        # Define training arguments
        training_args = TrainingArguments(
            output_dir="./vit-test",
            per_device_train_batch_size=16,
            evaluation_strategy="steps",
            num_train_epochs=4,
            fp16=True,
            save_steps=100,
            eval_steps=100,
            logging_steps=10,
            learning_rate=2e-4,
            save_total_limit=2,
            remove_unused_columns=False,
            push_to_hub=False,
            report_to='tensorboard',
            load_best_model_at_end=True,
        )

        print("Training arguments")

        # Initialize Trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            data_collator=collate_fn,
            train_dataset=dataset_dict['train'],
            eval_dataset=dataset_dict['validation'],
            compute_metrics=compute_metrics,
        )
        
        print("Model preparation complete")
        
        return run_training(trainer)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
        
def run_training(trainer):
    """
    Runs the training process.
    """
    
    print("Started model training")
    
    try:
        train_results = trainer.train()
        trainer.save_model()
        trainer.log_metrics("train", train_results.metrics)
        trainer.save_metrics("train", train_results.metrics)
        trainer.save_state()
        
    except Exception as e:
        print(f"Error during training: {e}")
        print(e)
        

        return jsonify({'message': 'Model trained and saved successfully.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the app
    app.run(host='0.0.0.0', port=5050)