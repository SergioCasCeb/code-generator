```javascript
const WoT = require('node-wot');

async function readProperty() {
  try {
    const wot = await WoT.discover();
    const thing = await wot.consume('http://localhost:3000/http-express-calculator-simple/');

    const result = await thing.readProperty('result');
    console.log('Result:', result);

  } catch (error) {
    console.error('Error reading property:', error);
  }
}


readProperty();
```