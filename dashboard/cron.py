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
                    
                    # if phase has never been set before
                    if curr_phase is not None:

                        if (curr_exp_day - curr_phase.days) < 0:
                            curr_exp.current_phase = getattr(curr_exp.recipe, p.name, None)
                            curr_exp.phase_day = curr_exp_day
                            curr_exp.save()
                            break
                    else:
                        curr_exp_day = curr_exp_day - curr_phase.days

def check_device_activity():
    broker = MQTT()
    online_devices = broker.check_online() # listed in v2_mqtt.py
    print("FLAG:", online_devices)

    Device.objects.filter(id__in=online_devices).update(is_online=1)
    Device.objects.exclude(id__in=online_devices).update(is_online=0)

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

