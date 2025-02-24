```python
import requests
import json

# Base URL of the Thing
base_url = "http://localhost:3000/http-express-calculator-simple/"

# Endpoint for the 'update' event
event_url = base_url + "events/update"

# Headers for the request
headers = {
    'Accept': 'text/event-stream',
    'Content-Type': 'application/json'
}

# Create a persistent connection (stream)
response = requests.get(event_url, headers=headers, stream=True)

# Function to handle the received event data
def handle_event(event_data):
    # Parse the JSON data
    parsed_data = json.loads(event_data)

    # Print the received data
    print(parsed_data)

# Loop over the lines in the response stream
for line in response.iter_lines():
    # Filter out keep-alive lines
    if line:
        decoded_line = line.decode('utf-8')

        # Call the event handler with the event data
        handle_event(decoded_line)
```