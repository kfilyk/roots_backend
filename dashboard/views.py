from dashboard.models import Device, Experiment
from rest_framework import viewsets
from .serializers import DeviceSerializer, ExperimentSerializer
from .models import Device

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

class DeviceView(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    queryset = Device.objects.all() # json formatted queryset # select * from devices;


class ExperimentView(viewsets.ModelViewSet):
    serializer_class = ExperimentSerializer
    #queryset = Experiment.objects.filter(user=1)
    queryset = Device.objects.all()


'''
def dashboard(request):
    return HttpResponse("Hello, world.")

def dashboard2(request, *args, **kwargs):
    devices=Device.objects.all()
    return HttpResponse(devices)
    return render(request, "dashboard/index.html", {'devices':devices})
'''