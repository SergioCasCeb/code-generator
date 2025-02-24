```javascript
const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();

async function connect() {
    try {
        await client.connectTCP("0.0.0.0", { port: 8502 });
        client.setID(1);
        observeOnTheMove();
    } catch (error) {
        console.error("Failed to connect:", error);
    }
}

function observeOnTheMove() {
    setInterval(async () => {
        try {
            const data = await client.readDiscreteInputs(1, 1);
            console.log("On The Move:", data.data[0]);
        } catch (error) {
            console.error("Failed to read property:", error);
        }
    }, 1000);
}

connect();
```