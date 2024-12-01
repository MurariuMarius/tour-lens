import io

from PIL import Image
from transformers import ViTImageProcessor, ViTForImageClassification
import torch
from torch.nn.functional import softmax

from labels import getLabels

labels = getLabels()

model_path = "D:/Licenta/ViT/vit-timisoara"

processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224-in21k')

model = ViTForImageClassification.from_pretrained(
    model_path,
    num_labels=len(labels),
    id2label={str(i): c for i, c in enumerate(labels)},
    label2id={c: str(i) for i, c in enumerate(labels)}
)

model.eval()

def predict(image):
    
    image = transform_image(image)
    
    print(type(image))
    
    with torch.no_grad():
        outputs = model(image)
        logits = outputs.logits

        # Apply softmax to get probabilities
        probabilities = softmax(logits, dim=1)

        # Get the predicted class and its confidence
        confidence, predicted_class_idx = torch.max(probabilities, dim=1)

        # Print predicted classes and their confidence scores
        for idx in range(len(predicted_class_idx)):
            print(f"Predicted Class: {predicted_class_idx[idx].item()}, Confidence: {confidence[idx].item():.2f}")

        return predicted_class_idx[0].item(), confidence[0].item()


def transform_image(image_bytes):
    """
    Transforms the input image bytes to the required format.

    Args:
        image_bytes (bytes): The image in bytes.

    Returns:
        torch.Tensor: The processed image tensor.
    """
    image = Image.open(io.BytesIO(image_bytes))

    image = processor(image, return_tensors='pt')['pixel_values']
    return image
