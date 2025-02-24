```javascript
const ModbusRTU = require("modbus-serial");

async function observeOnTheMove() {
  const client = new ModbusRTU();
  client.connectTCP("0.0.0.0", { port: 8502 });

  let observationInterval;

  async function readOnTheMove() {
    try {
      const result = await client.readDiscreteInputs(1, 1);
      console.log("onTheMove:", result.data[0] === 1); // Assuming 1 represents true
    } catch (error) {
      console.error("Error reading onTheMove:", error);
      clearInterval(observationInterval);
      client.close();
    }
  }

  observationInterval = setInterval(readOnTheMove,1000);

  process.on('SIGINT', () => {
    clearInterval(observationInterval);
    client.close();
    console.log('Observation stopped and client closed.');
    process.exit();
  })
}


observeOnTheMove();

```