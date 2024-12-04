import json
import config

def _getLabelsFilePath(model_id : int) -> str: 
    return f'{config.model_base_path}/{model_id}/labels.json'


def getLabels(model_id : int) -> list:
    try:
        with open(_getLabelsFilePath(model_id), 'r') as file:
            data_dict = json.load(file)
            labels = [None] * (int(max(data_dict.keys())) + 1)
            
            for _, v in enumerate(data_dict.items()):
                labels[int(v[0])] = v[1]
                
            print(f'Loaded labels: {labels}')
            return labels
    except Exception as e:
        print(f"Error opening labels file: {e}")
    

def saveLabels(labels : dict, model_id : int):
    try:
        with open(_getLabelsFilePath(model_id), 'w') as file:
            json.dump(labels, file, indent=4)
    except Exception as e:
        print(f"Failed to write dictionary to file: {e}")
        