from django.http import HttpResponse
from django.shortcuts import render, redirect
from dashboard.models import Device

def dashboard(request):
    return HttpResponse("Hello, world.")

def dashboard2(request, *args, **kwargs):
    devices=Device.objects.all()
    return HttpResponse(devices)
    return render(request, "dashboard/index.html", {'devices':devices})
