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
