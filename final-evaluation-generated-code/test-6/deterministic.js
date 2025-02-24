const { Servient } = require("@node-wot/core");
const { HttpClientFactory } = require("@node-wot/binding-http");

const servient = new Servient();
servient.addClientFactory(new HttpClientFactory(null));

servient.start().then(async (WoT) => {

    //Utilize the link to your Thing Description or enter your Thing Description directly  
    const td = await WoT.requestThingDescription(/*Thing Description here*/);
    let thing = await WoT.consume(td);

    // Subscribing to an event
    thing.subscribeEvent("update", async (data) => {
        console.log("Event data:", await data.value());
    });

}).catch((err) => { console.error(err); });