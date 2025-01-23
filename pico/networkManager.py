import network
import json
import socket
from phew import access_point, dns, server, get_ip_address
from phew.template import render_template
from time import sleep
import machine
import _thread

class NetworkManager:
    _connected: False
    _ap: None

    def is_connected(self):
        return self._connected

    def connect(self):
        options = self._load_options()
        if options:
            self._do_connect(options)
        else:
            self._start_captive_portal()

    def _reset(self):
        print('Restarting in couple seconds...')
        sleep(1)
        server.close()
        self._ap.disconnect()
        self._ap.active(False)
        sleep(2)
        machine.reset()

    def _save_options(self, options):
        try:
            with open('options.json', 'w') as options_file:
                json.dump(options, options_file)
                print('Options saved')
                return True
        except Exception:
            print('Failed to save options')
            return False
    
    def _load_options(self):
        try:
            with open('options.json', 'r') as options_file:
                contents = options_file.read()
                options = json.loads(contents)
                if(options['ssid'] and options['password']):
                    return options
                else:
                    return None
        except Exception:
            return None

    def _do_connect(self, options):
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(options['ssid'], options['password'])
        connection_timeout = 10
        while connection_timeout > 0:
            if wlan.status() == 3:
                break
            connection_timeout -= 1
            print('Waiting for Wi-Fi connection...')
            sleep(1)

        if wlan.status() != 3: 
            wlan.active(False)
            self._start_captive_portal()
        else:
            self._connected = True
            print('connected to network')


    def _start_captive_portal(self):
        self._ap = network.WLAN(network.AP_IF)
        self._ap.active(True)
        self._ap.ifconfig(('192.168.4.1', '255.255.255.0', '192.168.4.1', '192.168.4.1'))
        self._ap.config(ssid='Multameter', security=0)
        dns.run_catchall('192.168.4.1')
        
        @server.route("/set-wifi-credentials", methods=["POST"])
        def save_credentials(request):
            print(request.data)
            self._save_options(request.data)
            _thread.start_new_thread(self._reset, ())
            return "ok"
        
        @server.catchall()
        def login(request):
            return render_template('templates/login.html')
        
        server.run()