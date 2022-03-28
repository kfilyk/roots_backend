from django.apps import AppConfig

'''
class UserConfig(AppConfig):
    name = 'core.user' # during duration of client access
'''
class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dashboard'
