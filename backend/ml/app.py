from flask import Flask, request, jsonify
from model import predict, create_model
from persistence import check_model

import traceback, uuid

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():

    try:
        img_bytes = request.get_data()
        
        model_id = request.args.get("id")
        
        if not img_bytes:
            return jsonify({'error': 'No image data received. Please send image data in the request body.'}), 400
        
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


@app.route('/create', methods=['POST'])
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
        print('blbalbaldskfj')
        print(e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    