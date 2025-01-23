/**
 * All Modbus protocol specific helper functions are defined in this file.
 */
import URLToolkit from 'url-toolkit';

/**
 * get the IP from the URL
 * @param { String } URL 
 * @returns { String } - IP address
 */
export function getIP(URL) {
    const urlComponents = URLToolkit.parseURL(URL);
    const ipMatch = urlComponents["netLoc"].match(/\/\/([\d.]+):/);

    if(ipMatch) {
        return ipMatch[1];
    }else {
        throw new Error("IP was not found in the URL");
    }
}

/**
 * Get the Port from the URL
 * @param { String } URL 
 * @returns { String } - Port number
 */
export function getPort(URL) {
    const urlComponents = URLToolkit.parseURL(URL);
    const portMatch = urlComponents["netLoc"].match(/:(\d+)$/);
    
    if(portMatch) {
        return portMatch[1];
    }else {
        throw new Error("Port was not found in the URL");
    }
}

/**
 * Get the UnitID from the URL
 * @param { String } URL 
 * @returns { String } unitID - the unitID specified in the URL
 */
export function getUnitID(URL) {
    const urlComponents = URLToolkit.parseURL(URL);
    const unitID = urlComponents["path"].replace("/", "");

    if(unitID) {
        return unitID;
    }
    else {
        throw new Error("UnitID was not found in the URL");
    }  
}

/**
 * Get the Address from the URL parameters
 * @param { String } URL 
 * @returns { String } address - the address specified in the parameters
 */
export function getAddress(URL) {
    const urlComponents = URLToolkit.parseURL(URL);
    const params = new URLSearchParams(urlComponents["query"]);

    const address = params.get('address');

    if(address) {
        return address;
    }
    else {
        throw new Error("Address was not specified in the URL");
    }
}

/**
 * Get the quantity/length from the URL parameters
 * @param { String } URL 
 * @returns { String } quantity - the quantity specified in the parameters
 */
export function getQuantity(URL) {
    const urlComponents = URLToolkit.parseURL(URL);
    const params = new URLSearchParams(urlComponents["query"]);

    const quantity = params.get('quantity');

    if(quantity) {
        return quantity;
    }
    else {
        throw new Error("Quantity was not specified in the URL");
    }
}

/**
 * Get the modbus polling time specified in the form
 * @param { Object } form 
 * @returns { String } pollingTime - the polling time specified in the form
 */
export function getPollingTime(form) {
    const pollingTime = form["modbus:pollingTime"];

    return pollingTime ? pollingTime : '500';
}

/**
 * Get the modbus function specified in the form, if not specified set a default one depending on the operation
 * @param { Object } form 
 * @param { String } operation 
 * @returns { String } modbusFunction - the modbus function to be used
 */
export function getModbusFunction(form, operation) {

    let modbusFunction;

    const modbusSerialFunctions = {
        readCoil: 'readCoils',
        readDiscreteInput: 'readDiscreteInputs',
        readHoldingRegisters: 'readHoldingRegisters',
        readInputRegisters: 'readInputRegisters',
        writeSingleCoil: 'writeCoil',
        writeSingleHoldingRegister: 'writeRegister',
        writeMultipleCoils: 'writeCoils',
        writeMultipleHoldingRegisters: 'writeRegisters'
    }

    if(form["modbus:function"]) {
        modbusFunction = modbusSerialFunctions[form["modbus:function"]];
    }
    else {
        if(operation === 'readproperty') {
            modbusFunction = 'readDiscreteInputs';
        }
        else if(operation === 'writeproperty' || operation === 'invokeaction') {
            modbusFunction = 'writeCoil';
        }
        else if(operation === 'observeproperty' || operation === 'unobserveproperty') {
            modbusFunction = 'readCoils';
        }
        else {
            throw new Error("Operation not supported");
        }
    }
    
    if(modbusFunction) {
        return modbusFunction;
    }else {
        throw new Error("Not found/Wrong Modbus function specified in the TD");
    }
}
