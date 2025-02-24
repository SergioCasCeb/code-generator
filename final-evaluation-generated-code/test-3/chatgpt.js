
```javascript
const fetch = require('node-fetch');
const EventSource = require('eventsource');

const td = { /* Thing Description */ };

const baseURL = td.base;
const eventForm = td.events.update.forms[0];

const eventURL = `${baseURL}${eventForm.href}`;

const eventSource = new EventSource(eventURL);

eventSource.onmessage = function(event) {
    console.log('Update event received:', event.data);
};

// To unsubscribe
eventSource.close();
```