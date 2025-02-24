```javascript
async function readResult() {
  const response = await fetch('http://localhost:3000/http-express-calculator-simple/properties/result', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

readResult().then(data => console.log(data)).catch(error => console.error(error));

```