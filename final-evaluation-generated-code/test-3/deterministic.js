import { EventSource } from 'eventsource';

const URL = "http://localhost:3000/http-express-calculator-simple/events/update";

function subscribeeventUpdate() {
    const eventSource = new EventSource(URL);

    eventSource.onopen = () => {
        console.log("Connected Successfully");
    };

    eventSource.onmessage = (e) => {
        try {
            console.log("update: ", JSON.parse(e.data));
        } catch (error) {
            console.error('Error with update:', error);
        }
    };

    eventSource.onerror = (error) => {
        console.error('Error with update:', error);
    };

    return {
        unsubscribe: () => {
            eventSource.close();
        }
    };
}

const event = subscribeeventUpdate();

//Disconnect after 10 seconds
setTimeout(() => {
    event.unsubscribe();
    console.log("Disconnected");
}, 10000);