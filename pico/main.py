from machine import Pin, ADC
from time import sleep, time
from umqtt.simple import MQTTClient
import ssl
import config
import json
import ntptime
import socket
from networkManager import NetworkManager

POWER_PIN = 22
fc28PowerPin = Pin(POWER_PIN, Pin.OUT)
adc = ADC(26)

DRY = 65000
WET = 47000
MINUTE = 60 # minute in seconds

MOISTURE_LEVEL = 'moistureLevel'

state = {
    'moistureLevel': 0
}

options = {}
network_manager = NetworkManager()
network_manager.connect()

while not network_manager.is_connected():
    print('waiting for connection...')
    sleep(1)

ntptime.settime()

sslContext = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
sslContext.verify_mode = ssl.CERT_NONE

mqttClient = MQTTClient(client_id=config.MQTT_USER, server=config.MQTT_BROKER, port=config.MQTT_PORT,
                    user=config.MQTT_USER, password=config.MQTT_PWD, ssl=sslContext)
mqttClient.connect()
print('MQTT client connected')

def measure():
    fc28PowerPin.on()
    sleep(1)
    state[MOISTURE_LEVEL] = adc.read_u16()
    fc28PowerPin.off()
    
def publish():
    mqttClient.publish('/moisture_level', json.dumps({
                                                    'value': state[MOISTURE_LEVEL],
                                                    'timestamp': round(time()*1000),
                                                    'nodeId': config.MQTT_USER}))
    print('published')
"""    
while True:
    measure()
    print(state[MOISTURE_LEVEL])
    publish()
    sleep(2*MINUTE) # sleeping for 2 minutes
"""