from IPython.display import display

from src.utils.utils import load_file
import random
import numpy as np

def calculate_recipe_portion(df):
    '''
    Determine the total quantity in grams for 1 serving/person of each recipe.

    Parameters:
        df (dataframe): Restaurant dataframe containing recipe, ingredient, quantity, and serving columns
    '''

    # Step 1: Calculate the Portion Sum
    df_recipe_portions = df.groupby('Recipe')['Quantity'].sum().reset_index(name='Recipe Weight')
    
    # Step 2: Merge with the Serving column
    df_servings = df[['Recipe', 'Serving']].drop_duplicates() 
    df_recipe_portions = df_recipe_portions.merge(df_servings, on='Recipe')
    
    # Step 3: Calculate Portion per Serving
    df_recipe_portions['Portion per Serving'] = df_recipe_portions['Recipe Weight'] / df_recipe_portions['Serving']

    return df_recipe_portions

def calculate_normalize_qty(df, df_recipe_portions):
    '''
    Return a dataframe with new quantities normalized

    Parameters: 
        df (dataframe): Restaurant recipes quantities in grams.
        df_recipe_portions (dataframe): Total quantity in grams for 1 serving/person of each recipe.
    '''
    df_merged1 = df.merge(df_recipe_portions[['Recipe', 'Recipe Weight', 'Portion per Serving']], on='Recipe', how='left')

    # Normalize ingredient quantity
    df_merged1['Norm Quantity'] = df_merged1['Quantity'] / df_merged1['Recipe Weight']
    #display(df_merged1)

    df_valid_norm = df_merged1.groupby('Recipe')['Norm Quantity'].sum().reset_index(name='Valid Norm')
    df_merged2 = df_merged1.merge(df_valid_norm, on='Recipe', how='left')
    #display(df_merged2)

    df_merged2['New Quantity'] = round(df_merged2['Norm Quantity'] * df_merged2['Portion per Serving'], 3) # Round to 2 decimal places
    #display(df_merged2)

    return df_merged2

def save_restaurant_quantities_consumption():
    '''
    Saves the restaurant food consumption data with the final ingredient quantities normalized.
    '''
    np.random.seed(42)  # Set seed for reproducibility

    df_restaurant_data = load_file('../../data/kaggle/Restaurant_food_consumption_upd.csv')
    #display(df_restaurant_data)
    df_quantities_norm_data =  load_file('../../data/processed/restaurant_recipe_quantities_norm.csv')

    # Select and rename columns
    df_quantities_norm_data = df_quantities_norm_data[['Recipe', 'Ingredient', 'New Quantity']]
    df_quantities_norm_data = df_quantities_norm_data.rename(columns={'New Quantity': 'Quantity per Unit', 'Recipe': 'MenuItem'})
    #display(df_restaurant_quantities_norm)

    df_restaurant_quantities = df_restaurant_data.merge(df_quantities_norm_data, on='MenuItem', how='left')

    df_restaurant_quantities['Random Factor'] = df_restaurant_quantities.apply(lambda row: ((random.random() - 0.5) * 0.6) + 1, axis=1) # Less variability
    #df_restaurant_quantities['Random Factor'] = df_restaurant_quantities.apply(lambda row: ((random.random() - 0.5) * 0.5) + 1, axis=1) #* Less variability
    #df_restaurant_quantities['Random Factor'] = df_restaurant_quantities.apply(lambda row: ((random.random() - 0.5) * 0.7) + 1.1, axis=1) # Biased towards growth
    #df_restaurant_quantities['Random Factor'] = df_restaurant_quantities.apply(lambda row: (np.random.normal(loc=1.0, scale=0.1)), axis=1) # mean 1, std dev 0.1

    #display(df_restaurant_quantities)
    df_restaurant_quantities['Total Quantity'] = df_restaurant_quantities['Quantity per Unit'] * (df_restaurant_quantities['Factor']*df_restaurant_quantities['Random Factor'])
    #df_restaurant_quantities['Total Quantity'] = df_restaurant_quantities['Quantity per Unit'] * df_restaurant_quantities['Factor']
    # #display(df_restaurant_quantities)
    
    df_restaurant_quantities.to_csv('../../data/kaggle/Restaurant_food_quantities.csv', index=False)

    