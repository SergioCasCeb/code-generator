import requests

URL = "http://localhost:3000/http-express-calculator-simple/properties/result"

def readproperty_result():
  try:
    response = requests.get(URL)
    if response.status_code == 200:
      result = response.json()
      print("result value:", result)
      return result
    else:
      print(f"Failed to readproperty result. Status code: {response.status_code}, Response: {response.text}")

  except requests.exceptions.RequestException as error:
    print("Error during the request:", error)

readproperty_result()