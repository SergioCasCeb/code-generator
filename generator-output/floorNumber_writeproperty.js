const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();

const payload = 8;

async function writepropertyFloornumber(inputValue) {
    try {
        await client.connectTCP("0.0.0.0", { port: 8502 });

        client.setID(1);

        const address = 1;
        
        const res = await client.writeRegister(address, inputValue);
        console.log("floorNumber value: ", res.data["value"]);
        client.close();

    } catch (err) {
        console.error("Failed to writeproperty floorNumber", err);
        client.close();
    }
}

writepropertyFloornumber(payload);
