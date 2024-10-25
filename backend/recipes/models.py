from django.db import models
from django.contrib.auth.models import User  # Ensure this import exists

class Recipe(models.Model):
    title = models.CharField(max_length=300)
    thumbnail = models.ImageField(upload_to='recipe_images/', null=True, blank=True)
    is_public = models.BooleanField(default=True)
    likes = models.ManyToManyField(User, related_name='liked_recipes', blank=True)  # Corrected reference to User
    def __str__(self):
        return self.title


class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None, related_name='ingredient')
    name = models.CharField(max_length=400)
    def __str__(self):
        return self.name

class Ner(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None, related_name='ner')
    ner = models.CharField(max_length=400)
    def __str__(self):
        return self.ner

class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None, related_name='step')
    step = models.TextField(max_length=400)
    number = models.IntegerField()
    
    def __str__(self):
        return self.step
    
class UserDish(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s dish: {self.recipe.title}"
