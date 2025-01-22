def parseRequest(request):
    try:
        body = request.split('\r\n\r\n')[1]
        print(body)
        formData = json.loads(body)
        return formData
    except Exception as e:
        print('Error when parsing request', e)
        return None

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
    options = {}
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.config(ssid='Multameter', security=0)
    print('Access Point started')
    html = """<!DOCTYPE html>
            <html>
            <head>
                <title>Multameter - asetukset</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    .wifi-form-container {
                         position: fixed;
                         margin-top: 1em;
                         display: flex;
                         width: 100%;
                         height: 100%;
                         flex-direction: column;
                         justify-content: center;
                         align-items: center;
                    }
                </style>
                <script>
                    window.addEventListener('load', () => {
                        form = document.getElementById('wifi-form')
                        form.addEventListener('submit', async (e) => {
                        e.preventDefault()
                        target = e.currentTarget
                        console.log({ssid: target.ssid.value, pwd: target.pwd.value})
                        await fetch(target.action, {method: "POST", body: JSON.stringify({ssid: target.ssid.value, pwd: target.pwd.value})})
                        })
                    })
                </script>
            </head>
            <body>
            <div class="wifi-form-container">
            <h2>Wi-Fi-asetukset</h2>
            <form action="/connect" method="post" id="wifi-form">
                SSID: <input type="text" name="ssid"><br>
                Salasana: <input type="password" name="pwd"><br>
                <input type="submit" value="OK">
            </form>
            </div>
            </body>
            </html>
            """

    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    s = socket.socket()
    s.bind(addr)
    s.listen(1)
    print('Listening on', addr)

    while True:
        dataFound = False
        cl, addr = s.accept()
        print('Client connected from', addr)
        request = cl.recv(1024).decode()
        print('Request:', request)

        if '/connect' in request:
            formData = parseRequest(request)
            options['ssid'] = formData['ssid']
            options['pwd'] = formData['pwd']
            print(options)
            saveOptions(options)
            dataFound = True

        cl.send('HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n')
        cl.send(html)
        cl.close()
        if dataFound:
            ap.active(False)
            connectToNetwork(options)
            break