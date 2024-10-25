import pandas as pd
import json
from django.db import transaction
from recipes.models import Recipe, Step, Ingredient, Ner
from multiprocessing import Pool

def process_row(args):
    recipe, ing_list, steps_list, ner_list = args
    with transaction.atomic():
        # Bulk create Ingredients
        ingredients_to_create = [Ingredient(recipe=recipe, name=name) for name in ing_list]
        Ingredient.objects.bulk_create(ingredients_to_create)

        # Bulk create Steps
        steps_to_create = [Step(recipe=recipe, step=step_text, number=i) for i, step_text in enumerate(steps_list, start=1)]
        Step.objects.bulk_create(steps_to_create)

        # Bulk create Ners
        ners_to_create = [Ner(recipe=recipe, ner=ner_text) for ner_text in ner_list]
        Ner.objects.bulk_create(ners_to_create)

    return True

def process_csv():
    print("reading csv")

    try:
        df = pd.read_csv("cleaned_data.csv")
    except FileNotFoundError:
        print("CSV file not found")
        exit()

    print("converting to array")

    arr = df.values[:100000]  # Take only the first 100,000 items

    print("creating recipes")
    c = 0

    # Parse JSON data outside the loop
    ingredient_lists = [json.loads(items[1]) for items in arr]
    steps_lists = [json.loads(items[2]) for items in arr]
    ner_lists = [json.loads(items[3]) for items in arr]

    recipes_to_create = [Recipe(title=items[0]) for items in arr]
    Recipe.objects.bulk_create(recipes_to_create)

    args_list = [(recipe, ing_list, steps_list, ner_list) for recipe, ing_list, steps_list, ner_list in zip(Recipe.objects.all(), ingredient_lists, steps_lists, ner_lists)]

    with Pool(processes=4) as pool:  # Adjust the number of processes as needed
        results = pool.map(process_row, args_list)
    
    print("done")

process_csv()
