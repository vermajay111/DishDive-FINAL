from django.contrib import admin
from .models import Recipe, Ingredient, Ner, Step

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Ner)
admin.site.register(Step)