Here is the protocol-specific code:
```
const modbus = require('modbus-serial');
const client = new modbus({
  port: '0.0.0.0',
  baudrate: 9600,
  parity: 'E',
  dataBit: 8,
  stopBit: 2,
});

const td = JSON.parse(`{"td":{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"@language":"en"}],"@type":"Thing","title":"modbus-elevator","description":"Elevator Thing","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":["nosec_sc"],"base":"modbus+tcp://0.0.0.0:8502/1","properties":{"lightSwitch":{"type":"boolean","readOnly":false,"writeOnly":false,"observable":false,"forms":[{"href":"?address=1&quantity=1","op":"readproperty","modv:entity":"Coil","modv:function":"readCoil","contentType":"application/octet-stream"},{"href":"?address=1&quantity=1","op":"writeproperty","modv:entity":"Coil","modv:function":"writeSingleCoil","contentType":"application/octet-stream"}]}}}`);

const affordance = td.affordance;
const property = td.properties[affordance];

if (!property) throw new Error(`Invalid affordance: ${affordance}`);

const form = property.forms.find((f) => f.op === 'readproperty');

if (!form) throw new Error(`Invalid operation: readproperty`);

const {
  href,
  modv: { function: modbusFunc, entity: modbusEntity, ...restParams },
} = form;

client.connect(() => {
  client.readCoil({
    ...restParams,
    address: parseInt(href.split('?')[1].split('&')[0].split('=')[1]),
  }, (err, value) => {
    if (err) throw err;
    console.log(`Read light switch value: ${value}`);
  });
});
```
Note that this code uses the `modbus-serial` library to create a Modbus client that connects to the specified Modbus TCP server. It then uses the Thing Description to extract the required information for the readoperation (light switch property). The code reads the coil value using the `readCoil` function and logs the result to the console.