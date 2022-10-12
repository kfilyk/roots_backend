from unittest.util import _MAX_LENGTH
from wsgiref import validate
from rest_framework import serializers
from .models import Device, Experiment, Recipe, Phase, Plant, Pod, ExperimentReading, PodReading
from django.contrib.auth import get_user_model

"""
OVERALL FILE PURPOSE: FILE OUTLINES SERIALIZERS USED IN PROJECT

Serializers in Django REST Framework are responsible for converting objects into data types understandable by javascript and front-end frameworks. 
Serializers also provide deserialization, allowing parsed data to be converted back into complex types, after first validating the incoming data.
FOR MORE INFO: https://www.django-rest-framework.org/api-guide/serializers/
"""

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

# Serializers convert models to JSON so they can be displayed on a react frontend
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

class ExperimentSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    recipe_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    def create(self, validated_data):
        return Experiment.objects.create(**validated_data)

    class Meta:
        model = Experiment
        fields = '__all__'
        read_only_fields = ['user']

class PodReadingSerializer(serializers.ModelSerializer):

    class Meta:
        model = PodReading
        fields = '__all__'

class ExperimentReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentReading
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ['author']

class PhaseSerializer(serializers.ModelSerializer):
    '''
    user_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    def create(self, validated_data):
        phase_obj = Phase.objects.create(
            name = validated_data['name'],
            type=validated_data['type'],
            days = validated_data['days'],
            #user = self.context['request'].user,
            waterings_per_day= validated_data['waterings_per_day'],
            watering_duration= validated_data['watering_duration'],
            blue_intensity = validated_data['blue_intensity'],
            red_intensity = validated_data['red_intensity'],
            white_intensity = validated_data['white_intensity'],
            lights_on_hours = validated_data['lights_on_hours']
        )
        return phase_obj

    '''

    class Meta:
        model = Phase
        fields = '__all__'
        #read_only_fields = ['user']


class PodSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    species = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    def create(self, validated_data):
        #print(**validated_data)
        return Pod.objects.create(**validated_data)

    class Meta:
        model = Pod
        fields = '__all__'

class PlantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plant
        fields = '__all__'

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
