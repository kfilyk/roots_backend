from django.contrib import admin
from .models import Device, Experiment

class DeviceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'token', 'registration_date', 'last_update', 'is_online', 'mac_address', 'experiment')

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'recipe', 'device', 'score', 'start_date', 'end_date', 'pod1', 'pod2', 'pod3', 'pod4', 'pod5', 'pod6', 'pod7', 'pod8', 'pod9', 'pod10')

# Register your models here.

admin.site.register(Device, DeviceAdmin)
admin.site.register(Experiment, ExperimentAdmin)
