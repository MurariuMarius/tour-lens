from PIL import Image
import io
import torch
from torch.utils.data import Dataset
from transformers import ViTImageProcessor, ViTForImageClassification, Trainer, TrainingArguments
import numpy as np
import evaluate
from datasets import Dataset, DatasetDict

model_name_or_path = 'google/vit-base-patch16-224-in21k'
processor = ViTImageProcessor.from_pretrained(model_name_or_path)

def create_model(files):
    images, labels = create_dataset(files)
    trainer = get_model(images, labels)
    train(trainer)


def create_dataset(files):
    if not files:
        raise ValueError("No images uploaded")

    images = []
    labels = set()

    for file in files:
        filename = file.filename
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise ValueError(f'Unsupported file format for file {filename}.')
        
        try:
            class_label = filename.split('_')[0]
        except IndexError:
            raise ValueError(f'Filename {filename} does not follow the <class>_number.jpg format.')

        print(f'Received file {file.filename} with label {class_label}')

        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert('RGB')

        images.append({
            'image': image,
            'label': class_label
        })
        labels.add(class_label)
    
    return images, labels



def get_model(images, labels):

    label_to_id = {label: idx for idx, label in enumerate(sorted(labels))}
    id_to_label = {idx: label for label, idx in label_to_id.items()}

    dataset = {
        'image': [item['image'] for item in images],
        'label': [label_to_id[item['label']] for item in images]
    }
    hf_dataset = Dataset.from_dict(dataset)

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

        inputs = processor([x for x in example_batch['image']], return_tensors='pt')

        inputs['label'] = example_batch['label']
        return inputs
    
    
    dataset_dict = dataset_dict.with_transform(transform)
    
    print(dataset_dict['train'][0])

    
    model = ViTForImageClassification.from_pretrained(
        model_name_or_path,
        num_labels=len(labels),
        id2label=id_to_label,
        label2id=label_to_id,
    )

    print("Loaded pretrained model")

    metric = evaluate.load("accuracy")

    def compute_metrics(p):
        return metric.compute(predictions=np.argmax(p.predictions, axis=1), references=p.label_ids)
    
    
    def collate_fn(batch):
        return {
            'pixel_values': torch.stack([x['pixel_values'] for x in batch]),
            'labels': torch.tensor([x['label'] for x in batch])
        }

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

    return Trainer(
        model=model,
        args=training_args,
        data_collator=collate_fn,
        train_dataset=dataset_dict['train'],
        eval_dataset=dataset_dict['validation'],
        compute_metrics=compute_metrics,
    )
        
        
def train(trainer):
    try:
        train_results = trainer.train()
        trainer.save_model()
        trainer.log_metrics("train", train_results.metrics)
        trainer.save_metrics("train", train_results.metrics)
        trainer.save_state()
        
    except Exception as e:
        print(f"Error during training: {e}")
        print(e)
