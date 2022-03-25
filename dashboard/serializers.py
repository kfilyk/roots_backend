from rest_framework import serializers
from .models import Device, Experiment

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

# Serializers convert models to JSON so they can be displayed on a react frontend
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('id', 'name', 'user', 'token', 'registration_date', 'last_update', 'is_online', 'mac_address', 'experiment') # columns of the database table we are turning into a json object

class ExperimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiment
        fields = ('id', 'description', 'recipe', 'device', 'score', 'start_date', 'end_date', 'pod1', 'pod2', 'pod3', 'pod4', 'pod5', 'pod6', 'pod7', 'pod8', 'pod9', 'pod10')