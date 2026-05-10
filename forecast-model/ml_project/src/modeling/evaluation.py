import torch

def train_loop(dataloader, model, loss_fn, optimizer, device):
    model.train()   # Set the model to training mode
    
    num_batches = len(dataloader)   # Number of total batches
    train_loss = 0.0
    train_predictions = []
    train_actuals = []

    for X_batch, y_batch in dataloader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)
        optimizer.zero_grad()   # Reset the gradients of model parameters
        # Compute prediction and loss
        prediction = model(X_batch)
        loss = loss_fn(prediction, y_batch)
        loss.backward()     # Determine the gradients for this loop 
        optimizer.step()    # Adjust the parameters by the gradients collected in the backward pass.

        train_loss += loss.item()   # sum all the train losses

        with torch.no_grad():
            train_predictions.extend(prediction.cpu().detach().numpy())
            train_actuals.extend(y_batch.cpu().detach().numpy())
    
    train_loss /= num_batches  # average loss of each epoch
    return train_loss, train_predictions, train_actuals


def test_loop(dataloader, model, loss_fn, device):
    model.eval()    # Set the model to evaluation mode

    num_batches = len(dataloader)   # Number of total batches 
    test_loss = 0.0
    test_predictions = []
    test_actuals = []

    # Evaluating the model with torch.no_grad() ensures that no gradients are computed during test mode
    # also serves to reduce unnecessary gradient computations and memory usage for tensors with requires_grad=True
    with torch.no_grad():
        for X_batch, y_batch in dataloader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            prediction = model(X_batch)
            loss = loss_fn(prediction, y_batch)
            test_loss += loss.item()    # sum all the test losses

            test_predictions.extend(prediction.cpu().detach().numpy())
            test_actuals.extend(y_batch.cpu().detach().numpy())

    test_loss /= num_batches
    return test_loss, test_predictions, test_actuals