from django.contrib import admin
from .models import Device

class DeviceAdmin(admin.ModelAdmin):
    list_display = ('device', 'name', 'user', 'token', 'creation_date', 'last_update', 'is_online', 'mac_address', 'experiment')

# Register your models here.

admin.site.register(Device, DeviceAdmin)
# Register your models here.
