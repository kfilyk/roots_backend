from dashboard.models import Device, Experiment, Phase, Plant, Pod
from rest_framework import viewsets
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer, UserSerializer, PhaseSerializer, PlantSerializer, PodSerializer
#from .models import Device
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

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

class DeviceView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = DeviceSerializer

    def get_queryset(self):
        user = self.request.user
        return Device.objects.filter(user = user.id)

class ExperimentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        exp_id = super().create(request, *args, **kwargs).data['id']
        exp = Experiment.objects.get(id=exp_id)
        plants = request.data['plants']
        num_pods = request.data['num_pods']
        start_date = make_aware(datetime.strptime(request.data['start_date'], '%Y-%m-%d'))
        print(start_date)
        phase = 0
        pods = []
        for i in range(num_pods):
            position = i+1
            if plants[i] == -1:
                pods.append(Pod(start_date=start_date, phase=phase, position=position, plant=None, experiment=exp))
            else: 
                pods.append(Pod(start_date=start_date, phase=phase, position=position, plant=Plant.objects.get(id=plants[i]), experiment=exp))
        Pod.objects.bulk_create(pods)
        return Response("HELLO WORLD")

    @action(detail=False, methods=['GET'], name='available_devices')
    def available_devices(self, request):
        devices_in_use = Experiment.objects.filter(device_id__isnull=False).values('device_id')
        query = Device.objects.exclude(id__in=devices_in_use)
        data = list(query.values('id', 'name', 'num_pods'))
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
    filterset_fields = ['experiment']

    def get_queryset(self):
        return Pod.objects.all().annotate(plant_name=F('plant__name')) # return joined plant.name

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
