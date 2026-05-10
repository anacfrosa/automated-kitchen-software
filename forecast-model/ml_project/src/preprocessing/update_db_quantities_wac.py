import pandas as pd

new_rows = [
    ### Crystal hot sauce
    {'Item_name': 'Crystal hot sauce', 'Measure': '1', 'Units': 'ml', 'Grams':  1.01}, 
     ### hot sauce
    {'Item_name': 'hot sauce', 'Measure': '1', 'Units': 'ml', 'Grams': 1.01},
    ### A.1. Original Sauce
    {'Item_name': 'A.1. Original Sauce', 'Measure': '1', 'Units': 'ml', 'Grams': 1.01}, 
    ### chopped tomato
    {'Item_name': 'chopped tomato', 'Measure': '1', 'Units': 'ml', 'Grams': 1.06},  
    {'Item_name': 'chopped tomato', 'Measure': '1', 'Units': 'g can', 'Grams': 400}, 
    {'Item_name': 'chopped tomato', 'Measure': '1', 'Units': 'can', 'Grams': 400}, 
    ### chicken broth
    {'Item_name': 'chicken broth', 'Measure': '1', 'Units': 'ml', 'Grams': 1.04},  
    {'Item_name': 'chicken broth', 'Measure': '1', 'Units': 'can', 'Grams': 298},   
    {'Item_name': 'chicken broth', 'Measure': '1', 'Units': 'g can', 'Grams': 298}, 
    ### boneless skinless chicken breasts
    {'Item_name': 'boneless skinless chicken breasts', 'Measure': '1', 'Units': 'whole', 'Grams': 450}, 
    ### boneless chicken thighs	
    {'Item_name': 'boneless chicken thighs', 'Measure': '1', 'Units': 'unit', 'Grams': 112},
    ### chicken wing
    {'Item_name': 'chicken wing', 'Measure': '1', 'Units': 'small', 'Grams': 51}, 
    ### blanched slivered almond
    {'Item_name': 'blanched slivered almond', 'Measure': '1', 'Units': 'ml', 'Grams': 0.6}, 
    ### campbell's tomato soup
    {'Item_name': 'campbell\'s tomato soup', 'Measure': '1', 'Units': 'ml', 'Grams': 1.04},  
    ### boiling water
    {'Item_name': 'boiling water', 'Measure': '1', 'Units': 'ml', 'Grams': 0.99},
    ### Turmeric powder	
    {'Item_name': 'turmeric powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.41}, 
    ### unsalted butter
    {'Item_name': 'unsalted butter', 'Measure': '1', 'Units': 'ml', 'Grams':  0.95},
    ### warm water
    {'Item_name': 'warm water', 'Measure': '1', 'Units': 'ml', 'Grams': 0.95}, 
    ### hot water
    {'Item_name': 'hot water', 'Measure': '1', 'Units': 'ml', 'Grams': 0.95}, 
    ### white pepper powder
    {'Item_name': 'white pepper powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.41}, 
    ### cayenne pepper powder
    {'Item_name': 'cayenne pepper powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.55},
    ### dry red pepper
    {'Item_name': 'dry red pepper', 'Measure': '1', 'Units': 'ml', 'Grams': 0.55},
    ### bread flour
    {'Item_name': 'bread flour', 'Measure': '1', 'Units': 'ml', 'Grams': 0.51}, 
    ### cardamom powder
    {'Item_name': 'cardamom powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.68}, 
    ### green cardamom pods
    {'Item_name': 'green cardamom pods', 'Measure': '1', 'Units': 'whole', 'Grams': 0.2}, 
    ### green cardamoms
    {'Item_name': 'green cardamoms', 'Measure': '1', 'Units': 'whole', 'Grams': 0.2}, 
    ### channa dal
    {'Item_name': 'channa dal', 'Measure': '1', 'Units': 'ml', 'Grams': 0.86}, 
     ### chickpeas
    {'Item_name': 'chickpeas', 'Measure': '1', 'Units': 'ml', 'Grams': 1.1},   
    ### chat masala
    {'Item_name': 'chat masala', 'Measure': '1', 'Units': 'ml', 'Grams': 0.52},
     ### cilantro
    {'Item_name': 'cilantro', 'Measure': '1', 'Units': 'handful', 'Grams': 15},
    ### cilantro leaves
    {'Item_name': 'cilantro leaves', 'Measure': '1', 'Units': 'ml', 'Grams': 0.07},
    ### coriander leaves
    {'Item_name': 'coriander leaves', 'Measure': '1', 'Units': 'ml', 'Grams': 0.07},
     ### coriander powder
    {'Item_name': 'coriander powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.41},  
     ### fresh coriander
    {'Item_name': 'fresh coriander', 'Measure': '1', 'Units': 'ml', 'Grams': 1.25},
    ### dried coriander
    {'Item_name': 'dried coriander', 'Measure': '1', 'Units': 'ml', 'Grams': 0.41},
     ### cumin powder
    {'Item_name': 'cumin powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.41},
    ### curds
    {'Item_name': 'curds', 'Measure': '1', 'Units': 'ml', 'Grams': 0.96},
     ### dry milk
    {'Item_name': 'dry milk', 'Measure': '1', 'Units': 'ml', 'Grams': 0.28}, 
    ### fresh cream
    {'Item_name': 'fresh cream', 'Measure': '1', 'Units': 'ml', 'Grams': 0.96},
    ### garam masala
    {'Item_name': 'garam masala', 'Measure': '1', 'Units': 'ml', 'Grams': 0.49},
    ### tandoori masala
    {'Item_name': 'tandoori masala', 'Measure': '1', 'Units': 'ml', 'Grams': 0.51},
    ### tandoori paste
    {'Item_name': 'tandoori paste', 'Measure': '1', 'Units': 'ml', 'Grams': 1.08},
     ### garbanzo flour
    {'Item_name': 'garbanzo flour', 'Measure': '1', 'Units': 'ml', 'Grams': 0.51},
    ### ginger paste
    {'Item_name': 'ginger paste', 'Measure': '1', 'Units': 'ml', 'Grams': 1.35},
    ### ginger root paste
    {'Item_name': 'ginger root paste', 'Measure': '1', 'Units': 'ml', 'Grams': 1.35},
     ### ground ginger root
    {'Item_name': 'ground ginger root', 'Measure': '1', 'Units': 'ml', 'Grams': 0.35},
    ### fresh ginger root
    {'Item_name': 'fresh ginger root', 'Measure': '1', 'Units': 'ml', 'Grams': 0.46},
    {'Item_name': 'fresh ginger root', 'Measure': '1', 'Units': 'inch', 'Grams': 2.00},
    ### lentil and vegetable soup
    {'Item_name': 'lentil and vegetable soup', 'Measure': '1', 'Units': 'g can', 'Grams': 400},
    ### panir
    {'Item_name': 'panir', 'Measure': '1', 'Units': 'ml', 'Grams': 0.89},
    ### low-fat panir
    {'Item_name': 'low-fat panir', 'Measure': '1', 'Units': 'ml', 'Grams': 0.89},
    ### low-fat plain yogurt 
    {'Item_name': 'low-fat plain yogurt', 'Measure': '1', 'Units': 'ml', 'Grams': 0.96},
    {'Item_name': 'plain low-fat yogurt', 'Measure': '1', 'Units': 'ml', 'Grams': 0.96},
    ### low-fat yogurt
    {'Item_name': 'low-fat yogurt', 'Measure': '1', 'Units': 'unit', 'Grams': 170},
    ### mawa
    {'Item_name': 'mawa', 'Measure': '1', 'Units': 'ml', 'Grams': 1.3},
    ### monterey jack cheese
    {'Item_name': 'monterey jack cheese', 'Measure': '1', 'Units': 'ml', 'Grams': 0.47},
    ### mung dal
    {'Item_name': 'mung dal', 'Measure': '1', 'Units': 'ml', 'Grams': 0.96},
    ### naan bread
    {'Item_name': 'naan bread', 'Measure': '1', 'Units': 'whole', 'Grams': 90},
     ### no-salt-added tomato sauce
    {'Item_name': 'no-salt-added tomato sauce', 'Measure': '1', 'Units': 'g can', 'Grams': 225},
    ### nonfat milk
    {'Item_name': 'nonfat milk', 'Measure': '1', 'Units': 'ml', 'Grams': 0.28},
     ### onion flakes
    {'Item_name': 'onion flakes', 'Measure': '1', 'Units': 'ml', 'Grams': 0.32},
     ### panko breadcrumbs
    {'Item_name': 'panko breadcrumbs', 'Measure': '1', 'Units': 'ml', 'Grams': 0.24},
    ### red chile
    {'Item_name': 'red chile', 'Measure': '1', 'Units': 'ml', 'Grams': 1.22}, 
    ### red chili powder
    {'Item_name': 'red chili powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.57}, 
    ### pepper
    {'Item_name': 'pepper', 'Measure': '1', 'Units': 'ml', 'Grams': 0.42},
    ### serrano pepper
    {'Item_name': 'serrano pepper', 'Measure': '1', 'Units': 'small', 'Grams': 6.1},
    ### fresh ground pepper
    {'Item_name': 'fresh ground pepper', 'Measure': '1', 'Units': 'ml', 'Grams': 2},
    ### hot pepper
    {'Item_name': 'hot pepper', 'Measure': '1', 'Units': 'ml', 'Grams': 0.95},
    ### red chili pepper flakes
    {'Item_name': 'red chili pepper flakes', 'Measure': '1', 'Units': 'ml', 'Grams': 0.49}, 
    ### ground red chili pepper
    {'Item_name': 'ground red chili pepper', 'Measure': '1', 'Units': 'ml', 'Grams': 0.36},
    ### dried red chili pepperes
    {'Item_name': 'dried red chili pepperes', 'Measure': '1', 'Units': 'whole', 'Grams': 0.50},
    ### dried red chilies
    {'Item_name': 'dried red chilies', 'Measure': '1', 'Units': 'whole', 'Grams': 0.50},
    ### red chilies
    {'Item_name': 'red chilies', 'Measure': '1', 'Units': 'whole', 'Grams': 0.50},
    ### green chilies
    {'Item_name': 'green chilies', 'Measure': '1', 'Units': 'ml', 'Grams': 1.02}, 
    {'Item_name': 'green chilies', 'Measure': '1', 'Units': 'slice', 'Grams': 4},
     ### green chili
    {'Item_name': 'green chili', 'Measure': '1', 'Units': 'ml', 'Grams': 1.02},
    {'Item_name': 'green chili', 'Measure': '1', 'Units': 'slice', 'Grams': 4}, 
    ### whole green chilies
    {'Item_name': 'whole green chilies', 'Measure': '1', 'Units': 'slice', 'Grams': 4}, 
     ### fresh green chile
    {'Item_name': 'fresh green chile', 'Measure': '1', 'Units': 'ml', 'Grams': 1.02},
    {'Item_name': 'fresh green chile', 'Measure': '1', 'Units': 'slice', 'Grams': 4},
    ### green chili pepper
    {'Item_name': 'green chili pepper', 'Measure': '1', 'Units': 'slice', 'Grams': 4},
    ### pure chili powder
    {'Item_name': 'pure chili powder', 'Measure': '1', 'Units': 'ml', 'Grams': 0.54},
    ### pita bread
    {'Item_name': 'pita bread', 'Measure': '1', 'Units': 'medium', 'Grams': 60},
    ### split red lentils
    {'Item_name': 'split red lentils', 'Measure': '1', 'Units': 'ml', 'Grams': 0.76},
    ### spring onion
    {'Item_name': 'spring onion', 'Measure': '1', 'Units': 'bunch', 'Grams': 25},
    ### teriyaki marinade
    {'Item_name': 'teriyaki marinade', 'Measure': '1', 'Units': 'ml', 'Grams': 1.08},
     ### toor dal
    {'Item_name': 'toor dal', 'Measure': '1', 'Units': 'ml', 'Grams': 0.81},
     ### spinach leaves
    {'Item_name': 'spinach leaves', 'Measure': '1', 'Units': 'ml', 'Grams': 0.12},
    ### garlic clove
    {'Item_name': 'garlic clove', 'Measure': '1', 'Units': 'ml', 'Grams': 0.51},
    {'Item_name': 'garlic clove', 'Measure': '1', 'Units': 'medium', 'Grams': 1},
    {'Item_name': 'garlic clove', 'Measure': '1', 'Units': 'large', 'Grams': 1.5},
    ### cauliflower
    {'Item_name': 'cauliflower', 'Measure': '1', 'Units': 'medium', 'Grams': 588},
     ### dry yeast
    {'Item_name': 'dry yeast', 'Measure': '1', 'Units': 'g package', 'Grams': 7},
     ### eggplant
    {'Item_name': 'eggplant', 'Measure': '1', 'Units': 'big', 'Grams': 220},
    ### tomato
    {'Item_name': 'tomato', 'Measure': '1', 'Units': 'big', 'Grams': 123}, 
    ### whole tomato
    {'Item_name': 'whole tomato', 'Measure': '1', 'Units': 'g can', 'Grams': 400}, 
    ### saffron
    {'Item_name': 'saffron', 'Measure': '1', 'Units': 'piece', 'Grams': 0.5},
    ### dinner roll
    {'Item_name': 'dinner roll', 'Measure': '1', 'Units': 'unit', 'Grams': 28},
]

def update_ings_db_quantities_wac_file(df_ings_db_quantities_wac):
    '''
    Update the database with the quantities in grams of WAC, including missing ingredients or gram conversions.

    Fonts: 
        - https://www.aqua-calc.com/calculate/food-volume-to-weight
        - https://fdc.nal.usda.gov/fdc-app.html#/food-search?query=scallion&type=Foundation
        - https://www.nutritionix.com/ 
        - https://samfusionz-recipes.tripod.com/id127.html
    '''
    # Create a new DataFrame from the list of dictionaries
    df_new_rows = pd.DataFrame(new_rows)

    # Concatenate the original DataFrame with the new DataFrame
    df_ings_db_quantities_updated = pd.concat([df_ings_db_quantities_wac, df_new_rows], ignore_index=True)  

    df_ings_db_quantities_updated.to_csv('../../data/wac/Ingredients_db_quantities_upd.csv', index=False)
