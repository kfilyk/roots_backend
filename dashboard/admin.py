from django.contrib import admin
from .models import Device, Experiment, Pod

class DeviceAdmin(admin.ModelAdmin):
    list_display = ('id', 'model', 'name', 'user', 'token', 'registration_date', 'last_update', 'is_online', 'mac_address', 'experiment', 'fill_res_flag') # columns of the database table we are turning into a json object

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'current_phase', 'phases', 'day', 'phase_day', 'device', 'score', 'user', 'start_date', 'end_date')

class PodAdmin(admin.ModelAdmin):
    list_display = ('id', 'experiment', 'plant_id', 'position', 'state', 'score', 'start_date', 'end_date')
# Register your models here.

admin.site.register(Device, DeviceAdmin)
admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Pod, PodAdmin)
