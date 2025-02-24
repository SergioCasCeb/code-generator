const wot = require('@node-wot/core');
const http = require('@node-wot/binding-http');

let servient = new wot.Servient();
servient.addClientFactory(new http.HttpClientFactory());

servient.start().then((WoT) => {
    WoT.fetch("http://localhost:3000/http-express-calculator-simple/").then((td) => {      
        WoT.consume(td).then((thing) => {
            thing.subscribeEvent('update', (data) => {
                console.log('Update event received: ', data);
            }, (err) => {
                console.log('Failed to subscribe to event: ', err);
            }, () => {
                console.log('Completed subscription to update event');
            });

            // Unsubscribe after a certain period of time
            setTimeout(() => {
                thing.unsubscribeEvent('update');
                console.log('Unsubscribed from update event');
            }, 5000);
        });
    });
});