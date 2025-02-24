import fetch from 'node-fetch';

const URL = "http://localhost:3000/http-express-calculator-simple/actions/subtract";

const bodyInput = 64342111.59;

async function invokeactionSubtract(inputValue) {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputValue),
        });

        if (!response.ok) {
            throw new Error(`Failed to invokeaction subtract: ${response.status} ${response.statusText}`);
        }

        const subtract = await response.json();
        console.log("subtract value:", subtract);

        return subtract;
    } catch (error) {
        console.error("Error:", error);
    }
}

invokeactionSubtract(bodyInput);