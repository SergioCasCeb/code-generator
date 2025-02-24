```
import requests
import json

# Thing Description (TD)
td = {
    "@context": [
        "https://www.w3.org/2019/wot/td/v1",
        "https://www.w3.org/2022/wot/td/v1.1",
        {"@language": "en"}
    ],
    "@type": "Thing",
    "title": "http-express-calculator-simple",
    "description": "Calculator Thing",
    "securityDefinitions": {
        "nosec_sc": {
            "scheme": "nosec"
        }
    },
    "security": ["nosec_sc"],
    "base": "http://localhost:3000/http-express-calculator-simple/",
    "properties": {
        "result": {
            "type": "number",
            "readOnly": True,
            "writeOnly": False,
            "observable": True,
            "forms": [
                {
                    "href": "properties/result",
                    "contentType": "application/json",
                    "op": ["readproperty"]
                },
                {
                    "href": "properties/result/observe",
                    "contentType": "application/json",
                    "op": ["observeproperty", "unobserveproperty"],
                    "subprotocol": "sse"
                }
            ]
        },
        "lastChange": {
            "type": "string",
            "format": "date-time",
            "readOnly": True,
            "writeOnly": False,
            "observable": True,
            "forms": [
                {
                    "href": "properties/lastChange",
                    "contentType": "application/json",
                    "op": ["readproperty"]
                },
                {
                    "href": "properties/lastChange/observe",
                    "contentType": "application/json",
                    "op": ["observeproperty", "unobserveproperty"],
                    "subprotocol": "sse"
                }
            ]
        }
    },
    "actions": {
        "add": {
            "input": {
                "type": "number"
            },
            "output": {
                "type": "number"
            },
            "idempotent": False,
            "safe": False,
            "forms": [
                {
                    "href": "actions/add",
                    "contentType": "application/json",
                    "op": ["invokeaction"]
                }
            ]
        },
        "subtract": {
            "input": {
                "type": "number"
            },
            "output": {
                "type": "number"
            },
            "idempotent": False,
            "safe": False,
            "forms": [
                {
                    "href": "actions/subtract",
                    "contentType": "application/json",
                    "op": ["invokeaction"]
                }
            ]
        }
    },
    "events": {
        "update": {
            "data": {
                "type": "object"
            },
            "forms": [
                {
                    "href": "events/update",
                    "contentType": "application/json",
                    "op": ["subscribeevent", "unsubscribeevent"],
                    "subprotocol": "sse"
                }
            ]
        }
    }
}

# Define the base URL
base_url = td["base"]

# Define the action
action = "subtract"

# Define the form index
form_index = 0 if td["actions"][action]["forms"][0]["op"][0] == "invokeaction" else 1      

# Define the URL for the action
action_url = base_url + td["actions"][action]["forms"][form_index]["href"]

# Define the input for the action
input_data = {"input": 5}

# Invoke the action
response = requests.post(action_url, data=json.dumps(input_data))

# Print the response
print(response.json())
```