import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

import os
from model import getModelPath

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


def check_model(id):
        
    # blob = bucket.blob(f'{MODEL_DIRECTORY}/{id}')
    # blob.download_to_filename(f'{model_dir}/model.safetensors')
    
    if not os.path.exists(f"{getModelPath(id)}/model.safetensors"):
        raise LookupError(f"Model {getModelPath(id)}/model.safetensors does not exist")
    
    return True
