```javascript
const fetch = require('node-fetch');

const base_url = 'http://localhost:3000/http-express-calculator-simple/';
const property_url = `${base_url}properties/result`;

fetch(property_url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```