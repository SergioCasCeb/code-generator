import requests

URL = "http://localhost:3000/http-express-calculator-simple/actions/subtract"

payload = -54004888.43

def invokeaction_subtract(payload_value):
  try:
    response = requests.post(URL,json=payload_value, headers={"Content-Type": "application/json"})
    if response.status_code == 200:
      subtract = response.json()
      print("subtract value:", subtract)
      return subtract
    else:
      print(f"Failed to invokeaction subtract. Status code: {response.status_code}, Response: {response.text}")

  except requests.exceptions.RequestException as error:
    print("Error during the request:", error)

invokeaction_subtract(payload)