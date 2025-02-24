```javascript
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

// connect to modbus
client.connectTCP("0.0.0.0", { port: 8502 })
    .then(() => {
        console.log("Connected to Modbus server");
        client.setID(1);
    })
    .catch((e) => {
        console.log("Failed to connect to Modbus server: ", e);
    });

// function to write floor number
function writeFloorNumber(value) {
    client.writeRegister(1, value)
        .then((data) => {
            console.log("Floor number written successfully: ", data.data);
        })
        .catch((e) => {
            console.log("Failed to write floor number: ", e);
        });
}

// use the function
writeFloorNumber(2);
```