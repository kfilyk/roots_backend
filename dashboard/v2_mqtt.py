import time
import paho.mqtt.client as paho
import ssl
import json
from types import SimpleNamespace

#Followed: http://www.steves-internet-guide.com/python-mqtt-publish-subscribe/

class MQTT:
    msgs = []
    broker='35.183.154.210'
    port = 1883
    client = paho.Client("client-001") #create client object client1.on_publish = on_publish #assign function to callback client1.connect(broker,port) #establish connection client1.publish("house/bulb1","on")
    
    def on_message(self, client, userdata, message):
        x = json.loads(str(message.payload.decode("utf-8")), object_hook=lambda d: SimpleNamespace(**d))
        self.msgs = x

    username = 'avaadmin'
    password = 'SBrf,$TukF9Zd8:L'

    client.username_pw_set(username, password)

    def test(self, device):
        self.client.on_message=self.on_message
        self.client.connect(self.broker, port=self.port)#connect
        self.client.loop_start() #start loop to process received messages

        self.client.subscribe(f'avagrows/device/client/{device}/deviceState')#subscribe
        self.client.publish(f'avagrows/device/server/{device}/devicecommand','{"command": 0}')#publish
        time.sleep(1)
        self.client.unsubscribe(f'avagrows/device/client/{device}/deviceState')#subscribe

        time.sleep(4)

        self.client.disconnect() #disconnect
        self.client.loop_stop()

        return json.dumps(self.msgs, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)


