import requests
import os

# Specify the directory containing the jpg files
directory_path = 'C:\\Users\\Marius\\Desktop\\data'

# Create a list to hold file tuples for uploading
files = []

# Loop through all files in the specified directory
for filename in os.listdir(directory_path):
    if filename.endswith('.jpg'):  # Check if the file is a JPG
        file_path = os.path.join(directory_path, filename)
        files.append(('images', open(file_path, 'rb')))  # Append the file to the list

# URL to which the request will be sent
url = 'http://localhost:5000/create'

# Send the POST request with the files
response = requests.post(url, files=files)
print(response.json())

# Close all the files opened
for _, file in files:
    file.close()