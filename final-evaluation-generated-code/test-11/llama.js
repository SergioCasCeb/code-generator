```
const ModbusSerial = require('modbus-serial');
const modbusClient = new ModbusSerial();

const writeFloorNumber = async () => {
  const floors = await modbusClient.writeHoldingRegister(1, req.body.floorNumber);
  return { status: 'success', floors };
};

if (req.method === 'POST') {
  writeFloorNumber()
    .then((response) => res.json(response))
    .catch((error) => res.status(500).json({ error }));
}