```javascript
async function subscribeToUpdateEvent() {
  const url = 'http://localhost:3000/http-express-calculator-simple/events/update';
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received update event:', data);
  };

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
    eventSource.close();
  };

  return () => {
    eventSource.close();
    console.log('Unsubscribed from update event');
  }
}


async function main() {
  const unsubscribe = await subscribeToUpdateEvent();
  // ... your code to process events ...
  setTimeout(() => unsubscribe(), 10000); // Unsubscribe after 10 seconds

}

main();
```