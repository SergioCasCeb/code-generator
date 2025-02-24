```javascript
const ModbusRTU = require("modbus-serial");

let client = new ModbusRTU();
client.connectTCP("0.0.0.0", { port: 8502 });

client.setID(1);

client.readCoils(1, 1)
    .then(function(data) {
        console.log("Light switch status: ", data.data[0]);
    })
    .catch(function(e) {
        console.error("Error: ", e.message);
    });
```