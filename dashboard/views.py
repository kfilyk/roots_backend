from dashboard.models import Device, Experiment, Phase, Plant, Pod, ExperimentReading, PodReading, Recipe
from rest_framework import viewsets
from django.forms.models import model_to_dict
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer, UserSerializer, PhaseSerializer, PlantSerializer, PodSerializer, ExperimentReadingSerializer, RecipeSerializer
from django.core import serializers
from django_filters import rest_framework as filters
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

    @action(detail=False, methods=['GET'], name='tester_call')
    def tester_call(self, request):

        return Response(status=200)

    def get_queryset(self):
        user = self.request.user
        return Device.objects.filter(user = user.id)

    @action(detail=False, methods=['POST'], name='get_device_state')
    def get_device_state(self, request):
        token = Device.objects.get(id=request.data['device']).token
        broker = MQTT()
        data = json.loads(broker.get_device_status(token))
        filtered_data = {key: data[key] for key in data if key not in ['luxZone', 'mqttConfig', 'totalLuxZones', 'wifiCredentials']}        
        return JsonResponse(filtered_data, safe=False)

    '''
    @action(detail=False, methods=['POST'], name='set_device_start_time')
    def set_device_start_time(self, request):
        token = Device.objects.get(id=request.data['device']).token
        hour = request.data['hour']
        minute = request.data['minute']
        broker = MQTT()
        device_start_time = broker.set_start_time(token, hour, minute)
        return JsonResponse({"device_start_time": device_start_time}, status=200)
    '''

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
            print("ERROR IN EXPERIMENTREADINGVIEW:create ", e)
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
        

class ExperimentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        exp_id = super().create(request, *args, **kwargs).data['id']
        print("FLAG 1: ", request.data)
        exp = Experiment.objects.get(id=exp_id)
        pod_selection = request.data['pod_selection']
        start_date = make_aware(datetime.strptime(request.data['start_date'], '%Y-%m-%d-%H-%M'))
        print(start_date)
        phase = 0

        #new_pods = []
        for p in pod_selection:
            print(p)
            #new_pods.append(Pod(start_date=start_date, phase=phase, position=p, plant=Plant.objects.get(id=pods[p]), experiment=exp))
            Pod.objects.create(start_date=start_date, phase=phase, position=p, plant=Plant.objects.get(id=pod_selection[p]), experiment=exp)
        return JsonResponse(model_to_dict(exp), safe=False) # should this be list?

    @action(detail=False, methods=['POST'], name='set_device')
    def set_device(self, request):
        device_id = request.data['device_id']
        exp_id = request.data['exp_id']
        exp = Experiment.objects.get(id=exp_id)
        exp.device_id = Device.objects.get(id=device_id)
        exp.save()
        return Response(status=200)
    
    @action(detail=False, methods=['GET'], name='available_experiments')
    def available_experiments(self, request):
        query = Experiment.objects.filter(device_id__isnull=True).values('device_id')
        data = list(query.values('id', 'name'))
        return JsonResponse(data, safe=False)

    @action(detail=False, methods=['GET'], name='available_devices')
    def available_devices(self, request):
        devices = Experiment.objects.filter(device_id__isnull=False).values('device_id')
        query = Device.objects.exclude(id__in=devices)
        data = list(query.values('id', 'name', 'capacity').filter(user_id = self.request.user.id))
        return JsonResponse(data, safe=False)

    @action(detail=False, methods=['GET'], name='loaded_devices')
    def loaded_devices(self, request):
        devices = Experiment.objects.filter(device_id__isnull=False).select_related('device')
        data = list(devices.values().annotate(device_name=F('device__name')).filter(user_id = self.request.user.id))
        return JsonResponse(data, safe=False)

    def get_queryset(self):
        user = self.request.user
        return Experiment.objects.filter(user = user.id).annotate(device_name=F('device__name'))  # joins name value from device table to returned results


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
        qs = Pod.objects.filter(experiment = exp_id, end_date__isnull=True).annotate(plant_name=F('plant__name'))
        pods = list(qs.values())
        capacity = Experiment.objects.get(id=exp_id).device.capacity
        return JsonResponse({"capacity": capacity, "pods": pods}, safe=False)       
        
class RecipeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = RecipeSerializer

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
