"""plant_science_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# Project-level URL PATH FILE accesses each app-level 'urls.py' file

from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from dashboard import views
from django.urls import path, include, re_path

router = routers.DefaultRouter()
router.register(r'devices', views.DeviceView, 'dashboard')
router.register(r'experiments', views.ExperimentView, 'dashboard')

urlpatterns = [
    path('admin/', admin.site.urls),
    # 'dashboard' path would hypothetically connect the urls.py file in 'dashboard' app - but code has been commented out. dashboard app exclusively for accessing database objects instead. 'frontend' used for displaying urls at :3000 port.
    #path('dashboard/', include('dashboard.urls')),
    path('api/', include(router.urls)),
    path('auth/', include('dashboard.urls')),
]
