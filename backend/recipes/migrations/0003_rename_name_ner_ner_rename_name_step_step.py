# Generated by Django 5.0.2 on 2024-02-22 22:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0002_remove_recipe_directions_remove_recipe_ingredients_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ner',
            old_name='name',
            new_name='ner',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='name',
            new_name='step',
        ),
    ]
