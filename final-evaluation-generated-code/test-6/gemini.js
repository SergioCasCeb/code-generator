```javascript
const WoT = require('node-wot');

async function setup() {
  const wot = new WoT.WoT();
  const thing = await wot.consume('http://localhost:3000/http-express-calculator-simple/');

  const eventSubscription = await thing.subscribe({
    event: 'update',
    handler: (data) => {
      console.log('Received update event:', data);
    }
  });

  //Keep the subscription active for a period of time, then unsubscribe.  Replace with your preferred method for managing the subscription lifecycle.
  setTimeout(async () => {
    await eventSubscription.unsubscribe();
    console.log('Unsubscribed from update event.');
    process.exit();
  }, 60000);

}

setup();
```