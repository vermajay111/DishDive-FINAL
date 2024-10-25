# Generated by Django 5.1.1 on 2024-10-12 20:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0008_recipe_likes_userdish'),
        ('users', '0002_usercustomization_saved_dishes'),
    ]

    operations = [
        migrations.AddField(
            model_name='usercustomization',
            name='user_dishes',
            field=models.ManyToManyField(blank=True, to='recipes.userdish'),
        ),
    ]
