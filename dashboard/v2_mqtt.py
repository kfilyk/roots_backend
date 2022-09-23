import time
import paho.mqtt.client as paho
import ssl
import json
from types import SimpleNamespace
from dashboard.models import Device

#Followed: http://www.steves-internet-guide.com/python-mqtt-publish-subscribe/

"""
OVERALL FILE PURPOSE: USES PAHO's MQTT CLIENT TO CONNECT TO OUR MQTT BROKER AND SEND COMMANDS TO DEVICES.

"""

class MQTT:

    """
    Input from: NONE
    Outputs to: NONE
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Initializes MQTT client and connects to specificed MQTT broker. 
    Sets on_message which defines what happens to the response received from device.
    """
    def __init__(self):
        self.msgs = []
        self.client = paho.Client("client-001") #create client object client1.on_publish = on_publish #assign function to callback client1.connect(broker,port) #establish connection client1.publish("house/bulb1","on")

        ##### DEV BROKER V2
        # self.port = 1883
        # self.username = 'avaadmin'
        # self.password = 'SBrf,$TukF9Zd8:L'
        #####

        ##### PROD BROKER V2
        #self.broker='3.98.119.149'
        #self.port = 1883
        #self.username = 'avaadmin'
        #self.password = 'AVrf,$TukF9Zd8:Q'
        #####

        ##### ROOTS BROKER V2
        self.broker='35.183.187.125'
        self.port = 1883
        self.username = 'admin'
        self.password = 'public'
        #####

        self.client.username_pw_set(self.username, self.password)
        self.client.on_message=self.on_message

    """
    Input from: NONE
    Outputs to: self.msgs
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Defines what happens to the response received from device.
    In this case, it decodes the response, converts to it a SimpleNamespace then JSON object.
    Lastly, it gets appended to a messages array. 
    """
    def on_message(self, client, userdata, message):
        # x = json.loads(str(message.payload.decode("utf-8")))
        x = json.loads(str(message.payload.decode("utf-8")), object_hook=lambda d: SimpleNamespace(**d))
        self.msgs.append(x)


    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Gets the entire device state for a single device
    """
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


    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: DOES NOT WORK. 
    The format of device logs is plain txt so the on_message cannot be used on response.
    """
    def get_device_logs(self, device):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/devicelogs')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 1}')#publish
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


    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Takes the given deviceId, hour and minute values and changes its start time accordingly. 
    """
    def set_start_time(self, device, hour, minute):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 11, "hour":{hour}, "minute":{minute}}}', qos=1)
        time.sleep(1)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
        time.sleep(1)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return self.msgs[0].dailyStartTime
        else: 
            return -11

    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Takes the given deviceId and timezone and changes its timezone accordingly. 
    The device's firmware has a bug where +/- are flipped for timezones. 
    """
    def change_timezone(self, device, timezone):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 7, "timezone":"{timezone}"}}')
        time.sleep(2)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
        time.sleep(2)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return {"timezone": self.msgs[0].timezone, "localTime": self.msgs[0].localTime, "isTimeSynced": self.msgs[0].isTimeSynced}
        else: 
            return -7

    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Sends a command that triggers device to check for an OTA update
    """
    def trigger_OTA(self, device):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 12}}')
        time.sleep(1)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 12}}')
        time.sleep(1)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 0}}')
        time.sleep(1)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return self.msgs[0].macAddress
        else: 
            return -12
        
    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Changes the stage and cycle of a device
    """ 
    def change_stage_cycle(self, device, stage, cycle):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        x = f'{{"command": 14, "newCycle":{cycle}, "newStage":{stage}}}'
        print("DSLJDALKDJASL ", x)
        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 14, "newCycle":{cycle}, "newStage":{stage}}}')
        time.sleep(1)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', f'{{"command": 14, "newCycle":{cycle}, "newStage":{stage}}}')
        time.sleep(1)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        return {"msg": "Command sent. Please wait two minutes for stage and cycle to update."}

    """
    Input from: views.py/check_device_activity()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/18/2022
    Last Edit: Kelvin Filyk 08/19/2022
    Purpose: Get all devices states + returns a list of all online devices.
    """ 
    def get_device_data(self):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        devices = list(Device.objects.all().values_list('id', flat=True))

        i = 0
        for device in devices:
            self.client.subscribe(f'avagrows/device/client/{device}/deviceState')
            self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}') #publish
            i = i+1

        time.sleep(60) 

        for device in devices:
            self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')
        
        #print("DEVICES CONTACTED: ", i) # debug: check 
        #print("DEVICES RETURNED: ", len(self.msgs))

        self.client.disconnect() 
        self.client.loop_stop()

        #x = [d.deviceId for d in self.msgs if d.deviceStatus == 1] # x is the set of all online devices
        return self.msgs

    """
    Input from: views.py/send_command()
    Outputs to: views.py/send_command()
    Created by: Stella T 08/18/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Given a deviceId, recipe JSON, and recipe_json, function sends two commands (command 3: add & command 4: trigger)
    to the device which sets the recipe on the device. 

    command 3 uploads recipe
    command 4 triggers it
    """ 
    def trigger_recipe(self, id, recipe, recipe_name):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        self.client.subscribe(f'avagrows/device/client/{id}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{id}/devicecommand', \
            f'{{"command": 3, "name":"{recipe_name}", "data":{json.dumps(recipe)}}}')
        time.sleep(5)
        self.client.publish(f'avagrows/device/server/{id}/devicecommand', \
            f'{{"command": 4, "name":"{recipe_name}"}}')
        time.sleep(5)
        self.client.publish(f'avagrows/device/server/{id}/devicecommand','{"command": 0}')
        '''
        time.sleep(5)
        if len(self.msgs) > 0:
            if self.msgs[0].current_recipe == recipe_name:
                self.client.unsubscribe(f'avagrows/device/client/{id}/deviceState')#subscribe

                self.client.disconnect() #disconnect
                self.client.loop_stop()
                print("1: ", self.msgs[0].deviceId)
                return {"current_recipe": recipe_name, "dailyStartTime": self.msgs[0].dailyStartTime}
        else: 
            self.client.publish(f'avagrows/device/server/{id}/devicecommand','{"command": 0}')
            if len(self.msgs) > 0:
                if self.msgs[0].current_recipe == recipe_name:
                    self.client.unsubscribe(f'avagrows/device/client/{id}/deviceState')#subscribe
                    self.client.disconnect() #disconnect
                    self.client.loop_stop()
                    print("2: ", self.msgs[0].deviceId)
                    return {"current_recipe": recipe_name, "dailyStartTime": self.msgs[0].dailyStartTime}
        '''
        time.sleep(5)
        if len(self.msgs) > 0:
            print("DEVICE STATE: \n")
            print(self.msgs[0])
        self.client.unsubscribe(f'avagrows/device/client/{id}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()
