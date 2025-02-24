Here is the Python code using the `requests` library to perform the specified operation:

```
import requests
import json

url = "http://localhost:3000/http-express-calculator-simple/"
affordance = "subtract"

headers = {
    "Accept": "application/json"
}

if affordance == "subtract":
    data = {"input": 10}
    response = requests.post(f"{url}actions/{affordance}", headers=headers, json=data)     
    if response.status_code == 200:
        print(json.loads(response.content)["output"])
    else:
        print(f"Error: {response.status_code}")
```

Let me know if this is what you are looking for.