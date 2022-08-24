from urllib3 import HTTPResponse
from dashboard.models import Device, Experiment, Phase, Plant, Pod, ExperimentReading, PodReading, Recipe
from rest_framework import viewsets
from django.forms.models import model_to_dict
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer, UserSerializer, PhaseSerializer, PlantSerializer, PodSerializer, ExperimentReadingSerializer, RecipeSerializer
from django.core import serializers
from django_filters import rest_framework as filters
from django.db.models.functions import Length

from rest_framework.filters import OrderingFilter
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated 
from django.db.models import F
from rest_framework.decorators import action
from django.http import HttpResponse, JsonResponse
from datetime import datetime
from django.utils.timezone import make_aware
from .v2_mqtt import MQTT
from .generic_mqtt_client import GenericMQTT
import json
from django.utils import timezone
from datetime import datetime, timedelta
from django.db import IntegrityError

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

class DeviceView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = DeviceSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['POST'], name='send_command')
    def send_command(self, request):
        command = int(request.data['parameters']['id'])
        device = request.data['parameters']['device']
        broker = MQTT()
        if command == 0:
            data = json.loads(broker.get_device_status(device))
            data = {key: data[key] for key in data if key not in ['luxZone', 'mqttConfig', 'totalLuxZones', 'wifiCredentials']}
        elif command == 1:
            data = {}
            # REQUIRES CHANGES TO V2_MQTT.py
        elif command == 7:
            timezone = request.data['parameters']['timezone']
            data = broker.change_timezone(device, timezone)
        elif command == 11:
            hour = int(request.data['parameters']['hour'])
            minute = int(request.data['parameters']['minute'])
            print(hour, minute)
            data = {"dailyStartTime": broker.set_start_time(device, hour, minute)}
        elif command == 12:
            data = {
                "macAddress": broker.trigger_OTA(device),
                "msg": "OTA Trigger sent, check Mender to see if device is downloading firmware"}
        elif command == 14:
            stage = int(request.data['parameters']['stage'])
            cycle = int(request.data['parameters']['cycle'])
            data = broker.change_stage_cycle(device, stage, cycle)
        else: 
            data = {"error": "wrong command id"}
        return JsonResponse(data, safe=False)
        

    @action(detail=False, methods=['GET'], name='tester_call')
    def tester_call(self, request):

        recipe = Recipe.objects.filter(id=1) \
                               .select_related('phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9', 'phase10')

        stages = []
        if recipe[0].phase1 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase1))
        if recipe[0].phase2 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase2))
        if recipe[0].phase3 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase3))
        if recipe[0].phase4 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase4))
        if recipe[0].phase5 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase5))
        if recipe[0].phase6 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase6))
        if recipe[0].phase7 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase7))
        if recipe[0].phase8 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase8))
        if recipe[0].phase9 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase9))
        if recipe[0].phase10 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase10))

        recipe_json = {
            "name": recipe[0].name.replace(" ", "_") + ".json",
            "recipeFormatVersion":1,
            "pod1GrowthRate":1.2,
            "pod2GrowthRate":1.2,
            "pod3GrowthRate":1.2,
            "pod4GrowthRate":1.2,
            "pod5GrowthRate":1.2,
            "luxThresholdArray":"",
            "totalLuxZones":"",
            "waterConsumptionRate":1001.5,
            "transitionRandomness":15,
            "stages": stages,
        }

        return JsonResponse(recipe_json, status=200)
        # return Response(status=200)

    # this generates a recipe during "AddExperiment"
    @action(detail=False, methods=['POST'], name='change_recipe')
    def change_recipe(self, request):
        print("CHANGE RECIPE DEVICE: ", request.data['device_id'])
        print("CHANGE RECIPE: ", request.data['new_recipe_id'])

        id = Device.objects.get(id=request.data['device_id']).id
        recipe = Recipe.objects.filter(id=request.data['new_recipe_id']) \
                        .select_related('phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9', 'phase10')

        stages = []
        if recipe[0].phase1 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase1))
        if recipe[0].phase2 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase2))
        if recipe[0].phase3 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase3))
        if recipe[0].phase4 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase4))
        if recipe[0].phase5 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase5))
        if recipe[0].phase6 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase6))
        if recipe[0].phase7 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase7))
        if recipe[0].phase8 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase8))
        if recipe[0].phase9 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase9))
        if recipe[0].phase10 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase10))

        recipe_json = {
            "name": recipe[0].name.replace(" ", "_") + ".json",
            "recipeFormatVersion":1,
            "pod1GrowthRate":1.2,
            "pod2GrowthRate":1.2,
            "pod3GrowthRate":1.2,
            "pod4GrowthRate":1.2,
            "pod5GrowthRate":1.2,
            "luxThresholdArray":"",
            "totalLuxZones":"",
            "waterConsumptionRate":1001.5,
            "transitionRandomness":15,
            "stages": stages,
        }
        broker = MQTT()
        data = broker.trigger_recipe(id, recipe_json, recipe[0].name.replace(" ", "_") + ".json")
        print("DATA: ", data)
        return JsonResponse(data, safe=False)

    @action(detail=False, methods=['POST'], name='check_devices_online')
    def check_devices_online(self, request):
        #query = Device.objects.filter(id__in=request.data['devices'])
        #data = list(Device.objects.all().values('id', is_online=F('is_online')))
        data = list(Device.objects.all().values('id', 'is_online'))
        return JsonResponse(data, safe=False)

    def get_queryset(self):
        user = self.request.user
        return Device.objects.filter(user = user.id)


class ExperimentReadingView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentReadingSerializer
    filter_backends = [filters.DjangoFilterBackend,]
    filterset_fields = ['experiment']

    def create(self, request, *args, **kwargs):
        try:
            print("FLAG R DATA: ", request.data)
            pr_values = request.data.get('pod_readings')
            ec = None if request.data.get('electrical_conductance') == '' else request.data.get('electrical_conductance')
            ph = None if request.data.get('reservoir_ph')  == '' else request.data.get('reservoir_ph')
            temp = None if request.data.get('temperature') == '' else request.data.get('temperature')
            hum = None if request.data.get('humidity')  == '' else request.data.get('humidity')
            #exp_r = ExperimentReading.objects.create(experiment=Experiment.objects.get(id=request.data.get('experiment')), electrical_conductance= request.data.get('electrical_conductance'), reservoir_ph=request.data.get('reservoir_ph'), temperature=request.data.get('temperature'), humidity=request.data.get('humidity'))
            exp_r = ExperimentReading.objects.create(experiment=Experiment.objects.get(id=request.data.get('experiment')), electrical_conductance= ec, reservoir_ph=ph, temperature=temp, humidity=hum)
            exp_id = exp_r.experiment_id
            pod_readings = []
            for i in range(len(pr_values)):
                pod_id = pr_values[i].pop('pod', None)
                pod_readings.append(PodReading(experiment=Experiment.objects.get(id=exp_id), experiment_reading=ExperimentReading.objects.get(id=exp_r.id), pod=Pod.objects.get(id=pod_id), **pr_values[i]))
            PodReading.objects.bulk_create(pod_readings)
            return Response("HELLO WORLD", status=200)
        except Exception as e: 
            print("ERROR IN EXPERIMENT_READING_VIEW: create ", e)
            return Response(status=500)

    def get_queryset(self):
        user = self.request.user
        return ExperimentReading.objects.all()
    
    @action(detail=False, methods=['POST'], name='get_last_reading')
    def get_last_reading(self, request):
        exp_id = request.data['exp_id']
        qs = Pod.objects.filter(experiment = exp_id, end_date__isnull=True).annotate(plant_name=F('plant__name'))
        pods = list(qs.values())
        capacity = Device.objects.get(id=Experiment.objects.get(id=exp_id).device.id).capacity
        try:
            latest = ExperimentReading.objects.filter(experiment=exp_id).latest('reading_date')
            return JsonResponse({"latest_reading": model_to_dict(latest), "pods": pods, "capacity": capacity}, safe=False)
        except ExperimentReading.DoesNotExist:
            latest = {"exp_id": -1}
            return JsonResponse({"latest_reading": latest, "pods": pods, "capacity": capacity}, safe=False)


    @action(detail=False, methods=['POST'], name='exp_reading_dates')
    def exp_reading_dates(self, request):
        qs = ExperimentReading.objects.filter(experiment=request.data['exp_id']).order_by('reading_date')
        return JsonResponse(list(qs.values('id', 'reading_date')), safe=False)
        

class ExperimentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        exp_id = super().create(request, *args, **kwargs).data['id']
        exp = Experiment.objects.get(id=exp_id)
        pod_selection = request.data['pod_selection']
        #start_date = make_aware(datetime.strptime(request.data['start_date'], '%Y-%m-%d-%H-%M'))
        start_date = make_aware(datetime.strptime(request.data['start_date'], '%Y-%m-%d'))
        print(start_date)
        phase = 0

        #new_pods = []
        for p in pod_selection:
            #new_pods.append(Pod(start_date=start_date, phase=phase, position=p, plant=Plant.objects.get(id=pods[p]), experiment=exp))
            Pod.objects.create(start_date=start_date, phase=phase, position=p, plant=Plant.objects.get(id=pod_selection[p]), experiment=exp)
        return JsonResponse(model_to_dict(exp), safe=False) # should this be list?

    '''
    @action(detail=False, methods=['POST'], name='set_device')
    def set_device(self, request):
        device_id = request.data['device_id']
        exp_id = request.data['exp_id']
        exp = Experiment.objects.get(id=exp_id)
        exp.device = Device.objects.get(id=device_id)
        exp.save()
        return Response(status=200)
    '''
    
    @action(detail=False, methods=['GET'], name='available_experiments')
    def available_experiments(self, request):
        query = Experiment.objects.filter(device__isnull=True).values('device')
        data = list(query.values('id', 'name'))
        return JsonResponse(data, safe=False)

    # available devices: those with no active experi
    @action(detail=False, methods=['GET'], name='available_devices')
    def available_devices(self, request):
        excluded = Experiment.objects.filter(end_date__isnull=True).filter(device__isnull=False).values('device') # list of all devices referenced by currently active experiments
        query = Device.objects.exclude(id__in=excluded).order_by(Length('name').asc(), 'name') # exclude from device list all devices which an active experiment references
        #data = list(query.values('id', 'name', 'capacity', 'mac_address', 'is_online').order_by('name')) # filter devices by user #.filter(user_id = self.request.user.id)
        data = list(query.values('id', 'name', 'capacity', 'mac_address', 'is_online'))
        return JsonResponse(data, safe=False)

    # need to filter: loaded devices exclude those with a non-null "end_date"
    @action(detail=False, methods=['GET'], name='loaded_devices')
    def loaded_devices(self, request):
        devices = Experiment.objects.filter(end_date__isnull=True)
        devices = devices.filter(device__isnull=False).select_related('device').order_by(Length('name').asc(), 'name')
        data = list(devices.values().annotate(device_name=F('device__name')).annotate(is_online=F('device__is_online')).annotate(mac_address=F('device__mac_address')).annotate(current_recipe=F('recipe__name'))) # 
        return JsonResponse(data, safe=False)

    def get_queryset(self):
        user = self.request.user
        #.filter(user = user.id)
        return Experiment.objects.annotate(device_name=F('device__name')).annotate(recipe_name=F('recipe__name'))  # joins name value from device table to returned results


class PhaseView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PhaseSerializer
    filter_backends = [filters.DjangoFilterBackend,]

    def get_queryset(self):
        return Phase.objects.all().annotate(user_name=F('user__username'))

class PodView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PodSerializer
    filter_backends = [filters.DjangoFilterBackend,]
    filterset_fields = ['experiment', 'end_date']

    def get_queryset(self):
        return Pod.objects.all().annotate(plant_name=F('plant__name')) # return joined plant.name

    @action(detail=False, methods=["post"], name='populate_pod_carousel')
    def populate_pod_carousel(self, request):
        exp_id=json.loads(request.body)["id"]
        qs = Pod.objects.filter(experiment = exp_id).filter(end_date__isnull=True).annotate(plant_name=F('plant__name')) #(experiment = exp_id, end_date__isnull=True)
        pods = list(qs.values())
        capacity = Experiment.objects.get(id=exp_id).device.capacity
        return JsonResponse({"capacity": capacity, "pods": pods}, safe=False)       
        
class RecipeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = RecipeSerializer

    def create(self, request, *args, **kwargs):
        recipe_id = super().create(request, *args, **kwargs).data['id']
        recipe = Recipe.objects.get(id=recipe_id)
        recipe.name = recipe.name.replace(" ", "_")
        recipe.recipe_json = RecipeView.generate_JSON(recipe_id)
        recipe.save()
        return JsonResponse(model_to_dict(recipe), safe=False) 

    def perform_update(self, serializer):
        # Save with the new value for the target model fields
        serializer.save()
        recipe_id = self.get_object().id
        recipe_name = self.get_object().name
        recipe_json = RecipeView.generate_JSON(recipe_id)
        days = RecipeView.calculate_days(recipe_id)
        serializer.save(recipe_json=recipe_json, days=days, name = recipe_name.replace(" ", "_"))

    @action(detail=False, methods=['GET'], name='recipe_user_specific')
    def recipe_user_specific(self, request):
        user = self.request.user
        query = Recipe.objects.filter(author = user.id)
        data = list(query.values())
        return JsonResponse(data, safe=False)

    @staticmethod
    def create_individual_stage(phase):
        stage = {}
        stage["numCycles"] = phase.days
        stage["lightOnTimeMinutes"] = phase.lights_on_hours * 60
        stage["waterOnTimeMinutes"] = phase.waterings_per_day * 180
        stage["pumpOnTimeMinutes"] = phase.watering_duration
        stage["pumpOffTimeMinutes"] = 180 - phase.watering_duration
        stage["pumpFlowRate"] = 0.9
        stage["whiteLed1Brightness"] = round(phase.white_intensity / 100, 2)

        #TODO CHANGE THIS
        stage["whiteLed2Brightness"] = round(phase.white_intensity / 100, 2) 
        stage["redLedBrightness"] = round(phase.red_intensity / 100, 2)
        stage["blueLedBrightness"] = round(phase.blue_intensity / 100, 2)
        return stage

    @action(detail=False, methods=['POST'], name='get_JSON')
    def get_JSON(self, request):
        recipe = Recipe.objects.get(id=request.data['recipe_id'])
        return Response(data=recipe.recipe_json, status=200)

    @staticmethod
    def generate_JSON(recipe_id):
        recipe = Recipe.objects.filter(id=recipe_id) \
                               .select_related('phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9', 'phase10')

        stages = []
        if recipe[0].phase1 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase1))
        if recipe[0].phase2 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase2))
        if recipe[0].phase3 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase3))
        if recipe[0].phase4 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase4))
        if recipe[0].phase5 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase5))
        if recipe[0].phase6 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase6))
        if recipe[0].phase7 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase7))
        if recipe[0].phase8 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase8))
        if recipe[0].phase9 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase9))
        if recipe[0].phase10 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase10))

        recipe_json = {
            "name": recipe[0].name.replace(" ", "_") + ".json",
            "recipeFormatVersion":1,
            "pod1GrowthRate":1.2,
            "pod2GrowthRate":1.2,
            "pod3GrowthRate":1.2,
            "pod4GrowthRate":1.2,
            "pod5GrowthRate":1.2,
            "luxThresholdArray":"",
            "totalLuxZones":"",
            "waterConsumptionRate":1001.5,
            "transitionRandomness":15,
            "stages": stages,
        }

        return recipe_json

    @staticmethod
    @action(detail=False, methods=['POST'], name='calculate_days')
    def calculate_days(recipe_id):
        recipe = Recipe.objects.filter(id=recipe_id) \
                               .select_related('phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9', 'phase10')

        days = 0
        
        if recipe[0].phase1 != None: days += recipe[0].phase1.days
        if recipe[0].phase2 != None: days += recipe[0].phase2.days
        if recipe[0].phase3 != None: days += recipe[0].phase3.days
        if recipe[0].phase4 != None: days += recipe[0].phase4.days
        if recipe[0].phase5 != None: days += recipe[0].phase5.days
        if recipe[0].phase6 != None: days += recipe[0].phase6.days
        if recipe[0].phase7 != None: days += recipe[0].phase7.days
        if recipe[0].phase8 != None: days += recipe[0].phase8.days
        if recipe[0].phase9 != None: days += recipe[0].phase9.days
        if recipe[0].phase10 != None: days += recipe[0].phase10.days

        return days


    def get_queryset(self):
        return Recipe.objects.all()

class PlantView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PlantSerializer
    filter_backends = (OrderingFilter,)
    ordering_fields = ['name']

    def get_queryset(self):
        return Plant.objects.all().order_by('name')

class CreateUserAPIView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            # We create a token than will be used for future auth
            token = Token.objects.create(user=serializer.instance)
            token_data = {"token": token.key}

            return Response(
                {**serializer.data, **token_data},
                status=status.HTTP_201_CREATED,
                headers=headers
            )

        except IntegrityError as e:
            return Response(
                status=409
            )

class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all() # django specific user type

    def get(self, request, format=None):
        # simply delete the token to force a login
        # request.user.auth_token.delete()
        return Response({'msg': "success logout"}, status=status.HTTP_200_OK)

# get authorization
class VerifyUserView(APIView):
    model = get_user_model()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,) 

    def post(self, request, *args, **kwargs):
        if request.user:
            return Response(UserSerializer(request.user).data)


class MQTTView(APIView):
    permission_classes = (IsAuthenticated,) 

    def post(self, request, *args, **kwargs):
        env = request.data['env']
        device = request.data['device']
        command = request.data['command']
        broker = GenericMQTT(env)

        if command == 0:
            data = broker.get_device_status(device)
            data = {key: data[key] for key in data if key not in ['luxZone', 'mqttConfig', 'totalLuxZones', 'wifiCredentials']}
            return JsonResponse(data, safe=False)
        elif command == 1: 
            #WORKS BUT FORMATTING ISSUES
            data = broker.get_device_logs(device)
            return Response(data, content_type='text/plain; charset=utf8')
        elif command == 7:
            timezone = request.data['parameters']['timezone']
            data = broker.change_timezone(device, timezone)
            return JsonResponse(data, safe=False)
        elif command == 11:
            hour = int(request.data['parameters']['hour'])
            minute = int(request.data['parameters']['minute'])
            data = broker.set_start_time(device, hour, minute)
            return JsonResponse(data, safe=False)
        elif command == 12:
            data = {
                "macAddress": broker.trigger_OTA(device),
                "msg": "OTA Trigger sent, check Mender to see if device is downloading firmware"}
            return JsonResponse(data, safe=False)
        elif command == 14:
            #Cannot change stage + cycle if byte hasn't started recipe yet?
            stage = int(request.data['parameters']['stage'])
            cycle = int(request.data['parameters']['cycle'])
            data = broker.change_stage_cycle(device, stage, cycle)
            return JsonResponse(data, safe=False)
        elif command == 15:
            ##GET RECIPE LIST
            data = broker.get_recipe_list(device)
            return JsonResponse(data, safe=False)
        elif command == 16:
            #RECIPE NAME MUST BE EXACT AND INCLUDE .json at the end!
            recipe_name = request.data["parameters"]["recipe_name"]
            data = broker.trigger_recipe_by_name(device, recipe_name)
            return JsonResponse(data, safe=False)
        else: 
            data = {"error": "wrong command id"}
            return JsonResponse(data, safe=False)
        
        
