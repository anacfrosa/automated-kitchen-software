import numpy as np
import pandas as pd
from IPython.display import display
from ast import literal_eval

def process_food_com_recipes(df_food_com):
    ''' 
    Create a new dataframe associating each recipe to a group of ingredients with 
    his measures, units and servings.
    '''
    
    df_recipes_ings_food_com = df_food_com.groupby(['title', 'id']).agg({
        'ingredient': lambda x: list(x), 
        'measure': lambda x: list(x), 
        'unit': lambda x: list(x), 
        'servings': lambda x: list(x)
    }).reset_index()

    # Rename the columns to appropriately match the dataframe structure
    df_recipes_ings_food_com.columns = ['title', 'id', 'ingredients', 'measures', 'units', 'servings']

    # Drop the 'id' column
    df_recipes_ings_food_com = df_recipes_ings_food_com.drop(columns=['id'])

    # Convert all the title letters to lower case
    df_recipes_ings_food_com['title'] = df_recipes_ings_food_com['title'].str.lower()

    # Return duplicate recipes with different ids
    return df_recipes_ings_food_com

def convert_food_com_cols_to_list(df_food_com_processed):
     # Convert columns to lists safely and handle NaN values
    columns_to_convert = ['ingredients', 'measures', 'units', 'servings']
    for col in columns_to_convert:
        # Replace 'nan' with 'np.nan' in the 'ingredients' column
        df_food_com_processed[col] = df_food_com_processed[col].apply(lambda x: x.replace('nan', 'np.nan'))
        # Evaluate the modified strings to convert them into lists
        df_food_com_processed[col] = df_food_com_processed[col].apply(eval)

    return df_food_com_processed

def process_restaurant_dataset(df_restaurant_dataset):
    '''
        Return a new 'df_restaurant_dataset' with all recipe names converted to lowercase and 
        some names updated to match those on food.com.
    '''
    # Convert all the recipes to lower case 
    df_restaurant_dataset['MenuItem'] = df_restaurant_dataset['MenuItem'].str.lower()

    # Replace all the 'tasty' word to '' in the Recipe Name
    df_restaurant_dataset['MenuItem'] = df_restaurant_dataset['MenuItem'].str.replace('tasty', '', case=False)
    # Remove leading and trailing white spaces
    df_restaurant_dataset['MenuItem'] = df_restaurant_dataset['MenuItem'].str.strip()

    # Mapping of original to corrected recipe names
    recipe_replacements = {
        'sarson da saag': 'sarson ka saag',
        'malpura': 'malpua',
        'kadahi paneer': 'kadhai paneer',
        'kadahi lamb': 'lamb karahi',
        'paneer vindaloo': 'curry vindaloo',
        'masala chicken wings': 'spicy chicken wings',
        'cocktail chicken samosas': 'chicken triangles',
        'gulabjamun': 'gulab jamun',
        'malai kofta': 'malai kofta curry',
        'hara bhara kabob': 'hara bhara kebabs',
        'shahi paneer': 'shahi paneer korma',
        'yellow dal fry': 'slow cooker mixed yellow dal',
        'lacha paratha': 'paratha',
        'fish pakora': 'indian fish pakoras',
        'fish korma': 'the best on earth karahi (wok) low fat fish korma',
        'tikka rice bowl : paneer | chicken': 'chicken rice bowl',
        'bhindi do piazza': 'bhindi',
        'shrimp strips': 'shrimp',
        'sliders : chicken paneer': 'crispy chicken sliders',
        'spinach naan': 'tandoori spiced chicken & spinach flatbread sandwiches #a1'
    }

    # Apply replacements iteratively
    for old_name, new_name in recipe_replacements.items():
        df_restaurant_dataset['MenuItem'] = df_restaurant_dataset['MenuItem'].str.replace(old_name, new_name, case=False)

    return df_restaurant_dataset

def find_restaurant_recipes_details(recipes_list, df_recipes_food_com):
    '''
        Return a dataframe with the restaurant's recipes found.

        When more than one recipe occurrence is found, the recipe with fewer NaN values in 
        measures, units, and servings is the one chosen.
    '''
    
    df_restaurant_recipe_details = pd.DataFrame()
    
    for recipe in recipes_list:
        df_found_recipe = df_recipes_food_com[df_recipes_food_com['title'] == recipe]
        #display(df_found_recipe)
        number_found_recipes =  len(df_found_recipe)
        #print(number_found_recipes)
        if number_found_recipes == 1:
            # founded only one recipe on food.com
            df_restaurant_recipe_details = pd.concat([df_restaurant_recipe_details, df_found_recipe], ignore_index=True)
        elif number_found_recipes > 1:
            # Founded more than one recipe on food.com
            # Get the recipe with the least nan values 

            #print("\nRecipe with more than one occurrence: ", recipe)
            df_total_recipe = df_found_recipe.copy()
            
            # Check how many nan values are for the measures, units and servings columns
            df_total_recipe.loc[:, 'NanMeasures'] = df_total_recipe['measures'].apply(lambda x: pd.Series(x).isna().sum())
            df_total_recipe.loc[:, 'NanUnits'] = df_total_recipe['units'].apply(lambda x: pd.Series(x).isna().sum())
            df_total_recipe.loc[:, 'NanServings'] = df_total_recipe['servings'].apply(lambda x: pd.Series(x).isna().sum())

            # Calculate combined minimum score
            df_total_recipe['combined_score'] = df_total_recipe['NanMeasures'] + df_total_recipe['NanUnits'] + df_total_recipe['NanServings']
            #display(df_total_recipe)

            min_row_index = df_total_recipe['combined_score'].idxmin()  # find the min nan
            df_min_row = df_found_recipe.loc[min_row_index].to_frame().T   # convert row to dataframe
            df_min_row = df_min_row[['title', 'ingredients', 'measures', 'units', 'servings']]  # Select only the desired columns
            #display(df_min_row)

            df_restaurant_recipe_details = pd.concat([df_restaurant_recipe_details, df_min_row], ignore_index=True)
            
    return df_restaurant_recipe_details

def save_restaurant_recipe_details(df_restaurant_dataset, df_restaurant_recipe_details):  
    '''
    Save the restaurant dataset file with the new recipe names.
    Save the restautant recipe details as a CSV file.
    '''
    recipe_replacements = {
        'tandoori spiced chicken & spinach flatbread sandwiches #a1': 'spinach naan',
        'bhindi': 'fish korma',
        'the best on earth karahi (wok) low fat fish korma': 'bhindi do piazza',
        'slow cooker mixed yellow dal': 'yellow dal fry'
    }

    # Update the 'restaurant food consumption' dataset
    for old_name, new_name in recipe_replacements.items():
        df_restaurant_dataset['MenuItem'] = df_restaurant_dataset['MenuItem'].str.replace(old_name, new_name, case=False)

    # Rename MenuCategory and MenuItem 
    df_restaurant_dataset = ( df_restaurant_dataset
                             .rename(columns={'Day Type': 'DayType', 
                                              'Day': 'DayOfWeek',
                                              'MenuCateogry': 'Category',
                                              'Date_time': 'DateTime'
                                              })
    )

    # Add OrderID Column to Restaurant Dataset
    order_id = np.arange(1, len(df_restaurant_dataset) + 1) # Calculate order_id values
    df_restaurant_dataset.insert(0, 'OrderID', order_id)  # Insert OrderID column at the beginning  

    # Replace all 0 values in the PartySize column with 1
    df_restaurant_dataset['PartySize'] = df_restaurant_dataset['PartySize'].replace(0, 1)

    # Get csv of the updated 'restaurant food consumption' dataset
    df_restaurant_dataset.to_csv('../../data/kaggle/Restaurant_food_consumption_upd.csv', index=False)

    # Update new names to the df_restaurant_recipe_details 
    for old_name, new_name in recipe_replacements.items():
        df_restaurant_recipe_details['title'] = df_restaurant_recipe_details['title'].str.replace(old_name, new_name, case=False)

    # Explode the lists in 'ingredient', 'measure', 'unit', 'servings' columns
    df_restaurant_recipe_details = df_restaurant_recipe_details.explode(['ingredients', 'measures', 'units', 'servings'])
    df_restaurant_recipe_details.reset_index(drop=True, inplace=True)  # Reset index

    # Rename columns
    df_restaurant_recipe_details.columns = ['Recipe', 'Ingredient', 'Measure', 'Unit', 'Serving']

    # print(len(df_restaurant_recipe_details))
    # display(df_restaurant_recipe_details)

    # Save the exploded DataFrame to CSV
    df_restaurant_recipe_details.to_csv('../../data/processed/restaurant_recipes_details.csv', index=False)

