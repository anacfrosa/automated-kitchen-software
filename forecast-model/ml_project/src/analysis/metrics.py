import numpy as np
from sklearn.metrics import root_mean_squared_error

def calculate_rmse(y_true, y_pred):
    rmse = root_mean_squared_error(y_true, y_pred)
    return rmse

def calculate_mape(y_true, y_pred):
    # Avoid division by zero by adding a small constant where y_true is zero
    epsilon = 1e-10
    mape = np.mean(np.abs((y_true - y_pred) / (y_true + epsilon))) * 100
    return mape

def calculate_mae(actual, predicted):
    return np.mean(np.abs(actual - predicted))