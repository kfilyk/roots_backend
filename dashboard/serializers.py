from rest_framework import serializers
from .models import Device

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

# Serializers convert models to JSON so they can be displayed on a react frontend
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('device', 'name', 'user', 'token', 'creation_date', 'last_update', 'is_online', 'mac_address', 'experiment')