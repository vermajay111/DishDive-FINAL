from rest_framework import serializers
from .models import Recipe, Ingredient, Ner, Step


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class NerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ner

        fields = ['ner']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step

        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(many=True, read_only=True)
    ner = NerSerializer(many=True, read_only=True)
    step = StepSerializer(many=True, read_only=True)
    
    
    class Meta:
        model = Recipe
        fields = '__all__'



class RecipeSerializerDishes(serializers.ModelSerializer):
    ner = NerSerializer(many=True, read_only=True)
    class Meta:
        model = Recipe
        fields = ['title', 'ner'] 