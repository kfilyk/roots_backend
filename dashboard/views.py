from urllib3 import HTTPResponse
from dashboard.models import Device, Experiment, Phase, Plant, Pod, ExperimentReading, PodReading, Recipe
from rest_framework import viewsets
from django.forms.models import model_to_dict
from .serializers import DeviceSerializer, ExperimentSerializer, CreateUserSerializer, UserSerializer, PhaseSerializer, PlantSerializer, PodSerializer, ExperimentReadingSerializer, RecipeSerializer, PodReadingSerializer
from django.core import serializers
from django_filters import rest_framework as filters
from django.db.models.functions import Length

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
from django.db.models import F, Q
from rest_framework.decorators import action
from django.http import HttpResponse, JsonResponse
from datetime import datetime
from django.utils.timezone import make_aware
from .v2_mqtt import MQTT
from .generic_mqtt_client import GenericMQTT
import json
from django.utils import timezone
from datetime import datetime, timedelta, date
from django.db import IntegrityError

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react

class DeviceView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = DeviceSerializer

    """
    Input from: Not currently in use. 
    Outputs to: 
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Creates a Device object and save to database. 
    """
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    """
    Input from: Device.js/sendCommand()
    Outputs to: Device.js/sendCommand()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Takes all parameters from frontend and sends commands to devices
    based on parameters given. Will always return a response, see v2_mqtt.py 
    """
    @action(detail=False, methods=['POST'], name='send_command')
    def send_command(self, request):
        command = int(request.data['parameters']['id'])
        device = request.data['parameters']['device']
        broker = MQTT()
        if command == 0:
            data = json.loads(broker.get_device_status(device))
            data = {key: data[key] for key in data if key not in ['luxZone', 'mqttConfig', 'totalLuxZones', 'wifiCredentials']}
        elif command == 1:
            data = {}
            # REQUIRES CHANGES TO V2_MQTT.py
        elif command == 7:
            timezone = request.data['parameters']['timezone']
            data = broker.change_timezone(device, timezone)
        elif command == 11:
            hour = int(request.data['parameters']['hour'])
            minute = int(request.data['parameters']['minute'])
            print(hour, minute)
            data = {"dailyStartTime": broker.set_start_time(device, hour, minute)}
        elif command == 12:
            data = {
                "macAddress": broker.trigger_OTA(device),
                "msg": "OTA Trigger sent, check Mender to see if device is downloading firmware"}
        elif command == 14:
            stage = int(request.data['parameters']['stage'])
            cycle = int(request.data['parameters']['cycle'])
            data = broker.change_stage_cycle(device, stage, cycle)
        else: 
            data = {"error": "wrong command id"}
        return JsonResponse(data, safe=False)


    """
    Input from: Device.js/changeRecipe()
    Outputs to: Device.js/changeRecipe()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Given device id and recipe id, takes recipe id and generates JSON then sends JSON to device.
    """
    # this generates a recipe during "AddExperiment"
    @action(detail=False, methods=['POST'], name='update_device')
    def update_device(self, request):
        print("CHANGE RECIPE TARGET DEVICE: ", request.data['device_id'])
        print("RECIPE: ", request.data['new_recipe_id'])

        id = Device.objects.get(id=request.data['device_id']).id
        recipe = Recipe.objects.get(id=request.data['new_recipe_id'])

        broker = MQTT()
        data = broker.trigger_recipe(id, recipe.recipe_json, recipe.name.replace(" ", "_") + ".json")
        print("DATA: ", data)
        return JsonResponse(data, safe=False)

    """
    Input from: Device.js/checkDevicesOnline()
    Outputs to: Device.js/checkDevicesOnline()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Returns list of device ids of devices online according to the database
    """
    @action(detail=False, methods=['POST'], name='check_devices_online')
    def check_devices_online(self, request):
        #query = Device.objects.filter(id__in=request.data['devices'])
        #data = list(Device.objects.all().values('id', is_online=F('is_online')))
        data = list(Device.objects.all().values('id', 'is_online'))
        return JsonResponse(data, safe=False)

    """
    Input from: Not in use
    Outputs to: Not in use
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Returns list of devices belonging to the user who sent the request
    """
    def get_queryset(self):
        user = self.request.user
        return Device.objects.all() #filter(user = user.id)

class ExperimentReadingView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentReadingSerializer
    filter_backends = [filters.DjangoFilterBackend,]
    filterset_fields = ['experiment']

    """
    Input from: Not in use.
    Outputs to: Not in use.
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Returns all experiment readings
    """
    def get_queryset(self):
        user = self.request.user
        return ExperimentReading.objects.all()
    
    """
    Input from: ExperimentReading.js/fetchData()
    Outputs to: ExperimentReading.js/fetchData()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Gets last reading of experiment if one exists then will update the frontend code accordingly
    """
    @action(detail=False, methods=['POST'], name='get_last_reading')
    def get_last_reading(self, request):
        exp_id = request.data['exp_id']
        qs = Pod.objects.filter(experiment = exp_id, end_date__isnull=True).annotate(plant_name=F('plant__name'))
        pods = list(qs.values())
        capacity = Device.objects.get(id=Experiment.objects.get(id=exp_id).device.id).capacity
        try:
            latest = ExperimentReading.objects.filter(experiment=exp_id).latest('reading_date')
            return JsonResponse({"latest_reading": model_to_dict(latest), "pods": pods, "capacity": capacity}, safe=False)
        except ExperimentReading.DoesNotExist:
            latest = {"exp_id": -1}
            return JsonResponse({"latest_reading": latest, "pods": pods, "capacity": capacity}, safe=False)


    """
    Input from: RecipeBar.js/getReadings()
    Outputs to: RecipeBar.js/getReadings()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Gets all experiment readings for an experiment
    """
    @action(detail=False, methods=['POST'], name='get_experiment_readings')
    def get_experiment_readings(self, request):
        qs = ExperimentReading.objects.filter(experiment=request.data['exp_id']).order_by('reading_date')
        return JsonResponse(list(qs.values()), safe=False)
        

class ExperimentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = ExperimentSerializer

    """
    Input from: ExperimentView.py/create()
    Outputs to: ExperimentView.py/create()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: perform_create is called within the create method to call the serializer for creation once it's known the serialization is valid
    """
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    """
    Input from: Experiment.js/addExperiment()
    Outputs to: Experiment.js/addExperiment()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Creates an experiment object in the database, including the user who created it
    """
    def create(self, request, *args, **kwargs):
        exp_id = super().create(request, *args, **kwargs).data['id']
        exp = Experiment.objects.get(id=exp_id)
        pod_selection = request.data['pod_selection']
        phase = 0

        #new_pods = []
        for p in pod_selection:
            #new_pods.append(Pod(start_date=start_date, phase=phase, position=p, plant=Plant.objects.get(id=pods[p]), experiment=exp))
            Pod.objects.create(start_date=request.data['start_date'], end_date=request.data['end_date'], phase=phase, position=p, plant=Plant.objects.get(id=pod_selection[p]), experiment=exp)
        return JsonResponse(model_to_dict(exp), safe=False) # should this be list?

    """
    Input from: Device.js/fetchAvailableDevices(); Experiment.js/fetchAvailableDevices();
    Outputs to: Device.js/fetchAvailableDevices(); Experiment.js/fetchAvailableDevices();
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Retrieve a list of devices with no experiments running on them
    """    
    @action(detail=False, methods=['GET'], name='free_devices')
    def free_devices(self, request):
        excluded = Experiment.objects.filter(status=0).filter(device__isnull=False).values('device') # list of all devices referenced by currently active experiments
        query = Device.objects.exclude(id__in=excluded).order_by(Length('name').asc(), 'name') # exclude from device list all devices which an active experiment references
        data = list(query.values('id', 'name', 'capacity', 'mac_address', 'is_online'))
        return JsonResponse(data, safe=False)

    """
    Input from: Device.js/fetchActiveDevices(); 
    Outputs to: Device.js/fetchActiveDevices(); 
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Retrieve a list of devices with an active experiment running on them
    TO-DO: need to filter: loaded devices exclude those with a non-null "end_date"
    """  
    @action(detail=False, methods=['GET'], name='active')
    def active(self, request):
        devices = Experiment.objects.filter(status=0)
        devices = devices.filter(device__isnull=False).select_related('device').order_by(Length('name').asc(), 'name')
        data = list(devices.values().annotate(device_name=F('device__name')).annotate(is_online=F('device__is_online')).annotate(mac_address=F('device__mac_address')).annotate(current_recipe=F('recipe__name'))) # 
        return JsonResponse(data, safe=False)

    """
    Input from: Experiment.js/fetchActiveDevices(); 
    Outputs to: Experiment.js/fetchActiveDevices(); 
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Retrieve a list of devices with an active experiment running on them
    TO-DO: need to filter: loaded devices exclude those with a non-null "end_date"
    """  
    @action(detail=False, methods=['GET'], name='completed')
    def completed(self, request):
        devices = Experiment.objects.filter(~Q(status=0))
        devices = devices.filter(device__isnull=False).select_related('device').order_by(Length('name').asc(), 'name')
        data = list(devices.values().annotate(device_name=F('device__name')).annotate(is_online=F('device__is_online')).annotate(mac_address=F('device__mac_address')).annotate(current_recipe=F('recipe__name'))) # 
        return JsonResponse(data, safe=False)


    """
    Input from: Experiment.js/terminateExperiment(); 
    Outputs to: Experiment.js/terminateExperiment(); 
    Created by: Kelvin F 09/10/2022
    Last Edit: Kelvin F 09/10/2022
    Purpose: Terminate an experiment/pods prematurely
    """  
    @action(detail=False, methods=['POST'], name='terminate')
    def terminate(self, request):
        exp_id=json.loads(request.body)["id"]
        exp = Experiment.objects.get(id = exp_id)
        exp.status = 1
        exp.save()
        pods = Pod.objects.filter(experiment=exp_id, status = 0)
        pods.update(status = 1)

        return JsonResponse({"status": "200"}, safe=False)

    """
    Input from: Experiment.js/deleteExperiment(); 
    Outputs to: Experiment.js/deleteExperiment(); 
    Created by: Kelvin F 09/10/2022
    Last Edit: Kelvin F 09/10/2022
    Purpose: Delete an experiment and all associated pods/readings
    """  
    @action(detail=False, methods=['POST'], name='delete')
    def delete(self, request):
        exp_id=json.loads(request.body)["id"]
        PodReading.objects.filter(experiment = exp_id).delete()
        ExperimentReading.objects.filter(experiment = exp_id).delete()
        Pod.objects.filter(experiment=exp_id).delete()
        Experiment.objects.filter(id = exp_id).delete()
        return JsonResponse({"status": "200"}, safe=False)

    """
    Input from: Experiment.js/fetchExperiments(); 
    Outputs to: Experiment.js/fetchExperiments(); 
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Retrieves all experiments including the device's name running the exp and the recipe they're on.
    """  
    def get_queryset(self):
        user = self.request.user
        return Experiment.objects.annotate(device_name=F('device__name')).annotate(recipe_name=F('recipe__name'))  # joins name value from device table to returned results


class PhaseView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PhaseSerializer
    filter_backends = [filters.DjangoFilterBackend,]

    """
    Input from: Device.js/fetchPhases(); Phase.js/fetchPhases(); Recipe.js/fetchPhases(); 
    Outputs to: Device.js/fetchPhases(); Phase.js/fetchPhases(); Recipe.js/fetchPhases(); 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Retrieves all phases including the user who created them
    """  
    def get_queryset(self):
        return Phase.objects.all()

class PodView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PodSerializer
    filter_backends = [filters.DjangoFilterBackend,]
    filterset_fields = ['experiment', 'end_date']

    """
    Input from: Experiment.js/editExperiment(); 
    Outputs to: Experiment.js/editExperiment(); 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Retrieves all pods including their plant name
    """  
    def get_queryset(self):
        return Pod.objects.all().annotate(plant_name=F('plant__name')) # return joined plant.name

    """
    Input from: PodCarousel.js/getPods(); 
    Outputs to: PodCarousel.js/getPods(); 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Given an experiment id, retrieves its device's capacity and info about its pods including plant name
    """  
    @action(detail=False, methods=["post"], name='get_pods')
    def get_pods(self, request):
        exp_id=json.loads(request.body)["id"]
        exp_status = json.loads(request.body)["status"]
        qs = Pod.objects.filter(experiment = exp_id, status=exp_status).annotate(plant_name=F('plant__name')) #(experiment = exp_id, end_date__isnull=True)
        pods = list(qs.values())
        capacity = Experiment.objects.get(id=exp_id).device.capacity
        return JsonResponse({"capacity": capacity, "pods": pods}, safe=False)       
        

    """
    Input from: Analysis.js/fetchAllPodsData; 
    Outputs to: Analysis.js frontend; 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Given an experiment id, retrieves its device's capacity and info about its pods including plant name
    """  
    @action(detail=False, methods=["post"], name='get_all_pod_data')
    def get_all_pod_data(self, request):
        exp_id=json.loads(request.body)["id"]
        #pods = list(Pod.objects.filter(experiment = exp_id).annotate(plant_object=model_to_dict(Plant.objects.get(id = F('plant')))).values()) #(experiment = exp_id, end_date__isnull=True)
        pods = list(Pod.objects.filter(experiment = exp_id).values()) #(experiment = exp_id, end_date__isnull=True) # this is a queryset [<podObject1> , <podObject2>, ... ]
        # list of dicts: [{...},{...}, ...]
        #print("\n\n\nPODS: ", pods) 
        for pod in pods:
            pl = model_to_dict(Plant.objects.get(id = pod['plant_id']))
            print("\n\n\nPLANT: ", pl)
            pod['plant_object'] = pl

        print("\n\n\nPODS: ", pods) 

        return JsonResponse({"pods": pods}, safe=False)       
        

class PodReadingView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PodReadingSerializer
    
    def get_queryset(self):
        return PodReading.objects.all().annotate(reading_date=F('experiment_reading__reading_date'))

    """
    Input from: RecipeBar.js/getPodReadings(); 
    Outputs to: RecipeBar.js/getPodReadings(); 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Given a pod_id and an experiment_reading_id, get a reading
    """
    @action(detail=False, methods=["post"], name='get_pod_reading')
    def get_pod_reading(self, request):
        er_id=json.loads(request.body)["er_id"]
        p_id=json.loads(request.body)["p_id"]
        pr = PodReading.objects.filter(experiment_reading = er_id, pod=p_id)
        if pr:
            return JsonResponse(list(pr.values())[0], safe=False)    
        return JsonResponse({}, safe=False)

class RecipeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = RecipeSerializer

    """
    Input from: Recipe.js/addRecipe(); 
    Outputs to: Recipe.js/addRecipe(); 
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Creates a recipe object in the database including the recipe json data based on the phases passed in.
    """  
    def create(self, request, *args, **kwargs):
        recipe = request.data
        recipe['author'] = self.request.user

        del recipe['show']
        del recipe['add']
        del recipe['id']
        for i in range(1, 11):
            ph = recipe["phase"+str(i)]
            del ph['id'] # shouldn't have a preexisting id before being entered
            if ph['type'] != "":
                recipe["phase"+str(i)] = Phase.objects.create(**ph)
            else:
                recipe["phase"+str(i)] = None
        
        r = Recipe.objects.create(**recipe)
        r.recipe_json = RecipeView.generate_JSON(r.id)
        r.save()

        #recipe_id = super().create(request, *args, **kwargs).data['id']
        #recipe = Recipe.objects.get(id=recipe_id)
        #recipe.name = recipe.name.replace(" ", "_")
        #recipe.recipe_json = ""
        return JsonResponse(model_to_dict(r), safe=False) 


    """
    Input from: Recipe.js/editRecipe(); 
    Outputs to: Recipe.js/editRecipe(); 
    Created by: Kelvin F 09/16/2022
    Last Edit: Kelvin F 09/16/2022
    Purpose: Edits a recipe object, including pushing changes to phases
    """  
    @action(detail=False, methods=['POST'], name='edit')
    def edit(self, request):
        new = request.data
        del new['show']
        del new['add']

        recipe = Recipe.objects.get(id=new['id'])
        recipe.name = new['name']
        recipe.days = new['days']

        for i in range(1, 11):
            ph = new["phase"+str(i)]
            if ph['id'] == -1:
                del ph['id'] # if new phase, create new id. otherwise, use old id

            #new phase specified
            if ph['type'] != "":
                if(getattr(recipe, "phase"+str(i)) == None):
                    setattr(recipe, "phase"+str(i), Phase.objects.create(**ph))
                else :
                    Phase.objects.filter(id=ph['id']).update(**ph)
            else:
                phase_del = getattr(recipe, "phase"+str(i))
                setattr(recipe, "phase"+str(i), None)
                recipe.save()
                try:
                    phase_del.delete()
                except:
                    print("phase deleted.")

        recipe.recipe_json = RecipeView.generate_JSON(recipe.id)
        recipe.save()
        Experiment.objects.filter(recipe = recipe.id).update(end_date = F('start_date')+timedelta(days = recipe.days))
        return JsonResponse({"status": "200"}, safe=False)

    """
    Input from: Recipe.js/deleteRecipe(); 
    Outputs to: Recipe.js/deleteRecipe(); 
    Created by: Kelvin F 09/16/2022
    Last Edit: Kelvin F 09/16/2022
    Purpose: Deletes a recipe object in the database including all related phases.
    """  
    @action(detail=False, methods=['POST'], name='delete')
    def delete(self, request):
        rec_id = json.loads(request.body)['id']
        recipe = Recipe.objects.get(id = rec_id)
        recipe.delete()
        print(model_to_dict(recipe))
        try:
            recipe.phase1.delete()
            recipe.phase2.delete()
            recipe.phase3.delete()
            recipe.phase4.delete()
            recipe.phase5.delete()
            recipe.phase6.delete()
            recipe.phase7.delete()
            recipe.phase8.delete()
            recipe.phase9.delete()
            recipe.phase10.delete()
        except:
            print("Phases deleted.")
        
        return JsonResponse({"status": "200"}, safe=False)

    """
    Input from: Not in use.
    Outputs to: Not in use.
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Retrieves only the recipes of the user who sent the request.
    """  
    @action(detail=False, methods=['GET'], name='recipe_user_specific')
    def recipe_user_specific(self, request):
        user = self.request.user
        query = Recipe.objects.filter(author = user.id)
        data = list(query.values())
        return JsonResponse(data, safe=False)

    """
    Input from: RecipeView.generateJSON()
    Outputs to: RecipeView.generateJSON()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Converts the phase variables into python dictionary
    """  
    @staticmethod
    def create_individual_stage(phase):
        stage = {}
        stage["numCycles"] = phase.days
        stage["lightOnTimeMinutes"] = phase.lights_on_hours * 60
        stage["waterOnTimeMinutes"] = phase.waterings_per_day * 180
        stage["pumpOnTimeMinutes"] = phase.watering_duration
        stage["pumpOffTimeMinutes"] = 180 - phase.watering_duration
        stage["pumpFlowRate"] = 0.9
        stage["whiteLed1Brightness"] = round(phase.white_intensity / 100, 2)

        #TODO CHANGE THIS
        stage["whiteLed2Brightness"] = round(phase.white_intensity / 100, 2) 
        stage["redLedBrightness"] = round(phase.red_intensity / 100, 2)
        stage["blueLedBrightness"] = round(phase.blue_intensity / 100, 2)
        return stage

    """
    Input from: Recipe.getRecipeJSON()
    Outputs to: Recipe.getRecipeJSON()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Given a recipe id, returns the JSON format of recipe.
    """  
    @action(detail=False, methods=['POST'], name='get_JSON')
    def get_JSON(self, request):
        recipe = Recipe.objects.get(id=request.data['recipe_id'])
        return Response(data=recipe.recipe_json, status=200)


    @staticmethod
    def generate_JSON(recipe_id):
        recipe = Recipe.objects.filter(id=recipe_id) \
                               .select_related('phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9', 'phase10')

        stages = []
        if recipe[0].phase1 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase1))
        if recipe[0].phase2 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase2))
        if recipe[0].phase3 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase3))
        if recipe[0].phase4 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase4))
        if recipe[0].phase5 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase5))
        if recipe[0].phase6 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase6))
        if recipe[0].phase7 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase7))
        if recipe[0].phase8 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase8))
        if recipe[0].phase9 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase9))
        if recipe[0].phase10 != None: stages.append(RecipeView.create_individual_stage(recipe[0].phase10))

        recipe_json = {
            "name": recipe[0].name.replace(" ", "_") + ".json",
            "recipeFormatVersion":1,
            "pod1GrowthRate":1.2,
            "pod2GrowthRate":1.2,
            "pod3GrowthRate":1.2,
            "pod4GrowthRate":1.2,
            "pod5GrowthRate":1.2,
            "luxThresholdArray":"",
            "totalLuxZones":"",
            "waterConsumptionRate":1001.5,
            "transitionRandomness":15,
            "stages": stages,
        }

        return recipe_json

    """
    Input from: Device.js/fetchRecipes(); Phase.js/fetchRecipes(); Recipe.js/fetchRecipes(); 
    Outputs to: Device.js/fetchRecipes(); Phase.js/fetchRecipes(); Recipe.js/fetchRecipes(); 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Retrieves all recipes
    """ 
    def get_queryset(self):
        return Recipe.objects.all()

class PlantView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,) 
    serializer_class = PlantSerializer
    filter_backends = (OrderingFilter,)
    ordering_fields = ['name']

    def create(self, request, *args, **kwargs):
        plants = Plant.objects.all()
        p_id = 1
        while(plants.filter(id = p_id)):
            p_id = p_id+1
        print(dir(request))
        request.data['id'] = p_id
        #print(request.data)
        print(request._full_data)

        plant_id = super().create(request, *args, **kwargs).data['id']
        plant = Plant.objects.get(id=plant_id)
        return JsonResponse(model_to_dict(plant), safe=False) 

    """
    Input from: Device.js/fetchPlants(); Phase.js/fetchPlants(); Recipe.js/fetchPlants(); 
    Outputs to: Device.js/fetchPlants(); Phase.js/fetchPlants(); Recipe.js/fetchPlants(); 
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Retrieves all plants ordered by their name
    """ 
    def get_queryset(self):
        return Plant.objects.all().order_by('name')

class CreateUserAPIView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    """
    Input from: LoginOrCreateForm.js/login()
    Outputs to: LoginOrCreateForm.js/login()
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Creates a new user in database and creates a token for keeping users logged in for a session.
    """ 
    def create(self, request, *args, **kwargs):
        try:
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

        except IntegrityError as e:
            return Response(
                status=409
            )

class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all() # django specific user type

    """
    Input from: Dashboard.js/logout()
    Outputs to: Dashboard.js/logout()
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Deletes user token from database???
    """ 
    def get(self, request, format=None):
        # simply delete the token to force a login
        # request.user.auth_token.delete()
        return Response({'msg': "success logout"}, status=status.HTTP_200_OK)

# get authorization
class VerifyUserView(APIView):
    model = get_user_model()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,) 

    """
    Input from: LoginOrCreateForm.js/login()
    Outputs to: LoginOrCreateForm.js/login()
    Created by: Kelvin F 08/30/2022
    Last Edit: Kelvin F 08/30/2022
    Purpose: Verifies if user credentials are valid
    """ 
    def post(self, request, *args, **kwargs):
        if request.user:
            return Response(UserSerializer(request.user).data)


class MQTTView(APIView):
    permission_classes = (IsAuthenticated,) 

    """
    Input from: MQTT.js/send_command()
    Outputs to: MQTT.js/send_command()
    Created by: Stella T 08/30/2022
    Last Edit: Stella T 08/30/2022
    Purpose: Takes all parameters from frontend and sends commands to devices
    based on parameters given. Will always return a response, see generic_mqtt_client.py 
    """
    def post(self, request, *args, **kwargs):
        env = request.data['env']
        device = request.data['device']
        command = request.data['command']
        broker = GenericMQTT(env)

        if command == 0:
            data = broker.get_device_status(device)
            data = {key: data[key] for key in data if key not in ['luxZone', 'mqttConfig', 'totalLuxZones', 'wifiCredentials']}
            return JsonResponse(data, safe=False)
        elif command == 1: 
            #WORKS BUT FORMATTING ISSUES
            data = broker.get_device_logs(device)
            return Response(data, content_type='text/plain; charset=utf8')
        elif command == 3:
            recipe_name = request.data["parameters"]['recipe_name']
            recipe_json = request.data["parameters"]['recipe_json']
            data = broker.add_recipe(device, recipe_name, recipe_json)
            return JsonResponse(data, safe=False)
        elif command == 7:
            timezone = request.data['parameters']['timezone']
            data = broker.change_timezone(device, timezone)
            return JsonResponse(data, safe=False)
        elif command == 11:
            hour = int(request.data['parameters']['hour'])
            minute = int(request.data['parameters']['minute'])
            data = broker.set_start_time(device, hour, minute)
            return JsonResponse(data, safe=False)
        elif command == 12:
            data = {
                "macAddress": broker.trigger_OTA(device),
                "msg": "OTA Trigger sent, check Mender to see if device is downloading firmware"}
            return JsonResponse(data, safe=False)
        elif command == 14:
            #Cannot change stage + cycle if byte hasn't started recipe yet?
            stage = int(request.data['parameters']['stage'])
            cycle = int(request.data['parameters']['cycle'])
            data = broker.change_stage_cycle(device, stage, cycle)
            return JsonResponse(data, safe=False)
        elif command == 15:
            ##GET RECIPE LIST
            data = broker.get_recipe_list(device)
            return JsonResponse(data, safe=False)
        elif command == 16:
            #RECIPE NAME MUST BE EXACT AND INCLUDE .json at the end!
            recipe_name = request.data["parameters"]["recipe_name"]
            data = broker.trigger_recipe_by_name(device, recipe_name)
            return JsonResponse(data, safe=False)
        else: 
            data = {"error": "wrong command id"}
            return JsonResponse(data, safe=False)
        
        
