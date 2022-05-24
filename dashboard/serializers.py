from unittest.util import _MAX_LENGTH
from wsgiref import validate
from rest_framework import serializers
from .models import Device, Experiment, Phase, Plant, Pod
from django.contrib.auth import get_user_model

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

# Serializers convert models to JSON so they can be displayed on a react frontend
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        #fields = ('id', 'model', 'name', 'user', 'token', 'registration_date', 'last_update', 'is_online', 'mac_address', 'experiment', 'fill_res_flag') # columns of the database table we are turning into a json object
        fields = '__all__'

class ExperimentSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    def create(self, validated_data):

        experiment_obj = Experiment.objects.create(
            name = validated_data['name'],
            start_date=validated_data['start_date'],
            device = validated_data['device'],
            user = validated_data['user'],
            day = validated_data['day'],
            phase_day = validated_data['phase_day'],
            current_phase = validated_data['current_phase'],

        )
        for pod in validated_data['pod_list']: 
            print("POD:", pod)
            '''
            plant = validated_data['plant_pods'][pod]['plant']
            Pod.objects.create(plant=Plant.objects.get(pk=plant), start_date=validated_data['start_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk, position=pos))
            '''
        return experiment_obj

    class Meta:
        model = Experiment
        fields = '__all__'
        read_only_fields = ['user']

class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = '__all__'

class PodSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    
    def create(self, validated_data):
        print(**validated_data)
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


