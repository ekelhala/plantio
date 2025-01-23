import network
import json
import socket
from phew import access_point, dns, server, get_ip_address
from phew.template import render_template

def saveOptions(options):
    try:
        with open('options.json', 'w') as optionsFile:
            json.dump(options, optionsFile)
            print('Options saved')
            return True
    except Exception:
        print('Failed to save options')
        return False

def connectToNetwork(options):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(options['ssid'], options['pwd'])
    connection_timeout = 10
    while connection_timeout > 0:
        if wlan.status() == 3:
            break
        connection_timeout -= 1
        print('Waiting for Wi-Fi connection...')
        sleep(1)

    if wlan.status() != 3: 
        wlan.active(False)
        getConnectionDetails()
    else:
        print('connected to network')


def getConnectionDetails():
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.ifconfig(('192.168.4.1', '255.255.255.0', '192.168.4.1', '192.168.4.1'))
    ap.config(ssid='Multameter', security=0)
    dns.run_catchall('192.168.4.1')
    
    @server.route("/set-wifi-credentials", methods=["POST"])
    def save_credentials(request):
        print(request.data)
        return "ok"
    
    @server.catchall()
    def login(request):
        return render_template('templates/login.html')
    
    server.run()