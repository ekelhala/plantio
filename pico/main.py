from machine import Pin, ADC
from time import sleep, time
from umqtt.simple import MQTTClient
import ssl
import network
import config
import json
import ntptime

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

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(config.ssid, config.pwd)

connection_timeout = 10
while connection_timeout > 0:
    if wlan.status() == 3: # connected/ip obtained
        break
    connection_timeout -= 1
    print('Waiting for Wi-Fi connection...')
    sleep(1)

# check if connection successful
if wlan.status() != 3: 
    raise RuntimeError('[ERROR] Failed to establish a network connection')
else:
    print('[INFO] CONNECTED SUCCESSFULLY')

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
    moisture = adc.read_u16()
    fc28PowerPin.off()
    moistureLevel = max(0, min(100, 100 * (DRY - moisture) / (DRY - WET)))
    state[MOISTURE_LEVEL] = round(moistureLevel, 2)
    print("{}%".format(moistureLevel))
    
def publish():
    mqttClient.publish('/moisture_level', json.dumps({
                                                    'value': state[MOISTURE_LEVEL],
                                                    'timestamp': time(),
                                                    'nodeId': config.MQTT_USER}))
    print('published')
    
while True:
    measure()
    print(state[MOISTURE_LEVEL])
    publish()
    sleep(5*MINUTE) # sleeping for 5 minutes
