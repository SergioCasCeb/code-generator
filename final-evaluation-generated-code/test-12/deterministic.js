const ModbusRTU = require("modbus-serial")

const client = new ModbusRTU();

async function observepropertyOnthemove() {
    try {
        await client.connectTCP("0.0.0.0", { port: 8502 });

        client.setID(1);

        const address = 1;

        // read values every 1000 ms
        const intervalId = setInterval(async () => {
            try {
                const res = await client.readDiscreteInputs(address, 1);
                console.log("onTheMove value: ", res.data[0]);
            } catch (err) {
                console.error("Failed to observeproperty onTheMove", err);
            }
        }, 1000);

        // Stop observing after 10 seconds
        setTimeout(() => {
            clearInterval(intervalId);
            console.log("Stopped observing onTheMove.");
            client.close();
        }, 10000);

    } catch (err) {
        console.error("Failed to observeproperty onTheMove", err);
        client.close();
    }
}

observepropertyOnthemove();