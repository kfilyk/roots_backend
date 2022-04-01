
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView, VerifyUserView

urlpatterns = [
    path('login/', obtain_auth_token),
    path('register/', CreateUserAPIView.as_view()),
    path('logout/', LogoutUserAPIView.as_view()),
    path('token/', VerifyUserView.as_view())
]