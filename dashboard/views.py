from dashboard.models import Device, Experiment
from rest_framework import viewsets
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer
from .models import Device
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

class DeviceView(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    #queryset = Device.objects.filter(user=1)
    queryset = Device.objects.all()

class ExperimentView(viewsets.ModelViewSet):
    serializer_class = ExperimentSerializer
    #queryset = Experiment.objects.filter(user=1)
    queryset = Device.objects.all()

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
    queryset = get_user_model().objects.all()

    def get(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

'''
def dashboard(request):
    return HttpResponse("Hello, world.")

def dashboard2(request, *args, **kwargs):
    devices=Device.objects.all()
    return HttpResponse(devices)
    return render(request, "dashboard/index.html", {'devices':devices})
'''