from flask import Flask, request, jsonify
from model import predict  # Ensure this function accepts image bytes

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():
    """
    The prediction endpoint that accepts image data via POST requests.
    """
    try:
        # Read image bytes from the request data
        img_bytes = request.get_data()
        
        # Ensure that some data was received
        if not img_bytes:
            return jsonify({'error': 'No image data received. Please send image data in the request body.'}), 400
        
        # Call your predict function with the image bytes
        try:
            class_name, confidence = predict(img_bytes)
        except Exception as e:
            print(e)
            import traceback
            traceback.print_exc()


        # Return the prediction result
        return jsonify({'class_name': class_name, 'confidence': confidence})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the app on the localhost port 5000
    app.run(host='0.0.0.0', port=5000)