import { generateCode, getProtocol } from "./code-generator.js";

const inputsHTTP = {
    "td": {
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
            "basic_sc": {
                "scheme": "basic"
            },
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
                        "contentType": "application/json"
                    },
                    {
                        "href": "properties/result",
                        "contentType": "application/json",
                        "op": "writeproperty"
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
                    },
                    {
                        "href": "events/update",
                        "contentType": "application/json",
                        "op": [
                            "subscribeevent",
                            "unsubscribeevent"
                        ],
                        "subprotocol": "longpoll"
                    }
                ]
            }
        }
    },
    "affordance": "result",
    "operation": "readproperty",
    "formIndex": 0,
    "programmingLanguage": "javascript",
    "library": "fetch"
}

const inputsModbus = {
    "td": {
        "@context": [
            "https://www.w3.org/2019/wot/td/v1",
            "https://www.w3.org/2022/wot/td/v1.1",
            {
                "@language": "en"
            }
        ],
        "@type": "Thing",
        "title": "modbus-elevator",
        "description": "Elevator Thing",
        "securityDefinitions": {
            "nosec_sc": {
                "scheme": "nosec"
            }
        },
        "security": [
            "nosec_sc"
        ],
        "base": "modbus+tcp://0.0.0.0:8502/1",
        "properties": {
            "lightSwitch": {
                "type": "boolean",
                "readOnly": false,
                "writeOnly": false,
                "observable": false,
                "forms": [
                    {
                        "href": "?address=1&quantity=1",
                        "op": "readproperty",
                        "modbus:entity": "Coil",
                        "modbus:function": "readCoil",
                        "contentType": "application/octet-stream"
                    },
                    {
                        "href": "?address=1&quantity=1",
                        "op": "writeproperty",
                        "modbus:entity": "Coil",
                        "modbus:function": "writeSingleCoil",
                        "contentType": "application/octet-stream"
                    }
                ]
            },
            "onTheMove": {
                "type": "boolean",
                "readOnly": true,
                "writeOnly": false,
                "observable": true,
                "forms": [
                    {
                        "href": "?address=1&quantity=1",
                        "op": [
                            "readproperty",
                            "observeproperty"
                        ],
                        "modbus:entity": "DiscreteInput",
                        "modbus:function": "readDiscreteInput",
                        "modbus:pollingTime": 1000,
                        "contentType": "application/octet-stream"
                    }
                ]
            },
            "floorNumber": {
                "type": "integer",
                "minimum": 0,
                "maximum": 15,
                "readOnly": false,
                "writeOnly": false,
                "observable": false,
                "forms": [
                    {
                        "href": "?address=1&quantity=1",
                        "op": "readproperty",
                        "modbus:entity": "HoldingRegister",
                        "modbus:function": "readHoldingRegisters",
                        "contentType": "application/octet-stream"
                    },
                    {
                        "href": "?address=1&quantity=1",
                        "op": "writeproperty",
                        "modbus:entity": "HoldingRegister",
                        "modbus:function": "writeSingleHoldingRegister",
                        "contentType": "application/octet-stream"
                    }
                ]
            }
        }
    },
    "affordance": "floorNumber",
    // "formIndex": 0,
    "operation": "readproperty",
    "programmingLanguage": "javascript",
    "library": "modbus-serial"
}

const inputBacnet = {
    "td": {
        "@context": [
            "https://www.w3.org/2022/wot/td/v1.1",
            {
                "bacv": "https://example.org/bacnet"
            }
        ],
        "id": "urn:uuid:0804d572-cce8-422a-bb7c-4412fcd56f06",
        "@type": "Thing",
        "title": "Bacnet thing",
        "description": "SThis is a test backnet td",
        "securityDefinitions": {
            "basic_sc": {
                "scheme": "basic",
                "in": "header"
            }
        },
        "security": "basic_sc",
        "properties": {
            "analog1": {
                "type": "number",
                "readOnly": true,
                "uriVariables": {
                    "observeIncrement": {
                        "@type": "bacv:covIncrement",
                        "type": "number",
                        "minimum": 0
                    }
                },
                "forms": [
                    {
                        "op": [
                            "observeproperty"
                        ],
                        "href": "bacnet://5/0,1/85?covIncrement={observeIncrement}",
                        "contentType": "application/octet-stream",
                        "bacv:usesService": "SubscribeCOV",
                        "bacv:hasDataType": {
                            "@type": "bacv:Real"
                        }
                    }
                ]
            }
        }
    },
    "affordance": "result",
    "operation": "readproperty",
    "formIndex": 0,
    "programmingLanguage": "javascript",
    "library": "fetch"
}


const output = await generateCode(inputsHTTP);

console.log(output);







