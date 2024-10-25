from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)


urlpatterns = [
    path('login', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify', TokenVerifyView.as_view(), name='token_verify'),
    path('signup', views.signup),
    path('logout', views.logout_view),

]
