```
import requests

td = {
    "@context": ["https://www.w3.org/2019/wot/td/v1", "https://www.w3.org/2022/wot/td/v1.1", {"@language": "en"}],
    "td": {
        "@type": "Thing",
        "title": "http-express-calculator-simple",
        "description": "Calculator Thing",
        "securityDefinitions": {"nosec_sc": {"scheme": "nosec"}},
        "security": ["nosec_sc"],
        "base": "http://localhost:3000/http-express-calculator-simple/",
        "properties": {
            "result": {
                "type": "number",
                "readOnly": True,
                "writeOnly": False,
                "observable": True,
                "forms": [
                    {"href": "properties/result", "contentType": "application/json", "op": ["readproperty"]},
                    {
                        "href": "properties/result/observe",
                        "contentType": "application/json",
                        "op": ["observeproperty", "unobserveproperty"],
                        "subprotocol": "sse",
                    },
                ],
            },
            "lastChange": {
                "type": "string",
                "format": "date-time",
                "readOnly": True,
                "writeOnly": False,
                "observable": True,
                "forms": [
                    {"href": "properties/lastChange", "contentType": "application/json", "op": ["readproperty"]},
                    {
                        "href": "properties/lastChange/observe",
                        "contentType": "application/json",
                        "op": ["observeproperty", "unobserveproperty"],
                        "subprotocol": "sse",
                    },
                ],
            },
        },
        "actions": {
            "add": {
                "input": {"type": "number"},
                "output": {"type": "number"},
                "idempotent": False,
                "safe": False,
                "forms": [
                    {"href": "actions/add", "contentType": "application/json", "op": ["invokeaction"]}
                ],
            },
            "subtract": {
                "input": {"type": "number"},
                "output": {"type": "number"},
                "idempotent": False,
                "safe": False,
                "forms": [
                    {"href": "actions/subtract", "contentType": "application/json", "op": ["invokeaction"]}
                ],
            },
        },
        "events": {
            "update": {
                "data": {"type": "object"},
                "forms": [
                    {
                        "href": "events/update",
                        "contentType": "application/json",
                        "op": ["subscribeevent", "unsubscribeevent"],
                        "subprotocol": "sse",
                    }
                ],
            }
        }
    }
}

affordance = "result"
form_index = None
operation = "readproperty"

headers = {"Content-Type": "application/json"}
url = td["td"]["base"] + "properties/" + affordance

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Failed to read property {affordance}: {response.text}")
```