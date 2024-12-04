import requests
import os
import base64

def main():

    directory_path = 'C:\\Users\\Marius\\Desktop\\data'
    url = 'http://localhost:8080/upload-images'

    if not os.path.isdir(directory_path):
        print(f"Error: '{directory_path}' is not a valid directory.")
        return

    files = []
    for filename in os.listdir(directory_path):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            file_path = os.path.join(directory_path, filename)
            files.append((filename, open(file_path, 'rb')))

    if not files:
        print("No images found in the specified directory.")
        return
    
    try:
        # Create the destination object based on file names
        destination_id = 1
        attractions = {}

        for filename, _ in files:
            parts = filename.split('_')
            attraction_label = parts[0]
            if attraction_label not in attractions:
                attractions[attraction_label] = []
            attractions[attraction_label].append(filename)


        destination_data = {
            'destination': {
                'id': destination_id,
                'name': 'Test Destination',
                'description': 'Test Description',
                'attractions': []
            }
        }
        
        for label, filenames in attractions.items():
            destination_data['destination']['attractions'].append({
                'destination_id': destination_id,
                'label': label,
                'pictures': [filename for filename in filenames]
            })

        print(destination_data)

        for attraction in destination_data['destination']['attractions']:
            for i in range(len(attraction['pictures'])):
                image_path = os.path.join(directory_path, attraction['pictures'][i])
                with open(image_path, "rb") as img_file:
                    attraction['pictures'][i] = base64.b64encode(img_file.read()).decode('utf-8')

        response = requests.post(url, json=destination_data)  # Send JSON data including base64 images

        print(response.json())

    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()



if __name__ == "__main__":
    main()