from flask import Flask, request, jsonify
from model import predict, create_model, delete_model
from persistence import check_model

import traceback, uuid
import os

import config

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():

    try:
        img_bytes = request.get_data()
        
        model_id = request.args.get("id")
                
        if not img_bytes:
            return jsonify({'error': 'No image data received. Please send image data in the request body.'}), 400
        
        if not model_id:
            return jsonify({'error': 'Must specify model id'}), 400
        
        print(f'Predicting for model {model_id}...')
        
        try:
            check_model(model_id)
            class_name, confidence = predict(img_bytes, model_id)
        except Exception as e:
            print(e)
            traceback.print_exc()

        return jsonify({'class_name': class_name, 'confidence': confidence}), 200
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/model', methods=['POST'])
def create():
    
    try:
        if 'images' not in request.files:
            return jsonify({'error': 'No images part in the request.'}), 400

        files = request.files.getlist('images')
        
        id = uuid.uuid4()
        
        id_to_label = create_model(files, id)
                
        return jsonify({
            'message': 'Model trained and saved successfully.',
            'labels': id_to_label,
            'model_id': id
        }), 200

    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/model', methods=['DELETE'])
def delete():
    model_id = request.args.get("id")
    
    try:
        delete_model(model_id)
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'error': 'Could not delete model'}), 500
        
    return jsonify({}), 204


@app.route('/model', methods=['GET'])
def get_models():
    try:
        models = os.listdir(config.model_base_path)
        print(models)
        
        try:
            models = filter(lambda model : check_model(model))
        except LookupError as e:
            print(e)
        
        return jsonify({'models': models}), 200
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'error': 'Could not fetch models'}), 500

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=17708)
    