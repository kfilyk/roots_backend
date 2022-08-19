from .models import Experiment, Pod, Recipe, Device
from django.contrib.auth.models import User
from django.db.models import F
from datetime import datetime, timedelta
from django.utils import timezone
from .v2_mqtt import MQTT
import requests
import json

def check_experiments_end_date_daily():
    curr_date = datetime.now()
    tz = timezone.get_current_timezone()
    curr_date = curr_date.replace(tzinfo=tz)
    phases = Recipe._meta.fields[4:14]
    active_exps = Experiment.objects.filter(end_date__isnull=True)
    active_exp_ids = [exp.id for exp in active_exps if exp.start_date.date() <= curr_date.date()] # collect all experiments that have already started
    active_exps = Experiment.objects.filter(pk__in=active_exp_ids).select_related('recipe').annotate(recipe_days=F('recipe__days'))
    
    #active_exps.update(day=F('day')+1) 
    #active_exps.update(day=(curr_date.date() - F('start_date').date()).days()) 


    for curr_exp in active_exps:
        
        if curr_exp.recipe != None:
            curr_exp.day = (curr_date.date() - curr_exp.start_date.date()).days

            # if the experiment has a recipe allocated to it, and the current date does not exceed the max date range
            if (curr_exp.start_date.date() + timedelta(curr_exp.recipe_days)) <= curr_date.date():
                curr_exp.end_date = curr_date
                curr_exp.save()
                pods = Pod.objects.filter(experiment = curr_exp.id, end_date__isnull=True)
                pods.update(end_date=curr_date)
            else: 
                # this results in a summation of days from each phase up until the exact day is reached
                curr_exp_day = curr_exp.day
                for p in phases:
                    curr_phase = getattr(curr_exp.recipe, p.name, None)
                    if curr_phase is not None:
                        
                        if (curr_exp_day - curr_phase.days) < 0:
                            curr_exp.current_phase = getattr(curr_exp.recipe, p.name, None)
                            curr_exp.phase_day = curr_exp_day
                            curr_exp.save()
                            break
                        else:
                            curr_exp_day = curr_exp_day - curr_phase.days

'''
updates isonline
checks recipe status 

Issues: Update to check for duplicate return messages from the same byte - so sayeth El Capitan. Also, the "e = list(Experiment.objects.filter(device_id = d.deviceId).select_related('recipe').annotate(recipe_name=F('recipe__name')).values())[0]" is ugly. fix it!
'''
def check_devices():
    broker = MQTT()
    online_devices = broker.get_device_data() # listed in v2_mqtt.py
    device_ids = [d.deviceId for d in online_devices] 
    #print("FLAG:", online_devices)

    # update which devices online
    Device.objects.filter(id__in=device_ids).update(is_online=1)
    Device.objects.exclude(id__in=device_ids).update(is_online=0)

    #confirm devices have correct recipe - if not, reset to correct recipe
    for d in online_devices:
        #print("DEVICE IN DB: ", Device.objects.filter(id = d.deviceId).values())
        e = list(Experiment.objects.filter(device_id = d.deviceId).select_related('recipe').annotate(recipe_name=F('recipe__name')).values())

        # if there is an experiment currently running for a given device:

        if e:
            r = Recipe.objects.get(id = e[0]['recipe_id'])
            #print(dir(r))
            #print("EXPERIMENT IN DB FOR :"+d.deviceId, e)

            # update recipe in byte 
            #print("EXPERIMENT RECIPE DAY/PHASE: "+ str(e[0]['day']) +" | " + str(e[0]['phase_day']))

            if e[0]['recipe_name']+ ".json" != d.currentRecipe:
                print("CURRENT RECIPE IN "+d.deviceId+": ", d.currentRecipe)
                print("CURRENT RECIPE IN DB: ", e[0]['recipe_name']+ ".json: \n\n" + r.recipe_json)
                broker.trigger_recipe(d.deviceId, r.recipe_json, e[0]['recipe_name']+ ".json")
                broker.set_recipe_day_cycle(d.deviceId, e[0]['day'], e[0]['phase_day'])






url = "https://data.mongodb-api.com/app/data-ldetp/endpoint/data/v1/action/find"
payload = json.dumps({
    "collection": "gardens",
    "database": "roots",
    "dataSource": "Cluster0",
    
    #"projection": {
    #    "_id": 1
    #}
})
headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': 'gOvJhCMCWcU3DFs2tAuZoAvO6qk7FAioyklQk6xZ8KlfSS9YG2Ya1SYKLTtudk61', 
}

# used to pull new devices, experiments, etc from the mobile app
def poll_mongo_db():
    response = requests.request("POST", url, headers=headers, data=payload)
    gardens = json.loads(response.text) # use .keys() function to determine whats stored in object
    i = 1
    for g in gardens['documents']:
        # note: g['_id'] is the id of the USER, not the garden object
        #print(g.keys())
        g_device = g['device']
        #print(g_device)
        g_device_state = json.loads(g_device['rawStateJSON'])
        #print(g_device_state['deviceId'])
        d = Device.objects.create(id = str(g_device_state['deviceId']), name=g['name'], user= User.objects.filter(id=61)[0], registration_date=g['createdAt'], last_update=g['updatedAt'], mac_address= g_device_state['macAddress'])
        d.save()
        i= i+1

