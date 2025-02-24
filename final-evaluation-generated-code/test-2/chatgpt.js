```javascript
const fetch = require('node-fetch');

let invokeAction = async () => {
    let response = await fetch('http://localhost:3000/http-express-calculator-simple/actions/subtract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input: 5
        })
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
    } else {
        console.error(`Error: ${response.status}`);
    }
}

invokeAction();
```