from ml_project.src.preprocessing.find_ingredient_recipes import find_restaurant_recipes_details, process_food_com_recipes
from ml_project.src.preprocessing.find_ingredient_recipes import process_restaurant_dataset, save_restaurant_recipe_details

from ml_project.src.utils.utils import load_file


def preprocessing():

    print("Loagind food.com and restaurant food consumption datasets...", "\n")

    food_com_file = '../data/wac/food_com_db_w_units.csv'  # dataset with food recipes from food.com
    df_food_com = load_file(food_com_file)
    restaurant_file = '../data/kaggle/Restaurant_food_consumption.xlsx'
    df_restaurant_dataset = load_file(restaurant_file)  #Convert excel restaurant dataset to a DataFrame 

    print("Step1: Finding ingredient recipes...", "\n")

    ## Get the details of each recipe throught food.com (ingredients, measures, units, servings) 
    df_recipes_food_com = process_food_com_recipes(df_food_com)

    # Preprocessing restaurant dataset (convert to lowercase and reclace some names)
    df_restaurant_dataset = process_restaurant_dataset(df_restaurant_dataset)

    # Get the restaurant's list of unique recipes
    restaurant_recipes_list = df_restaurant_dataset['MenuItem'].drop_duplicates().tolist()
    print("Number of recipes to be found: ", len(restaurant_recipes_list))

    # Apply the function to find the recipes
    df_restaurant_recipe_details = find_restaurant_recipes_details(restaurant_recipes_list, df_recipes_food_com)
    #display(df_restaurant_recipe_ings)

    founded_recipes_list = df_restaurant_recipe_details['title'].tolist()
    print("Number of recipes FOUNDED for now: ", len(founded_recipes_list))

    # Get the list of the missing recipes 
    missing_recipes_list = [recipe for recipe in restaurant_recipes_list if recipe not in founded_recipes_list]
    print("Number of recipes MISSING for now: ", len(missing_recipes_list))

    save_restaurant_recipe_details(df_restaurant_dataset, df_restaurant_recipe_details)


    print("Step1: Calculate the quantity of each ingredient in grams...", "\n")
    

if __name__ == "__main__":
    preprocessing()