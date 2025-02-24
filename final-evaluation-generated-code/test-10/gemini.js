```javascript
const ModbusRTU = require("modbus-serial");

async function readLightSwitch() {
  const client = new ModbusRTU();
  client.connectTCP("0.0.0.0", { port: 8502 });

  try {
    const response = await client.readCoils(1, 1);
    console.log("Light Switch Status:", response.data[0] ? "ON" : "OFF");
  } catch (error) {
    console.error("Error reading light switch:", error);
  } finally {
    client.close();
  }
}


readLightSwitch();
```