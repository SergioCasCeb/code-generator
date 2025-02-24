Here is the generated code:
```
const url = 'http://localhost:3000/http-express-calculator-simple/actions/subtract';
const data = { input: 5 };

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(data => console.log(data.output))
  .catch(error => console.error('Error:', error));
```