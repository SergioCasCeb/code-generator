Here is the generated protocol-specific code in JavaScript using the node-wot library:
```
const wot = require('node-wot');
const wotClient = new wot.Client();

const td = JSON.parse(`{"td": ...```);

wotClient ThingDescription(td);

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', async () => {
  const input = parseInt(document.getElementById('input').value);
  const result = await wotClient.invokeAction('subtract', { input });
  document.getElementById('result').value = result.output;
});

wotClient.observeProperty('result').then((result) => {
  document.getElementById('result').value = result;
}).catch((err) => {
  console.error(err);
});

wotClient.subscribeEvent('update').then((event) => {
  console.log(event);
}).catch((err) => {
  console.error(err);
});
```