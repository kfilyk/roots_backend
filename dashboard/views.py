from dashboard.models import Device, Experiment, Stage, Plant, Pod
from rest_framework import viewsets
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer, UserSerializer, StageSerializer, PlantSerializer, PodSerializer
#from .models import Device
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated 

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

    def get_queryset(self):
        user = self.request.user
        return Experiment.objects.filter(user = user.id)

class StageView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = StageSerializer

    def get_queryset(self):
        user = self.request.user
        return Stage.objects.all()

class PodView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PodSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['experiment']

    def get_queryset(self):
        user = self.request.user
        return Pod.objects.all()

class PlantView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PlantSerializer

    def get_queryset(self):
        user = self.request.user
        return Plant.objects.all()

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
