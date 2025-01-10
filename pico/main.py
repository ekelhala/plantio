from machine import Pin, ADC
from time import sleep

POWER_PIN = 22
fc28PowerPin = Pin(POWER_PIN, Pin.OUT)
adc = ADC(26)

DRY = 65000
WET = 47000

while True:
    fc28PowerPin.on()
    sleep(1)
    moisture = adc.read_u16()
    fc28PowerPin.off()
    moistureLevel = max(0, min(100, 100 * (DRY - moisture) / (DRY - WET)))
    print("{:.2f} %".format(moistureLevel))
    sleep(10)