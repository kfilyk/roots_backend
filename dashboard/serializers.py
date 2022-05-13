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
        fields = '__all__'

class ExperimentSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    '''
    plant1 = serializers.IntegerField(allow_null=True)
    plant2 = serializers.IntegerField(allow_null=True)
    plant3 = serializers.IntegerField(allow_null=True)
    plant4 = serializers.IntegerField(allow_null=True)
    plant5 = serializers.IntegerField(allow_null=True)
    '''

    def create(self, validated_data):

        experiment_obj = Experiment.objects.create(
            start_date=validated_data['start_date'],
            end_date = validated_data['end_date'],
            device = validated_data['device'],
            description = validated_data['description'],
            user = validated_data['user']
        )
        for pos in validated_data.plant_pods: 
            plant = validated_data.plant_pods[pos]
            Pod.objects.create(plant=Plant.objects.get(pk=plant), start_date=validated_data['start_date'], end_date=validated_data['end_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk, position=pos))

        '''
        p1 = validated_data.pop('plant1')
        p2 = validated_data.pop('plant2')
        p3 = validated_data.pop('plant3')
        p4 = validated_data.pop('plant4')
        p5 = validated_data.pop('plant5')
        

        pod1 = Pod.objects.create(plant=Plant.objects.get(pk=p1), start_date=validated_data['start_date'], end_date=validated_data['end_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk))
        pod2 = Pod.objects.create(plant=Plant.objects.get(pk=p2), start_date=validated_data['start_date'], end_date=validated_data['end_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk))
        pod3 = Pod.objects.create(plant=Plant.objects.get(pk=p3), start_date=validated_data['start_date'], end_date=validated_data['end_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk))
        pod4 = Pod.objects.create(plant=Plant.objects.get(pk=p4), start_date=validated_data['start_date'], end_date=validated_data['end_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk))
        pod5 = Pod.objects.create(plant=Plant.objects.get(pk=p5), start_date=validated_data['start_date'], end_date=validated_data['end_date'], experiment=Experiment.objects.get(pk=experiment_obj.pk))

        experiment_obj.pod1=pod1
        experiment_obj.pod2=pod2
        experiment_obj.pod3=pod3
        experiment_obj.pod4=pod4
        experiment_obj.pod5=pod5
        experiment_obj.save()
        '''
        return experiment_obj

    class Meta:
        model = Experiment
        # fields = ('id', 'description', 'current_stage', 'stages', 'day', 'stage_day', 'device', 'device_name', 'score', 'user', 'start_date', 'end_date', 'pod1', 'pod2', 'pod3', 'pod4', 'pod5', 'pod6', 'pod7', 'pod8', 'pod9', 'pod10')
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


