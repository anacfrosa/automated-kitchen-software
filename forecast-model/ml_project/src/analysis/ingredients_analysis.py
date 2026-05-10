import matplotlib.pyplot as plt
import matplotlib.cm as cm
from matplotlib.colors import ListedColormap
import numpy as np

def get_most_frequent_ingredients(df, n):
    '''
    Saves a list with the n most frequently consumed restaurant ingredients.

    Parameters: 
        df (dataframe)
        n (integer) - n most frequent ingredients.
    '''

    # Count occurrences for each ingredient 
    df_ingredients_counts = (df
                            .groupby('Ingredient')
                            .size()
                            .sort_values(ascending=False).rename('Count').reset_index())

    # Ingredients to remove
    ingredients_to_remove = ['water', 'warm water', 'salt and pepper', 'cooked rice', 'seasoned salt', 'lentil and vegetable soup']
    df_ingredients_counts = df_ingredients_counts[~df_ingredients_counts['Ingredient'].isin(ingredients_to_remove)]

    # Select the n most frequent ingredients
    df_most_freq_ings = df_ingredients_counts.head(n)

    # Get the list of the n most frequent ingredients
    most_freq_ings_list = df_most_freq_ings['Ingredient'].to_list()

    # Filter restaurant dataset by 25 most frequent ingredients
    #df_restaurant_freq_ings =( (df[df['Ingredient'].isin(most_freq_ings_list)].reset_index(drop=True)))

    return most_freq_ings_list


def get_less_frequent_ingredients(df, n):
    '''
    Saves a list with the n most frequently consumed restaurant ingredients.

    Parameters: 
        df (dataframe)
        n (integer) - n less frequent ingredients.
    '''

    # Count occurrences for each ingredient 
    df_ingredients_counts = (df
                            .groupby('Ingredient')
                            .size()
                            .sort_values(ascending=False).rename('Count').reset_index())

    # Ingredients to remove
    ingredients_to_remove = ['water', 'warm water', 'salt and pepper', 'cooked rice', 'seasoned salt']
    df_ingredients_counts = df_ingredients_counts[~df_ingredients_counts['Ingredient'].isin(ingredients_to_remove)]

    # Select the n less frequent ingredients
    df_less_freq_ings = df_ingredients_counts.tail(n)

    # Get the list of the n less frequent ingredients
    less_freq_ings_list = df_less_freq_ings['Ingredient'].to_list()

    # Filter restaurant dataset by 25 most frequent ingredients
    #df_restaurant_less_freq_ings =( (df[df['Ingredient'].isin(less_freq_ings_list)].reset_index(drop=True)))

    return less_freq_ings_list


# def plot_ingrs_daily_consumption(daily_consumption_df, ingredients_list):
#     daily_consumption_numpy = daily_consumption_df[ingredients_list].to_numpy()
    
#     for idx, ingredient in enumerate(ingredients_list):
#         plt.figure(figsize=(20, 6))  # Adjust figure size for each plot
#         ingredient_daily_consumption = daily_consumption_numpy[:, idx]
#         plt.plot(daily_consumption_df.index, ingredient_daily_consumption, label=ingredient)
#         plt.title(f'{ingredient} - Daily Consumption')
#         plt.xlabel('Time Step')
#         plt.ylabel('Quantity in grams')
#         plt.xticks(rotation=45)
#         plt.legend()
#         plt.grid(True)

#         if ingredient == "Sugar":
#             plt.ylim(0, 7000)

#         if ingredient == "Ground coriander":
#             plt.ylim(0, 1.5)

#         if ingredient == "White pepper":
#             plt.ylim(0, 1)

#         if ingredient == "Clove":
#             plt.ylim(0, 1)

#         plt.tight_layout()
#         plt.show()


def plot_ingrs_daily_consumption(daily_consumption_df, ingredients_list):
    daily_consumption_numpy = daily_consumption_df.to_numpy()
    
    # Number of subplots
    num_ingredients = len(ingredients_list)
    num_cols = 1  # Number of columns for subplots
    num_rows = (num_ingredients + num_cols - 1) // num_cols  # Calculate number of rows needed

    # Create a color map, excluding red
    base_cmap = cm.get_cmap('tab10')  # Use the 'tab10' colormap
    colors = [base_cmap(i) for i in range(base_cmap.N) if not np.allclose(base_cmap(i), [1, 0, 0, 1])]  # Exclude red
    custom_cmap = ListedColormap(colors)
    
    # Create a figure with a grid of subplots
    fig, axes = plt.subplots(num_rows, num_cols, figsize=(20, num_rows * 5))
    axes = axes.flatten()  # Flatten the 2D array of axes for easy iteration
    
    # Plot the daily consumption of each ingredient in the list
    for idx, ingredient in enumerate(ingredients_list):
        ingredient_daily_consumption = daily_consumption_numpy[:, idx]
        ax = axes[idx]
        color = custom_cmap(idx % len(colors))  # Assign a different color, cycling through the custom colormap
        ax.plot(daily_consumption_df.index, ingredient_daily_consumption, label=ingredient, color=color)

        ax.set_ylabel('Quantity in grams', fontsize=17)  # Set y-label with larger font size
        ax.tick_params(axis='y', labelsize=13)
        ax.tick_params(axis='x', rotation=45, labelsize=13)
        ax.legend(fontsize=16)  # Adjust legend font size if needed
        ax.grid(True)


    # Set a single title for the entire figure
    fig.suptitle('Restaurant Daily Ingredient Consumption', fontsize=22)

    # Set a single x-label for all subplots
    plt.xlabel('Time Step', fontsize=17)

    # Hide any unused subplots
    for ax in axes[num_ingredients:]:
        ax.set_visible(False)

    plt.tight_layout(rect=[0, 0, 1, 0.98])  # Adjust layout to make room for the title
    plt.show()

