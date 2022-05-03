from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Device, Experiment, Stage, Plant, Pod
from django.contrib.auth import get_user_model

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

# Serializers convert models to JSON so they can be displayed on a react frontend
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('id', 'model', 'name', 'user', 'token', 'registration_date', 'last_update', 'is_online', 'mac_address', 'experiment', 'fill_res_flag') # columns of the database table we are turning into a json object

class ExperimentSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField()

    class Meta:
        model = Experiment
        fields = ('id', 'description', 'current_stage', 'stages', 'day', 'stage_day', 'device', 'device_name', 'score', 'user', 'start_date', 'end_date', 'pod1', 'pod2', 'pod3', 'pod4', 'pod5', 'pod6', 'pod7', 'pod8', 'pod9', 'pod10')
        ## fields = '__all__'
        read_only_fields = ['user']

class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ('id', 'author', 'days', 'watering_cycles', 'nutrient_cycles', 'nutrient_type', 'blue_intensity', 'red_intensity', 'white1_intensity', 'white2_intensity', 'lights_on_hours', 'score')

class PodSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField()

    class Meta:
        model = Pod
        fields = ('id', 'experiment', 'plant', 'plant_name', 'position', 'state', 'score', 'start_date', 'end_date')

class PlantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plant
        fields = ('id', 'name', 'supplier', 'score')

class CreateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = get_user_model()
        fields = ('username', 'password', 'first_name', 'last_name')
        write_only_fields = ('password')
        read_only_fields = ('is_staff', 'is_superuser', 'is_active',)

    def create(self, validated_data):
        user = super(CreateUserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'password', 'first_name', 'last_name')


