from django.db import models
from django.contrib.auth.models import User

class UserCustomization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    saved_dishes = models.ManyToManyField('recipes.Recipe', blank=True)
    user_dishes = models.ManyToManyField('recipes.UserDish', blank=True)  # Corrected reference to UserDish

    def __str__(self):
        return f"Customization for {self.user.username}"
