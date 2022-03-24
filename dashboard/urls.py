
from django.urls import path, re_path
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView

urlpatterns = [
    path('login',
        obtain_auth_token),
    path('register',
        CreateUserAPIView.as_view()),
    path('logout',
        LogoutUserAPIView.as_view())
]

'''
urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard2/', views.dashboard2, name='dashboard2'),
]
'''