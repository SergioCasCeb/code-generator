```python
import requests
import json

def subtract(value):
    url = "http://localhost:3000/http-express-calculator-simple/actions/subtract"
    headers = {'Content-Type': 'application/json'}
    payload = {"input": value}
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    if response.status_code == 200:
        return response.json()["output"]
    else:
        return None

#Example
result = subtract(5)
print(result)

```