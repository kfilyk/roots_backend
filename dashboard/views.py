from dashboard.models import Device, Experiment, Phase, Plant, Pod, ExperimentReading
from rest_framework import viewsets
from django.forms.models import model_to_dict
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer, UserSerializer, PhaseSerializer, PlantSerializer, PodSerializer, ExperimentReadingSerializer
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
import json

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

class DeviceView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = DeviceSerializer

    def get_queryset(self):
        user = self.request.user
        return Device.objects.filter(user = user.id)

class ExperimentReadingView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentReadingSerializer
    filter_backends = [filters.DjangoFilterBackend,]
    filterset_fields = ['experiment']

    def get_queryset(self):
        user = self.request.user
        return ExperimentReading.objects.all()
    
    @action(detail=False, methods=['POST'], name='get_last_reading')
    def get_last_reading(self, request):
        exp_id = request.data['exp_id']
        qs = Pod.objects.filter(experiment = exp_id, end_date__isnull=True).annotate(plant_name=F('plant__name'))
        pods = list(qs.values())
        device_capacity = Device.objects.get(id=exp_id).device_capacity
        try:
            latest = ExperimentReading.objects.filter(experiment=exp_id).latest('reading_date')
            return JsonResponse({"latest_reading": model_to_dict(latest), "pods": pods, "device_capacity": device_capacity}, safe=False)
        except ExperimentReading.DoesNotExist:
            latest = {"exp_id": -1}
            return JsonResponse({"latest_reading": latest, "pods": pods, "device_capacity": device_capacity}, safe=False)
        

class ExperimentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        exp_id = super().create(request, *args, **kwargs).data['id']
        exp = Experiment.objects.get(id=exp_id)
        plants = request.data['plants']
        device_capacity = Device.objects.get(id=request.data['device']).device_capacity
        start_date = make_aware(datetime.strptime(request.data['start_date'], '%Y-%m-%d'))
        print(start_date)
        phase = 0

        pods = []
        for i in range(device_capacity):
            position = i+1
            if plants[i] != -1:
                pods.append(Pod(start_date=start_date, phase=phase, position=position, plant=Plant.objects.get(id=plants[i]), experiment=exp))
        Pod.objects.bulk_create(pods)
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
        devices_in_use = Experiment.objects.filter(device_id__isnull=False).values('device_id')
        query = Device.objects.exclude(id__in=devices_in_use)
        print("QUERY: ", query)
        query = query.filter(user = self.request.user.id)
        print("QUERY 2: ", query)

        data = list(query.values('id', 'name', 'device_capacity'))
        return JsonResponse(data, safe=False)

    @action(detail=False, methods=['GET'], name='loaded_devices')
    def loaded_devices(self, request):
        devices_in_use = Experiment.objects.filter(device_id__isnull=False).select_related('device')
        data = list(devices_in_use.values().annotate(device_name=F('device__name')) )
        return JsonResponse(data, safe=False)

    def get_queryset(self):
        user = self.request.user
        return Experiment.objects.filter(user = user.id).annotate(device_name=F('device__name')) # joins name value from device table to returned results


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
        device_capacity = Experiment.objects.get(id=exp_id).device.device_capacity
        print("PODS: ", pods)
        print("DEVICE: ", device_capacity)
        return JsonResponse({"device_capacity": device_capacity, "pods": pods}, safe=False)            
    '''
    @action(detail=False, methods=["post"], name='populate_pod_carousel')
    def populate_pod_carousel(self, request):
        exp_id=json.loads(request.body)["id"]
        qs = Pod.objects.filter(experiment = exp_id, end_date__isnull=True).annotate(plant_name=F('plant__name'))
        pods = list(qs.values())
        # device_capacity = Experiment.objects.get(exp_id).values('device__')
        device_capacity = 5
        return JsonResponse({pods: pods, device_capacity: device_capacity}, safe=False)
    '''
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
