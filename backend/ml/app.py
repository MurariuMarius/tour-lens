from flask import Flask, request, jsonify
from model import predict, create_model
from persistence import fetch_model

import traceback

app = Flask(__name__)

TEST_MODEL_ID = "1"

@app.route('/predict', methods=['POST'])
def predict_endpoint():

    try:
        img_bytes = request.get_data()
        
        if not img_bytes:
            return jsonify({'error': 'No image data received. Please send image data in the request body.'}), 400
        
        try:
            model_path = fetch_model(TEST_MODEL_ID)
            class_name, confidence = predict(img_bytes, model_path)
        except Exception as e:
            print(e)
            traceback.print_exc()

        return jsonify({'class_name': class_name, 'confidence': confidence}), 200
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/create', methods=['POST'])
def createDDDSDD_model():
    
    print('here')
    
    try:
        if 'images' not in request.files:
            return jsonify({'error': 'No images part in the request.'}), 400

        files = request.files.getlist('images')
        
        print('her12e')

        
        create_model(files, f'models/{TEST_MODEL_ID}')
                
        return jsonify({'message': 'Model trained and saved successfully.'}), 200

    except Exception as e:
        print('blbalbaldskfj')
        print(e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    