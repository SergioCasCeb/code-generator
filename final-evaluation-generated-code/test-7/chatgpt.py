import requests
import json

def read_property():
    url = "http://localhost:3000/http-express-calculator-simple/properties/result"
    headers = {
        'Content-Type': 'application/json',
    }
    response = requests.request("GET", url, headers=headers)
    return json.loads(response.text)

print(read_property())