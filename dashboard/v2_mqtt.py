import time
import paho.mqtt.client as paho
import ssl
import json
from types import SimpleNamespace
from dashboard.models import Device

#Followed: http://www.steves-internet-guide.com/python-mqtt-publish-subscribe/

class MQTT:

    def __init__(self):
        self.msgs = []
        self.broker='35.183.154.210'
        self.client = paho.Client("client-001") #create client object client1.on_publish = on_publish #assign function to callback client1.connect(broker,port) #establish connection client1.publish("house/bulb1","on")

        #####
        ##### DEV BROKER V2
        # self.port = 1883
        # self.username = 'avaadmin'
        # self.password = 'SBrf,$TukF9Zd8:L'
        #####
        ##### 

        #####
        ##### PROD BROKER V2
        self.broker='3.98.119.149'
        self.port = 1883
        self.username = 'avaadmin'
        self.password = 'AVrf,$TukF9Zd8:Q'
        #####
        #####

        self.client.username_pw_set(self.username, self.password)
        self.client.on_message=self.on_message

    def on_message(self, client, userdata, message):
        # x = json.loads(str(message.payload.decode("utf-8")))
        x = json.loads(str(message.payload.decode("utf-8")), object_hook=lambda d: SimpleNamespace(**d))
        self.msgs.append(x)

    def get_device_status(self, device):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
        time.sleep(2)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        time.sleep(1)

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return json.dumps(self.msgs[0], default=lambda o: o.__dict__, 
                sort_keys=True, indent=4)
            # return self.msgs[0]
        else: 
            return json.dumps({})
            # return {}


    '''
    def set_start_time(self, device, hour, minute):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 11, "hour":{hour}, "minute":{minute}}}', qos=1)

        time.sleep(2)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
        time.sleep(1)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return self.msgs[0].dailyStartTime
        else: 
            return json.dumps({})
    '''

    def check_online(self):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        tokens = list(Device.objects.all().values_list('token', flat=True))
        
        for device in tokens:
            self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
            self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
            time.sleep(1) # sleep 1 second
            self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        
        time.sleep(2) # extra 2 sec just to make sure

        x = [d.deviceId for d in self.msgs if d.deviceStatus == 1]

        self.client.disconnect() #disconnect
        self.client.loop_stop()
        # get rid of dups: return set
        return set(x)

    def trigger_recipe(self, token, recipe, recipe_name):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        self.client.subscribe(f'avagrows/device/client/{token}/deviceState')#subscribe

        self.client.publish(f'avagrows/device/server/{token}/devicecommand', \
            f'{{"command": 3, "name":"{recipe_name}", "data":{json.dumps(recipe)}}}')
        time.sleep(1)
        self.client.publish(f'avagrows/device/server/{token}/devicecommand', \
            f'{{"command": 4, "name":"{recipe_name}"}}')
        time.sleep(1)
        self.client.publish(f'avagrows/device/server/{token}/devicecommand','{"command": 0}')
        time.sleep(1)
        if len(self.msgs) > 0:
            if self.msgs[0].currentRecipe == recipe_name:
                self.client.unsubscribe(f'avagrows/device/client/{token}/deviceState')#subscribe

                self.client.disconnect() #disconnect
                self.client.loop_stop()
                print("1: ", self.msgs[0].deviceId)
                return {"currentRecipe": recipe_name, "dailyStartTime": self.msgs[0].dailyStartTime}
        else: 
            self.client.publish(f'avagrows/device/server/{token}/devicecommand','{"command": 0}')
            time.sleep(1)
            if len(self.msgs) > 0:
                if self.msgs[0].currentRecipe == recipe_name:
                    self.client.unsubscribe(f'avagrows/device/client/{token}/deviceState')#subscribe
                    self.client.disconnect() #disconnect
                    self.client.loop_stop()
                    print("2: ", self.msgs[0].deviceId)
                    return {"currentRecipe": recipe_name, "dailyStartTime": self.msgs[0].dailyStartTime}

        self.client.unsubscribe(f'avagrows/device/client/{token}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        
