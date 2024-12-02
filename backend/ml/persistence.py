import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

import os

# cred = credentials.Certificate('./tour-lens-firebase-adminsdk.json')
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'tour-lens.firebasestorage.app'
# })

MODEL_DIRECTORY = "models"

# bucket = storage.bucket()

# def upload_to_firebase(file_path, blob_name):
    
#     blob_name = "requirements.txt"
    
#     blob = bucket.blob(f'{MODEL_DIRECTORY}/{blob_name}')
#     blob.upload_from_filename(file_path)


def fetch_model(id):
    model_dir = f"models/{id}"
    
    # blob = bucket.blob(f'{MODEL_DIRECTORY}/{id}')
    # blob.download_to_filename(f'{model_dir}/model.safetensors')
    
    if not os.path.exists(f"{model_dir}/model.safetensors"):
        raise LookupError(f"Model {model_dir}/model.safetensors does not exist")
    
    return model_dir
