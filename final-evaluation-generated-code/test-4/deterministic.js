const { Servient } = require("@node-wot/core");
const { HttpClientFactory } = require("@node-wot/binding-http");

const servient = new Servient();
servient.addClientFactory(new HttpClientFactory(null));

servient.start().then(async (WoT) => {

    //Utilize the link to your Thing Description or enter your Thing Description directly  
    const td = await WoT.requestThingDescription(/*Thing Description here*/);
    let thing = await WoT.consume(td);

    // Reading a property
    let result = await (await thing.readProperty("result")).value();
    console.log("result value:", result);

}).catch((err) => { console.error(err); });