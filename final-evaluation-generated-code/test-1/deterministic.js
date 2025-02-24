import fetch from 'node-fetch';

const URL = "http://localhost:3000/http-express-calculator-simple/properties/result";

async function readpropertyResult() {
    try {
        const response = await fetch(URL, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Failed to readproperty result: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("result value:", result);

        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}

readpropertyResult();