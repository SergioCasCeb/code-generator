```javascript
async function invokeSubtract(value) {
  const url = 'http://localhost:3000/http-express-calculator-simple/actions/subtract';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: value })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.output;
  } catch (error) {
    console.error('Error invoking subtract action:', error);
    throw error;
  }
}


```