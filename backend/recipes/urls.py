from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_recipes, name='index'),
    path('dish', views.get_recipe_by_id, name='dish'),
    path('search_dish', views.search_recipes_by_title, name='search'),
    path('quick_search', views.quick_search, name="quick_search"),
    path('dishes', views.find_best_recipe, name="quick_search"),
    path('ners/', views.ners),
    path('generate_new_recipe/', views.create_new_recipe),
    path('like_dish', views.likeDish),
    path('save_dish', views.saveDishUser),   
]
