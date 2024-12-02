import os
import re

def remove_comments(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Regular expression pattern to match comments
    pattern = re.compile(r'//.*?$|/\*.*?\*/', re.DOTALL | re.MULTILINE)

    # Remove comments
    content_without_comments = pattern.sub('', content)

    with open(file_path, 'w') as file:
        file.write(content_without_comments)

def main(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.js', '.tsx', '.jsx')):
                file_path = os.path.join(root, file)
                remove_comments(file_path)
                print(f"Comments removed from {file_path}")

if __name__ == "__main__":
    directory = "app"
    main(directory)