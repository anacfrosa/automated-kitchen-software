import os
import pandas as pd

def get_file_type(file_name):
    _, file_extension = os.path.splitext(file_name)
    if file_extension == '.csv':
        return 'csv'
    elif file_extension in ['.xls', '.xlsx']:
        return 'excel'
    else:
        return 'unknown'

def load_file(file_name):
    file_type = get_file_type(file_name)
    if file_type == 'csv':
        return pd.read_csv(file_name)
    elif file_type == 'excel':
        return pd.read_excel(file_name)
    else:
        raise ValueError("Unsupported file type")