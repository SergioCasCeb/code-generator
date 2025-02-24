```python
import requests
import json
import sseclient

# SSE connection details
url = "http://localhost:3000/http-express-calculator-simple/events/update"
headers = {'Accept': 'text/event-stream'}

# Establish the SSE connection
response = requests.get(url, headers=headers, stream=True)
client = sseclient.SSEClient(response)

# Subscribe to events
for event in client.events():
    if event.event == 'message':
        print(f"Received event: {event.data}")
    elif event.event == "error":
        print(f"Error received: {event.data}")
        break

# Unsubscribe (Close the connection)
response.close()

```