const WoT = require("@node-wot/core");
const Http = require("@node-wot/binding-http");

let servient = new WoT.Servient();
servient.addClientFactory(new Http.HttpClientFactory());
servient.start().then((WoTHelpers) => {
    WoTHelpers.fetch("http://localhost:3000/http-express-calculator-simple/").then(async (td) => {
        let myThing = WoTHelpers.consume(td);
        let result = await myThing.readProperty('result');
        console.log('Result: ', result);
    }).catch((err) => {
        console.error('Fetch TD failed: ', err);
    });
}).catch((err) => {
    console.error('Servient start failed: ', err);
});