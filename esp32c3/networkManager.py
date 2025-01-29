import network
import json
import socket
from phew import access_point, dns, server, get_ip_address
from phew.template import render_template
from time import sleep, sleep_ms
import machine
import _thread
from machine import WDT

DOMAIN = "multameter.setup"

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
        server.close()
        sleep_ms(1000)
        self._ap.disconnect()
        self._ap.active(False)
        sleep_ms(2000)
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
        wlan = network.WLAN(network.WLAN.IF_STA)
        network.hostname('multameter')
        wlan.active(True)
        print(options['ssid'], options['password'])
        wlan.connect(options['ssid'], options['password'])
        connection_timeout = 10
        while connection_timeout > 0:
            if wlan.isconnected():
                break
            connection_timeout -= 1
            print('Waiting for Wi-Fi connection...')
            sleep(1)

        if not wlan.isconnected():
            wlan.active(False)
            self._start_captive_portal()
        else:
            self._connected = True
            print('connected to network')


    def _start_captive_portal(self):
        self._ap = network.WLAN(network.WLAN.IF_AP)
        self._ap.active(True)
        self._ap.ifconfig(('192.168.4.1', '255.255.255.0', '192.168.4.1', '192.168.4.1'))
        self._ap.config(ssid='Multameter', security=0)
        dns.run_catchall('192.168.4.1')
        
        @server.route("/", methods=["GET"])
        def index(request):
            if request.headers.get("host").lower() != DOMAIN:
                return server.redirect(f"http://{DOMAIN}")
            return render_template("templates/index.html")

        @server.route("/set-wifi-credentials", methods=["POST"])
        def save_credentials(request):
            print(request.data)
            self._save_options(request.data)
            _thread.start_new_thread(self._reset, ())
            return "ok"
        
        @server.catchall()
        def catch_all(request):
            if request.headers.get("host").lower() != DOMAIN:
                return server.redirect(f"http://{DOMAIN}")
            return "Not found", 404
        
        server.run()