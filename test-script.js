const { generateCode } = require('./src/lib/code-generator.js');

const mainInputs =  {
    td: {
        "@context": [
            "https://www.w3.org/2019/wot/td/v1",
            "https://www.w3.org/2022/wot/td/v1.1",
            {
                "@language": "en"
            }
        ],
        "@type": "Thing",
        "title": "http-express-calculator-simple",
        "description": "Calculator Thing",
        "securityDefinitions": {
            "nosec_sc": {
                "scheme": "nosec"
            }
        },
        "security": [
            "nosec_sc"
        ],
        "base": "http://localhost:3000/http-express-calculator-simple/",
        "properties": {
            "result": {
                "type": "number",
                "readOnly": true,
                "writeOnly": false,
                "observable": true,
                "forms": [
                    {
                        "href": "properties/result",
                        "contentType": "application/json",
                        "op": [
                            "readproperty"
                        ]
                    },
                    {
                        "href": "properties/result/observe",
                        "contentType": "application/json",
                        "op": [
                            "observeproperty",
                            "unobserveproperty"
                        ],
                        "subprotocol": "sse"
                    }
                ]
            },
            "lastChange": {
                "type": "string",
                "format": "date-time",
                "readOnly": true,
                "writeOnly": false,
                "observable": true,
                "forms": [
                    {
                        "href": "properties/lastChange",
                        "contentType": "application/json",
                        "op": [
                            "readproperty"
                        ]
                    },
                    {
                        "href": "properties/lastChange/observe",
                        "contentType": "application/json",
                        "op": [
                            "observeproperty",
                            "unobserveproperty"
                        ],
                        "subprotocol": "sse"
                    }
                ]
            }
        },
        "actions": {
            "add": {
                "input": {
                    "type": "number"
                },
                "output": {
                    "type": "number"
                },
                "idempotent": false,
                "safe": false,
                "forms": [
                    {
                        "href": "actions/add",
                        "contentType": "application/json",
                        "op": [
                            "invokeaction"
                        ]
                    }
                ]
            },
            "subtract": {
                "input": {
                    "type": "number"
                },
                "output": {
                    "type": "number"
                },
                "idempotent": false,
                "safe": false,
                "forms": [
                    {
                        "href": "actions/subtract",
                        "contentType": "application/json",
                        "op": [
                            "invokeaction"
                        ]
                    }
                ]
            }
        },
        "events": {
            "update": {
                "data": {
                    "type": "object"
                },
                "forms": [
                    {
                        "href": "events/update",
                        "contentType": "application/json",
                        "op": [
                            "subscribeevent",
                            "unsubscribeevent"
                        ],
                        "subprotocol": "sse"
                    }
                ]
            }
        }
    },
    affordance: "result",
    formIndex: null,
    operation: "readproperty",
    programmingLanguage: "javascript",
    library: "fetch"
}

async function main() {
    // const output = await generateCode(mainInputs, true, "llama");
    const output = await generateCode(mainInputs);
    console.log(output);
    
}

main();
