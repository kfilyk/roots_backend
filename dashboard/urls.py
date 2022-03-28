
from django.urls import path, re_path
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView
from rest_framework.response import Response

urlpatterns = [
    path('login/', obtain_auth_token),
    path('register/', CreateUserAPIView.as_view()),
    path('logout/', LogoutUserAPIView.as_view())
]