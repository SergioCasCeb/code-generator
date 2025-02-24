```javascript
const ModbusRTU = require("modbus-serial");

async function writeFloorNumber(floor) {
  const client = new ModbusRTU();
  client.connectTCP("0.0.0.0", { port: 8502 });

  try {
    const response = await client.writeSingleHoldingRegister(1, floor);
    console.log("Write response:", response);
  } catch (error) {
    console.error("Write error:", error);
  } finally {
    client.close();
  }
}


writeFloorNumber(5); //Example
```