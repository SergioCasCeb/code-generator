Here is the generated JavaScript code using the Node-WOT library:
```
const { Client } = require('node-wot');
const client = new Client();

const td = JSON.parse(`{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"@language":"en"}],"@type":"Thing","title":"http-express-calculator-simple","description":"Calculator Thing","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":["nosec_sc"],"base":"http://localhost:3000/http-express-calculator-simple/","properties":{"result":{"type":"number","readOnly":true,"writeOnly":false,"observable":true,"forms":[{"href":"properties/result","contentType":"application/json","op":["readproperty"]},{"href":"properties/result/observe","contentType":"application/json","op":["observeproperty","unobserveproperty"],"subprotocol":"sse"}]},"lastChange":{"type":"string","format":"date-time","readOnly":true,"writeOnly":false,"observable":true,"forms":[{"href":"properties/lastChange","contentType":"application/json","op":["readproperty"]},{"href":"properties/lastChange/observe","contentType":"application/json","op":["observeproperty","unobserveproperty"],"subprotocol":"sse"}]}},"actions":{"add":{"input":{"type":"number"},"output":{"type":"number"},"idempotent":false,"safe":false,"forms":[{"href":"actions/add","contentType":"application/json","op":["invokeaction"]}]},"subtract":{"input":{"type":"number"},"output":{"type":"number"},"idempotent":false,"safe":false,"forms":[{"href":"actions/subtract","contentType":"application/json","op":["invokeaction"]}]}},"events":{"update":{"data":{"type":"object"},"forms":[{"href":"events/update","contentType":"application/json","op":["subscribeevent","unsubscribeevent"],"subprotocol":"sse"}]}}},"affordance":"result","formIndex":null,"operation":"readproperty","programmingLanguage":"javascript","library":"node-wot"}`);

client.connect()
  .then(() => {
    client
      .readProperty(td, 'properties', 'result')
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });
```
Note that this code assumes that the Node-WOT library is installed and available.