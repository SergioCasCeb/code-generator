```javascript
const WoT = require('node-wot');

async function main() {
  const wot = new WoT();
  const thing = await wot.consume('http://localhost:3000/http-express-calculator-simple/');

  try {
    const input = {
      "type": "number",
      "value": 10
    };
    const result = await thing.invokeAction('subtract', input);
    console.log('Result:', result);
  } catch (err) {
    console.error('Error invoking action:', err);
  } finally {
    await wot.destroy();
  }
}

main();
```