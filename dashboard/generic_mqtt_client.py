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

dev = {"broker": "35.183.154.210", "port": 1883, "username": 'avaadmin', "password": 'SBrf,$TukF9Zd8:L'}
prod = {"broker": "3.98.119.149", "port": 1883, "username": 'avaadmin', "password": 'AVrf,$TukF9Zd8:Q'}
roots = {"broker": "35.183.187.125", "port": 1883, "username": 'admin', "password": 'public'}
qa = {"broker": "3.232.234.222", "port": 1883, "username": 'avagrows', "password": 'avabyte0613'}

class GenericMQTT:

    """
    Input from: NONE
    Outputs to: NONE
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Initializes MQTT client and connects to specificed MQTT broker. 
    Sets on_message which defines what happens to the response received from device.
    """

    def __init__(self, env):
        self.client = paho.Client("client-001")

        if env == "dev":
            env = dev
        elif env == "prod":
            env = prod
        elif env == "roots":
            env = roots
        elif env == "qa":
            env = qa

        self.broker=env['broker']
        self.port = env['port']
        self.username = env['username']
        self.password = env['password']

        self.logsFlag = False


        self.msgs = []
        self.logs = []

        # print("BB: ", self.broker)

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
        if (self.logsFlag):
            self.logs.append(str(message.payload.decode("utf-8")))
        else:
            x = json.loads(str(message.payload.decode("utf-8")))
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
            return self.msgs[0]
        else: 
            return {}


     #WORKS BUT FORMATTING ISSUES
    def get_device_logs(self, device):
        self.logsFlag = True

        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/devicelogs')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 1}')#publish
        time.sleep(2)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        time.sleep(1)

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        self.logsFlag = False
        if len(self.logs) > 0:
            return self.logs[0]
        else: 
            return {"logs": "none"}

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
            return {"dailyStartTime": self.msgs[0]['dailyStartTime'],
                    "recipeNextStartTime": self.msgs[0]["recipeNextStartTime"]}
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
            return {"timezone": self.msgs[0]['timezone'], "localTime": self.msgs[0]['localTime'], "isTimeSynced": self.msgs[0]['isTimeSynced']}
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
            return {"macAddress": self.msgs[0]['macAddress']}
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

    def set_recipe_day_cycle(self, id, cycle, phase):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        self.client.subscribe(f'avagrows/device/client/{id}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{id}/devicecommand', f'{{"command": 14, "newCycle": 0, "newStage":0}}')

    def get_recipe_list(self, device):
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
            return {"currentRecipe": self.msgs[0]["currentRecipe"], "recipeList": self.msgs[0]["recipeList"], 
                    "recipeNextStartTime": self.msgs[0]["recipeNextStartTime"]}
            return {}

    def trigger_recipe_by_name(self, device, recipe_name):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', \
            f'{{"command": 4, "name":"{recipe_name}"}}')
        time.sleep(2)

        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
        time.sleep(1)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return {"currentRecipe": self.msgs[0]["currentRecipe"], 
                    "recipeNextStartTime": self.msgs[0]["recipeNextStartTime"]}
            return {}

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
            return {"macAddress": self.msgs[0]["macAddress"], 
                    "softwareRevision": self.msgs[0]["softwareRevision"], 
                    "deviceStatus": self.msgs[0]["deviceStatus"], 
                    "userLED": self.msgs[0]["userLED"], 
                    "ipaddress": self.msgs[0]["ipaddress"], 
                    "recipeNextStartTime": self.msgs[0]["recipeNextStartTime"]}
            return {}

    def add_recipe(self, device, recipe_name, recipe_json):
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages
        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand', \
            f'{{"command": 3, "name":"{recipe_name}", "data":{recipe_json}}}')
        time.sleep(3)
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')
        time.sleep(1)

        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.disconnect() #disconnect
        self.client.loop_stop()

        if len(self.msgs) > 0:
            return {"currentRecipe": self.msgs[0]["currentRecipe"], "recipeList": self.msgs[0]["recipeList"], 
                    "recipeNextStartTime": self.msgs[0]["recipeNextStartTime"]}
            return {}