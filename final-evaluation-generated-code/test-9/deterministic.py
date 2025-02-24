import requests

URL = "http://localhost:3000/http-express-calculator-simple/events/update"

def subscribeevent_update():
  while True:
    try: 
      response = requests.get(URL, stream=True, timeout=10)

      if response.status_code == 200:
        for line in response.iter_lines():
          if line:
            data = line.decode("utf-8")
            print(data)
      else:
        print(f"Failed to subscribeevent update. Status code: {response.status_code}, Response: {response.text}")
        break

    # Closing the connection after timeout or on error
    except requests.exceptions.RequestException as error:
      print("Error during the request:", error)
      break

subscribeevent_update()