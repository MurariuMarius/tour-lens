from flask import Flask, request, jsonify
from model import predict
from train import create_model as new_model

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():

    try:
        img_bytes = request.get_data()
        
        if not img_bytes:
            return jsonify({'error': 'No image data received. Please send image data in the request body.'}), 400
        
        try:
            class_name, confidence = predict(img_bytes)
        except Exception as e:
            print(e)
            import traceback
            traceback.print_exc()

        return jsonify({'class_name': class_name, 'confidence': confidence}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/create', methods=['POST'])
def create_model():

    try:
        if 'images' not in request.files:
            return jsonify({'error': 'No images part in the request.'}), 400

        files = request.files.getlist('images')
        
        new_model(files)
        
        return jsonify({'message': 'Model trained and saved successfully.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    