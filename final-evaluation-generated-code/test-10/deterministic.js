const ModbusRTU = require("modbus-serial")

const client = new ModbusRTU();

async function readpropertyLightswitch() {
    try {
        await client.connectTCP("0.0.0.0", { port: 8502 });

        client.setID(1);

        const address = 1;

        const res = await client.readCoils(address, 1);
        console.log("lightSwitch value: ", res.data[0]);
        return res.data[0];

    } catch (err) {
        console.error("Failed to readproperty lightSwitch", err);
        client.close();
    }
}

readpropertyLightswitch();