```python
import requests
import json

url = "http://localhost:3000/http-express-calculator-simple/properties/result"
headers = {
    'Accept': 'application/json'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = json.loads(response.text)
    print(data)
else:
    print(f"Error: {response.status_code}")

```