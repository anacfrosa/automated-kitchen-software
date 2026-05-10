import pandas as pd

def get_non_matching_ingredient_unit(df1, df2):
    '''
    Return a dataframe with all the peer (ingredient, unit) not registered on ings_db_quantities of wac table.

    Parameters:
        df1 (dataframe): Dataframe with the restaurant recipe details (ingredients, measures, units, servings).
        df2 (dataframe): Dataframe with the conversions to grams.
    '''

    # Get unique peer values (ingredient, unit)
    df1_unique_ings_unit = df1.drop_duplicates(subset=['Ingredient', 'Unit']).sort_values(by='Ingredient').reset_index(drop=True)
    #display(df1_unique_ings_unit)
    
    # Check which ones are not a match on df2 
    # Ensure the columns have consistent names for merging
    df2_db_conversion = df2.rename(columns={'Item_name': 'Ingredient', 'Units': 'Unit'})
    
    # Merge with an indicator to find non-matching entries
    merged_df = df1_unique_ings_unit.merge(df2_db_conversion, on=['Ingredient', 'Unit'], how='left', indicator=True)
    
    # Filter for non-matching entries
    df1_non_matching_ings_unit = merged_df[merged_df['_merge'] == 'left_only'].drop(columns='_merge').reset_index(drop=True)
    
    return df1_non_matching_ings_unit

def update_restaurant_ingredient_names(df):
    '''
    Return the restaurant recipes details dataframe with updated ingredient names 
    to match those in the conversion table.

    Args: 
        df - Restaurant recipes details dataframe
    '''    

    replacement_ingredients = {
        'all-purpose flour': 'all purpose flour',
        'active dry yeast': 'dry yeast',
        'bay leaves': 'bay leaf',
        'boneless skinless chicken breasts': 'boneless skinless chicken breast',
        'cayenne': 'cayenne pepper',
        'cayenne pepper pepper': 'cayenne pepper',
        'cilantro leaf': 'cilantro',
        'cumin seeds': 'cumin seed',
        'cornflour': 'corn flour',
        'eggs': 'egg',
        'fast-rising active dry yeast': 'dry yeast',
        'fast-rising dry yeast': 'dry yeast',
        'fresh coriander leaves': 'cilantro',
        'fresh corn kernels': 'corn kernel',
        'ginger': 'ginger root',
        'ginger root root': 'ginger root',
        'ginger root rootroot': 'ginger root',
        'ginger rootroot': 'ginger root',
        'ginger root root paste': 'ginger root paste',
        'ginger-garlic paste': 'ginger garlic paste',
        'ginger root root-garlic paste': 'ginger garlic paste',
        'ginger root-garlic paste': 'ginger garlic paste',
        'ginger root garlic paste': 'ginger garlic paste',
        'golden raisin': 'raisin',
        'tomatoes': 'tomato',
        'onions': 'onion',
        'scallion': 'green onion',
        'mustard seeds': 'mustard seed',
        'potatoes': 'potato',
        'plain flour': 'all purpose flour',
        'raisins': 'raisin',
        'seasoning salt': 'seasoned salt',
        'saffron thread': 'saffron',
        'orange food coloring': 'food coloring',
        'hing': 'asafoetida powder',
        'sesame seeds': 'sesame seed',
        'whole wheat bread crumbs': 'bread crumb'
    }

    for old_name, new_name in replacement_ingredients.items():
        df['Ingredient'] = df['Ingredient'].str.replace(old_name, new_name, case=False)

    return df

def get_unique_ings_with_nan_unit(df):
    '''
    Return all the unique ingredients with a measure, but withour a unit value.
    '''
    return df[(df['Unit'].isna()) & (df['Measure'].notna())].drop_duplicates(subset='Ingredient')
 
def update_restaurant_ingredient_units(df):
    '''
    Return a new dataframe with the replaced missing units.
    '''

    name_replacements = {
        'garlic cloves': 'garlic clove',
        'chili peppers': 'chili pepper',
        'chicken wings': 'chicken wing',
        'chicken breasts': 'chicken breast',
        'dinner rolls': 'dinner roll',
        'cloves': 'clove',
        'serrano chili': 'serrano pepper'
    }
    for old_value, new_value in name_replacements.items():
        df['Ingredient'] = df['Ingredient'].str.replace(old_value, new_value, case=False)

    unit_replacements = {
        ('aloo paratha', 'green chili pepper'): 'slice',
        ('aloo paratha', 'onion'): 'small',
        ('baingan bartha', 'green chilies'): 'slice',
        ('bhindi do piazza', 'bay leaf'): 'unit',  
        ('bhindi do piazza', 'clove'): 'whole',
        ('bhindi do piazza', 'green cardamoms'): 'whole',
        ('coconut chicken curry', 'onion'): 'small',
        ('coconut chicken curry', 'tomato'): 'small', 
        ('coconut chicken curry', 'garlic clove'): 'medium',
        ('chicken biryani', 'serrano pepper'): 'small',
        ('crispy chicken sliders', 'boneless skinless chicken breast'): 'unit',
        ('crispy chicken sliders', 'dinner roll'): 'unit',
        ('curry vindaloo', 'green chilies'): 'slice',
        ('curry vindaloo', 'onion'): 'small',
        ('curry vindaloo', 'tomato'): 'small',
        ('curry vindaloo', 'chili pepper'): 'small',
        ('chicken triangles', 'chicken breast'): 'unit',
        ('chicken triangles', 'garlic clove'): 'medium',
        ('chicken korma', 'cinnamon stick'): 'small',
        ('chicken korma', 'bay leaf'): 'unit',
        ('chicken biryani', 'garlic clove'): 'medium',
        ('chicken saag', 'onion'): 'small',
        ('chicken saag', 'bay leaf'): 'unit',
        ('chicken saag', 'garlic clove'): 'medium',
        ('chicken saag', 'fresh green chile'): 'slice',
        ('chaat papri', 'low-fat yogurt'): 'unit',
        ('fish curry', 'dried red chilies'): 'whole',
        ('fish curry', 'red chilies'): 'whole', 	
        ('fish curry', 'bay leaf'): 'unit',
        ('fish korma', 'green chilies'): 'slice',
        ('gobi manchurian', 'dried red chilies'): 'whole',  
        ('garlic naan', 'egg'): 'small',
        ('garlic naan', 'garlic clove'): 'medium',
        ('gulab jamun', 'egg'): 'small',
        ('hara bhara kebabs', 'garlic clove'): 'medium',
        ('hara bhara kebabs', 'green chilies'): 'slice', 
        ('indian fish pakoras', 'green chili'): 'slice',
        ('kheer', 'green cardamom pods'): 'whole',
        ('kadhai paneer', 'bay leaf'): 'unit',
        ('kadhai paneer', 'green chilies'): 'slice', 	
        ('lamb karahi', 'oil'): 'small',
        ('lamb karahi', 'tomato'): 'small',
        ('malai kofta curry', 'green chilies'): 'slice',
        ('spicy chicken wings', 'chicken wing'): 'small',
        ('spinach naan', 'boneless chicken thighs'): 'unit',
        ('sarson ka saag', 'whole green chilies'): 'slice',
        ('sarson ka saag', 'green onion'): 'small',
        ('vegetable samosa', 'green chilies'): 'slice',
        ('vegetable pakora', 'green chili'): 'slice', 
        ('vegetable pakora', 'potato'): 'small',	
        ('rasmalai', 'green cardamoms'): 'whole', 	
        ('yellow dal fry', 'garlic clove'): 'medium', 
        ('yellow dal fry', 'jalapeno'): 'small',
    }

    for index, row in df.iterrows():
        key = (row['Recipe'], row['Ingredient'])
        if key in unit_replacements:
            df.at[index, 'Unit'] = unit_replacements[key]

    return df

def extract_first_value(item, data_type):
    '''
    Extract the first value from each range or keep the number
    '''
    if isinstance(item, str) and '-' in item:
        # It's a range, extract the first value and convert to the specified type
        return data_type(item.split('-')[0])
    else:
        if pd.isna(item):
            return item # stay NaN
        else:
            # It's a number, convert to the specified type and keep it as is
            return data_type(item)

def calculate_quantities_in_grams(row, df_ings_db_quantities):
    '''
    Calculate the quantities in grams of each ingredient.

    Parameters:
        row (dataframe row): The row should have keys 'Ingredient', 'Measure', and 'Unit'.
        df_ings_db_quantities: dataframe table with the convertions to grams.

    Returns:
        float, bool: The quantity in grams, True if the quantity was not found, False otherwise.
    '''
    ingredient = row['Ingredient']
    measure = row['Measure']
    unit = row['Unit']
    if pd.isna(measure):
        # The measure is unknown
        return 0, False
    elif unit == 'g': 
        # The measure is already in grams
        return measure, False
    elif unit == 'kg':
         # The measure is in kg, so convert to g
        return measure * 1000, False
    else:
        # Find the grams based on the ingredient and the unit
        found_line = df_ings_db_quantities.loc[
            (df_ings_db_quantities['Item_name'] == ingredient) & 
            (df_ings_db_quantities['Units'] == unit)
        ]
        
        # Extract the value from the grams column
        if not found_line.empty:
            grams_value = found_line['Grams'].values[0]
            ing_measure_grams = measure * grams_value
            ing_measure_grams = round(ing_measure_grams, 2)  # Round to 2 decimal places
            return ing_measure_grams, False
        else:
            return 0, True # Not found because of the ingredient or unit

def update_restaurant_servings(df):
    '''
    Return a new restaurant dataframe without missing servings.

    Parameters:
        df (dataframe): Restaurant recipes with quantities in grams.
    '''

    # Identify the recipes with missing serving number 
    df_missing_servings = df[df['Serving'].isna()]
    #display(df_missing_servings.drop_duplicates(subset='Recipe'))

    if(len(df_missing_servings) == 0):
        return df

    # Replace the missing serving values 
    serving_replacements = {
        'garlic naan' : 6,
        'vegetable samosa' : 5,
        'aloo paratha' : 6,
        'hara bhara kebabs': 2,
        'shrimp': 2,
        'crispy chicken sliders': 4,
        
    }
    # Replace the NaN values in the Serving column based on the recipe
    df.loc[:, 'Serving'] = df.apply(
        lambda row: serving_replacements[row['Recipe']] if pd.isna(row['Serving']) else row['Serving'],
        axis=1
    )
    return df

def calculate_missing_quantities(df):
    '''
    
    '''
    # Delete all the oil for frying
    df = df[~((df['Ingredient'] == 'oil') & (df['Quantity'] == 0))]
    #display(df_restaurant_recipes_grams)

    ### Determine missing quantities based on the mean
    # Step 1: Group by 'Ingredient' and sum 'Quantity'
    df_total_quantity_per_ing = (df.groupby('Ingredient')['Quantity']
                                .sum()
                                .reset_index(name='Total Quantity per Ingredient')
                            )

    # Step 2: Calculate total serving for each ingredient
    # We need to exclude the serving where the quantity is 0
    df_total_serving_per_ing = (df[df['Quantity'] != 0]
                                .groupby('Ingredient')['Serving']
                                .sum()
                                .reset_index(name='Total Serving per Ingredient')
                            )

    # Step 3: Merge the grouped dataframes on 'Ingredient'
    df_mean_quantity_per_ing = df_total_quantity_per_ing.merge(df_total_serving_per_ing, on='Ingredient')

    # Step 4: Calculate mean quantity per serving
    df_mean_quantity_per_ing['Mean Quantity per Ingredient'] = round(( df_mean_quantity_per_ing['Total Quantity per Ingredient'] / 
                                                                df_mean_quantity_per_ing['Total Serving per Ingredient']
                                                            ), 2)

    df_mean_quantity_per_ing = df_mean_quantity_per_ing[['Ingredient', 'Mean Quantity per Ingredient']]

    # Merge with left join
    df_new_quantity = df.merge(df_mean_quantity_per_ing, on='Ingredient', how='left')

    # Calculate New Quantity
    df_new_quantity['New Quantity'] = df_new_quantity.apply(
        lambda row: round(row['Mean Quantity per Ingredient'] * row['Serving'], 2) if row['Quantity'] == 0 else row['Quantity'],
        axis=1
    )

    if(len(df_new_quantity[df_new_quantity['New Quantity'].isna()]) != 0):
        # Resolve the ingredients that still dont have a quantity (when the ingredient appear one time and his measure is Nan)
        replacement_rules = {
            ('malai kofta curry', 'gravy'): 14.5,   # all the ingredients
            ('carrot halwa', 'cardamom powder'): 2, # 1 teaspoon
            ('indian fish pakoras', 'lemons'): 42,  # Juice from ½ lime or lemon
            ('chicken rice bowl', 'cooked rice'): 474 , # 3 cups long grain white rice, cooked
            ('chicken rice bowl', 'vegetables'): 280, # mixed vegetables
            ('spinach naan', 'cooking spray'): 0, # for frying
        }

        # Apply the replacement rules
        for index, row in df_new_quantity.iterrows():
            key = (row['Recipe'], row['Ingredient'])
            if key in replacement_rules:
                df_new_quantity.at[index, 'New Quantity'] = replacement_rules[key]

    df_new_restautant_recipes_grams = df_new_quantity[df_new_quantity['New Quantity'] != 0]

    # Select and rename columns
    df_new_restautant_recipes_grams = df_new_restautant_recipes_grams[['Recipe', 'Ingredient', 'New Quantity', 'Serving']]
    df_new_restautant_recipes_grams.columns = ['Recipe', 'Ingredient', 'Quantity', 'Serving'] 

    return df_new_restautant_recipes_grams



    