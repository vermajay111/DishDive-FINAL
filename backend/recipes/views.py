from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
from functools import lru_cache
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import Recipe, Ingredient, Ner, Step
from .serializers import RecipeSerializer, IngredientSerializer, NerSerializer, StepSerializer, RecipeSerializerDishes
from django.core import serializers
import requests
import json 
from users.models import UserCustomization

model_url = 'http://192.168.0.130:8090/recipes/'

@api_view(['GET'])
@lru_cache(maxsize=None)
@permission_classes([IsAuthenticated])
def get_all_recipes(request):
    recipes = Recipe.objects.prefetch_related('ner').filter(is_public=True)
    paginator = PageNumberPagination()
    paginator.page_size = 10
    paginated_recipes = paginator.paginate_queryset(recipes, request)
    serializer = RecipeSerializer(paginated_recipes, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@lru_cache(maxsize=None) 
@permission_classes([IsAuthenticated])
def get_recipe_by_id(request):
    try:
        pk = str(request.query_params.get('id'))
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = RecipeSerializer(recipe)   
        return Response(serializer.data)
    except:
        return Response({"error": "There is an error it was not found"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quick_search(request):
    try:
        query = request.data.get('title')
        if not query:
            return Response({"error": "Title parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        search_results = Recipe.objects.filter(title__contains=query)[:5]
        if not search_results:
            return Response({"message": "No recipes found for the given query"}, status=status.HTTP_404_NOT_FOUND)
        return Response([{'id': result.id, 'title': result.title} for result in search_results])
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_recipes_by_title(request):
    try:
        query = request.data.get('title')
        if not query:
            return Response({"error": "Title parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        search_results = Recipe.objects.filter(title__contains=query)[:5]
        if not search_results:
            return Response({"message": "No recipes found for the given query"}, status=status.HTTP_404_NOT_FOUND)
        serializer = RecipeSerializer(search_results, many=True)   
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def find_best_recipe(request):
    user_ner = request.data.get('ners')
    results = []
    curr_recipes = Recipe.objects.all()
    
    for item in curr_recipes:
        ners = [ner.ner for ner in item.ner.all()]
        
        if set(ners).issubset(set(user_ner)):
            results.append(item)
    
    serialized_results = RecipeSerializerDishes(results, many=True)  # Serialize list of objects
    return Response({"info": serialized_results.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@lru_cache(maxsize=None) 
@permission_classes([IsAuthenticated])
def ners(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    ner_curr = Ner.objects.all()
    paginated_ners = paginator.paginate_queryset(ner_curr, request)
    serializer = NerSerializer(paginated_ners, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@lru_cache(maxsize=None) 
def create_new_recipe(request):
    #generator_option = request.data.get("source")
    user_ners = request.data.get('ners')
    if True:
        data = {
            'ners': user_ners
        }
        json_data = json.dumps(data)
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.post(model_url, data=json_data, headers=headers)
        if response.status_code == 200:
            return Response(json.loads(response.text))
        else:
            print(f'POST request failed with status code: {response.status_code}')
            return Response({"info": "Error Generating recipe"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"info": "no supported yet"})
    
@api_view(['POST'])
@lru_cache(maxsize=None) 
def post_new_dish(request):
    dish_title = request.data.get('title')
    user_ingredients = request.data.get('ingredients')
    user_steps = request.data.get('steps')
    user_ner = request.data.get('ners')
    is_user_public = request.data.get('is_public', True)
    
    if dish_title and user_ingredients and user_steps and user_ner:
        recipe = Recipe.objects.create(title=dish_title, is_public=is_user_public)
        for ingredient in user_ingredients:
            Ingredient.objects.create(recipe=recipe, name=ingredient)
        for step in user_steps:
            Step.objects.create(recipe=recipe, description=step)
        for ner in user_ner:
            Ner.objects.create(recipe=recipe, ner=ner)
            
        return Response({"info": "Dish created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def saveDishUser(request):
    recipe = request.data.get('recipe')
    recipe = Recipe.objects.get(id=recipe)
    user = UserCustomization.objects.get(request.user)
    if recipe not in user.saved_dishes.all():
        user.saved_dishes.add(recipe)
        return Response({"info": "saved disd"}, status=status.HTTP_200_OK)
    else:
        user.saved_dishes.remove(recipe)
        return Response({"info": "Dish removed from saved dishes"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likeDish(request):
    recipe = request.data.get('recipe')
    recipe = Recipe.objects.get(id=recipe)
    try:
        if request.user not in recipe.likes.all():
            recipe.likes.add(request.user)
            return Response({"info": "Dish liked"}, status=status.HTTP_200_OK)
        else:
            recipe.likes.remove(request.user)
            return Response({"info": "Dish removed from likes"}, status=status.HTTP_200_OK)
    except:
        return Response({"info": "Error completing action"}, status=status.HTTP_200_OK)