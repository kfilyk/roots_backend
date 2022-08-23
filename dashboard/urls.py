
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView, VerifyUserView

"""
OVERALL FILE PURPOSE: SETS THE URL PATHS FOR USER MANAGEMENT (LOGIN, REGISTER, LOGOUT ETC.)
THIS URL PATH IS UNDER /AUTH

FOR EXAMPLE:
website.com/auth/login
website.com/auth/register
...

ALSO SEE plant_science_app/urls.py for the entire URL PATHS
"""

urlpatterns = [
    path('login/', obtain_auth_token),
    path('register/', CreateUserAPIView.as_view()),
    path('logout/', LogoutUserAPIView.as_view()),
    path('token/', VerifyUserView.as_view()),
]