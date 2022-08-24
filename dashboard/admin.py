from django.contrib import admin
from .models import Device, Experiment, Pod

class DeviceAdmin(admin.ModelAdmin):
    list_display = ('id', 'model', 'name', 'user', 'registration_date', 'last_update', 'is_online', 'mac_address', 'fill_res_flag', 'capacity') # columns of the database table we are turning into a json object

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phase', 'day', 'phase_day', 'phase_number', 'device', 'score', 'user', 'start_date', 'end_date')

class PodAdmin(admin.ModelAdmin):
    list_display = ('id', 'experiment', 'plant_id', 'position', 'phase', 'score', 'start_date', 'end_date')
# Register your models here.

admin.site.register(Device, DeviceAdmin)
admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Pod, PodAdmin)
