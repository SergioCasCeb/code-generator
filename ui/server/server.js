const express = require('express');
const path = require('path');
const cors = require('cors');
const port = 5100

const app = express()

//Middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', express.static('./dist/'))


app.post('/api/generate', async (req, res) => {
    const { generatorInputs, isAI, aiTool } = req.body;

    try {
        const generator = await import('../../src/lib/code-generator.js');
        const generatedCode = await generator.generateCode(generatorInputs, isAI, aiTool);

        res.send(JSON.stringify(generatedCode));

    } catch (error) {
        console.log(error.message);

    }
});


app.listen(port, () => console.log(`Server started on port ${port}`))