const { detectProtocolSchemes } = require('@thingweb/td-utils');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

//TODO: Check if this code snippet is still necessary
// //Check if the code is running in the browser or in Node.js
// if (typeof window === 'undefined') {
//     //Utilize the url library to get the current file and directory paths
//     __filename = fileURLToPath(import.meta.url);
//     __dirname = path.dirname(__filename);
// }

/**
 * Get the affordance type based on the affordance name (property, action, event)
 * @param { Object } td 
 * @param { String } affordance 
 * @returns { String } affordanceType - the affordance type
 */
function getAffordanceType(td, affordance) {
    let affordanceType;
    for (const key in td) {
        if (td.hasOwnProperty(key)) {
            const value = td[key];

            if (typeof value === 'object' && value !== null) {
                if (affordance in value) {
                    affordanceType = key;
                }
            }
        }
    }

    if (affordanceType) {
        return affordanceType;
    }
    else {
        throw new Error(`The affordance ${affordance} was not found in the Thing Description`);
    }
}

/**
 * Parse the Thing Description and throw and error if it is invalid
 * @param { String } td 
 * @returns { Object } parsedTD
 */
function parseTD(td) {
    try {
        const parsedTD = JSON.parse(td);
        return parsedTD;
    } catch (error) {
        throw new Error("Invalid JSON format! Please enter a valid TD.");
    }
}

/**
 * Get the available affordances in a Thing Description
 * @param { Object } td 
 * @returns { Array } affordanceOptions
 */
function getTDAffordances(td) {
    const properties = td.properties ? Object.keys(td.properties) : [];
    const actions = td.actions ? Object.keys(td.actions) : [];
    const events = td.events ? Object.keys(td.events) : [];

    const affordanceOptions = [...properties, ...actions, ...events];

    if (affordanceOptions.length === 0) {
        throw new Error('No affordances found in the Thing Description!');
    } else {
        return affordanceOptions;
    }

}

/**
 * Get the available forms indexes based on the affordance type and affordance name
 * @param { Object } td 
 * @param { String } affordanceType 
 * @param { String } affordance 
 * @returns { Array } availableIndexes
 */
function getFormIndexes(td, affordanceType, affordance) {
    const availableForms = td[affordanceType][affordance].forms;

    if (availableForms && availableForms.length > 0) {
        const availableIndexes = Array.from(availableForms.keys());
        return availableIndexes;
    } else {
        throw new Error('No forms available for the selected affordance!');
    }
}

/**
 * Get the available operations based on the affordance type, affordance name and form index
 * @param { Object } td 
 * @param { String } affordanceType 
 * @param { String } affordance 
 * @param { Integer } formIndex 
 * @returns { Array } availableOperations
 */
function getOperations(td, affordanceType, affordance, formIndex) {

    const operationList = {
        properties: ['readproperty', 'writeproperty', 'observeproperty'],
        actions: ['invokeaction'],
        events: ['subscribeevent']
    }

    let availableOperations;

    if (formIndex === null || formIndex === undefined || formIndex === '') {
        availableOperations = [...operationList[affordanceType]]

    } else {
        const formOperations = td[affordanceType][affordance]['forms'][formIndex]['op'];

        if (formOperations === undefined) {
            availableOperations = [...operationList[affordanceType]]
        }
        else if (typeof formOperations === 'string') {
            availableOperations = [formOperations];
        } else if (typeof formOperations === 'object') {
            availableOperations = [...formOperations];
        } else {
            throw new Error('Invalid type! Operations can only be a string or an array!');
        }

    }

    //Remove the unobserveproperty and unsubscribeevent operations
    availableOperations = availableOperations.filter(item => item !== "unobserveproperty" && item !== "unsubscribeevent");

    return availableOperations;
}

/**
 * Gets the available protocols based on the templates-paths.json file
 * @param { string } file - the file with the available protocols
 * @returns { Array } availableProtocols
 */
function getAvailableProtocols(file) {
    try {
        let pathsFile;

        if (file) {
            pathsFile = file;

        } else {
            const filePath = path.resolve(__dirname, '../templates/templates-paths.json');
            pathsFile = fs.readFileSync(filePath, 'utf8');
        }

        const availableProtocols = Object.keys(JSON.parse(pathsFile));

        return availableProtocols;

    } catch (error) {
        throw new Error("Could not find the available protocols");
    }
}

/**
 * Get the protocol schemes in a TD, check if they are available in the templates and only return the available ones
 * @param { string } td 
 * @param { string } file - the file with the available protocols
 * @returns { Array } protocols
 */
function getTDProtocols(td, file) {

    const availableProtocols = getAvailableProtocols(file);
    const tdProtocols = Object.keys(detectProtocolSchemes(td));
    let protocols = [];

    //Check if the available protocols are in the TD
    availableProtocols.forEach(availableProtocol => {
        tdProtocols.forEach(tdProtocol => {
            if (tdProtocol.includes(availableProtocol)) {
                protocols.push(availableProtocol);
            }
        })
    })

    //Remove duplicates
    protocols = [...new Set(protocols)];

    if (protocols.length > 0) {
        return protocols;
    }
}


/**
 * Get the available languages based on the protocols
 * @param { Array } protocols 
 * @param { String } file - the file with the available languages
 * @returns { Array } availableLanguages
 */
function getAvailableLanguages(protocols, file) {
    try {
        let templatesFile;
        if (file) {
            templatesFile = file;
        } else {
            const filePath = path.resolve(__dirname, '../templates/templates-paths.json');
            templatesFile = fs.readFileSync(filePath, 'utf8');
        }

        const fileContent = JSON.parse(templatesFile);
        let availableLanguages = [];

        Object.entries(fileContent).forEach(([key, value]) => {
            protocols.forEach(protocol => {
                if (key === protocol) {
                    Object.entries(value).forEach(([language, libraries]) => {
                        availableLanguages.push({ [language]: Object.keys(libraries) });
                    });

                }
            });
        });

        availableLanguages = [...new Set(availableLanguages)];

        return availableLanguages;

    } catch (error) {
        throw new Error("No programming languages available for the specified protocols");
    }
}

/**
 * Get the available libraries based on the selected language and the available languages
 * @param { String } selectedLanguage 
 * @param { Array } languageList 
 * @returns { Array } availableLibraries
 */
function getAvailableLibraries(selectedLanguage, languageList) {
    let availableLibraries = [];

    languageList.forEach(language => {
        if (language[selectedLanguage]) {
            availableLibraries.push(...language[selectedLanguage]);
        }
    })

    availableLibraries = [...new Set(availableLibraries)];

    return availableLibraries;
}

//TODO: should the output file be in the project directory or in the current directory?
/**
 * Generate a file with the output code
 * @param { String } affordance 
 * @param { String } operation 
 * @param { String } programmingLanguage 
 * @param { String } outputCode 
 */
async function generateFile(affordance, operation, programmingLanguage, outputCode) {
    const folderName = 'generator-output';
    let fileName;

    if (programmingLanguage === 'python') {
        fileName = `${affordance}_${operation}.py`;
    }
    else if (programmingLanguage === 'javascript') {
        fileName = `${affordance}_${operation}.js`;
    } else {
        fileName = `${affordance}_${operation}_${programmingLanguage}.txt`;
    }

    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName); // Create the folder if it doesn't exist
    }

    const filePath = path.join(folderName, fileName);

    fs.writeFile(filePath, outputCode, (err) => {
        if (err) {
            throw new Error('An error occurred while writing the file!');
        } else {
            console.log(chalk.blue(`The file '${fileName}' was added to the '${folderName}' folder.`));
        }
    });
}

// Export the functions
module.exports = {
    getAffordanceType,
    parseTD,
    getTDAffordances,
    getFormIndexes,
    getOperations,
    //getAvailableProtocols,
    getTDProtocols,
    getAvailableLanguages,
    getAvailableLibraries,
    generateFile
}