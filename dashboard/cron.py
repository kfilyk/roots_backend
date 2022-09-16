from .models import Experiment, Pod, Recipe, Device, Plant
from django.contrib.auth.models import User
from django.db.models import F
from datetime import datetime, timedelta
from django.utils import timezone
from .v2_mqtt import MQTT
import requests
import json

"""
OVERALL FILE PURPOSE: DEFINES ALL FUNCTIONS RELATED TO CRONJOBS OUTLINED IN settings.py/CRONJOBS.
"""


"""
Input from: settings.py/CRONJOBS
Outputs to: Directly to Database
Created by: Stella T 08/19/2022
Last Edit: Stella T 08/19/2022
Purpose: Checks to see if experiment has ended otherwise updates phase day
"""
def update_experiments_daily():
    print("CRON UPDATING EXPERIMENTS")

    curr_date = datetime.now()
    tz = timezone.get_current_timezone()
    curr_date = curr_date.replace(tzinfo=tz)
    phases = Recipe._meta.fields[4:14]
    print(phases)
    active_exps = Experiment.objects.filter(end_date__isnull=True)
    active_exp_ids = [exp.id for exp in active_exps if exp.start_date.date() <= curr_date.date()] # collect all experiments that have already started
    active_exps = Experiment.objects.filter(pk__in=active_exp_ids).select_related('recipe').annotate(recipe_days=F('recipe__days'))
    
    #active_exps.update(day=F('day')+1) 
    #active_exps.update(day=(curr_date.date() - F('start_date').date()).days()) 


    for curr_exp in active_exps:
        
        if curr_exp.recipe != None:
            curr_exp.day = (curr_date.date() - curr_exp.start_date.date()).days

            # if the experiment has a recipe allocated to it, and the current date does not exceed the max date range
            if (curr_exp.start_date.date() + timedelta(curr_exp.recipe_days)) < curr_date.date():
                curr_exp.end_date = curr_date - timedelta(1)
                curr_exp.status = 2
                curr_exp.save()
                pods = Pod.objects.filter(experiment = curr_exp.id, end_date__isnull=True)
                pods.update(end_date=curr_date)
                pods.update(status=2)

            else: 
                # this results in a summation of days from each phase up until the exact day is reached
                curr_exp_day = curr_exp.day
                phase_number = 0
                for p in phases:
                    curr_phase = getattr(curr_exp.recipe, p.name, None)
                    if curr_phase is not None:
                        
                        if (curr_exp_day - curr_phase.days) < 0:
                            curr_exp.phase = getattr(curr_exp.recipe, p.name, None)
                            curr_exp.phase_day = curr_exp_day
                            curr_exp.phase_number = phase_number
                            curr_exp.save()
                            break
                        else:
                            curr_exp_day = curr_exp_day - curr_phase.days
                            phase_number = phase_number + 1
                            

'''
updates isonline
checks recipe status 

Issues: Update to check for duplicate return messages from the same byte - so sayeth El Capitan. Also, the "e = list(Experiment.objects.filter(device_id = d.deviceId).select_related('recipe').annotate(recipe_name=F('recipe__name')).values())[0]" is ugly. fix it!
'''
def check_devices():
    print("CRON CHECKING DEVICES")

    broker = MQTT()
    online_devices = broker.get_device_data() # listed in v2_mqtt.py
    device_ids = [d.deviceId for d in online_devices] 
    print("ONLINE DEVICES ("+ str(len(device_ids))+"): ", device_ids)

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
            print("CURRENT RECIPE IN "+d.deviceId+": ", d.currentRecipe)
            print("CURRENT RECIPE IN DB: ", str(e[0]['recipe_name'])+ ".json: \n\n" + str(r.recipe_json))
            if e[0]['recipe_name']+ ".json" != d.currentRecipe:
                #print("CURRENT RECIPE IN "+d.deviceId+": ", d.currentRecipe)
                #print("CURRENT RECIPE IN DB: ", str(e[0]['recipe_name'])+ ".json: \n\n" + str(r.recipe_json))
                print("PHASE DAY: ", e[0]['phase_day'])
                print("PHASE NUMBER: ", e[0]['phase_number'])

                broker.trigger_recipe(d.deviceId, r.recipe_json, e[0]['recipe_name']+ ".json")
                broker.change_stage_cycle(d.deviceId, e[0]['phase_day'], e[0]['phase_number'])

url = "https://data.mongodb-api.com/app/data-ldetp/endpoint/data/v1/action/find"
payload_gardens = json.dumps({
    "collection": "gardens",
    "database": "roots",
    "dataSource": "Cluster0",
    
    #"projection": {
    #    "_id": 1
    #}
})

payload_plants = json.dumps({
    "collection": "plants",
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

"""
Input from: variables (url, payload, headers) in cron.py
Outputs to: Database
Created by: Kelvin F 08/19/2022
Last Edit: Kelvin F 08/19/2022
Purpose: Polls devices from the Roots MongoDB database into the Roots SQL database
"""
# used to pull new devices, experiments, etc from the mobile app
def poll_mongo_db():
   
    print("CRON POLLING MONGO DB: DEVICES")
    response = requests.request("POST", url, headers=headers, data=payload_gardens)
    gardens = json.loads(response.text) # use .keys() function to determine whats stored in object
    for g in gardens['documents']:
        # note: g['_id'] is the id of the USER, not the garden object
        #print(g.keys())
        g_device = g['device']
        #print(g_device)
        g_device_state = json.loads(g_device['rawStateJSON'])
        if g_device_state and Device.objects.filter(id=g_device_state['deviceId']).first() == None:
            d = Device.objects.create(id = str(g_device_state['deviceId']), name=g['name'], user= User.objects.filter(id=61)[0], registration_date=g['createdAt'], last_update=g['updatedAt'], mac_address= g_device_state['macAddress'])
            d.save()

    print("CRON POLLING MONGO DB: PLANTS")
    response = requests.request("POST", url, headers=headers, data=payload_plants)
    plants = json.loads(response.text) # use .keys() function to determine whats stored in object
    for p in plants['documents']:
        # note: g['_id'] is the id of the USER, not the garden object
        #print(p.keys())
        #print(str(p['idealPHrange'][0]) + ", "+ str(p['idealPHrange'][1]))
        if Plant.objects.filter(id=p['_id']).first() == None:
            pl = Plant.objects.create(id = str(p['_id']), name=p['name'], scientific_name= p['scientificName'], profile=p['profile'], growing_tips=p['growingTips'], harvesting_tips=p['harvestingTips'], nutritional_benefits= p['nutritionalBenefits'], medical_uses = p['medicalUses'], fun_facts = p['funFacts'], storage = p['storage'], culinary= p['culinary'], ideal_ph_min = p['idealPHrange'][0], ideal_ph_max= p['idealPHrange'][1], ideal_ec_min = p['idealECrange'][0], ideal_ec_max = p['idealECrange'][1], ideal_water_temp_min = p['idealWaterTempRange'][0], ideal_water_temp_max = p['idealWaterTempRange'][1], ideal_temp_min = p['tempRange'][0], ideal_temp_max = p['tempRange'][1], ideal_humidity_min = p['idealHumidityPercentageRange'][0], ideal_humidity_max = p['idealHumidityPercentageRange'][1], ideal_days_to_sprout_min = p['sproutsMinDays'], ideal_days_to_sprout_max = p['sproutsMaxDays'], ideal_days_to_harvest = p['growthDurationDays'] )
            pl.save()
