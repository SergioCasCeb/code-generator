import { detectProtocolSchemes } from '@thingweb/td-utils'
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from "path";
import chalk from "chalk";

//Utilize the url library to get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the affordance type based on the affordance name (property, action, event)
 * @param { Object } td 
 * @param { String } affordance 
 * @returns { String } affordanceType - the affordance type
 */
export function getAffordanceType(td, affordance) {
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
 * Gets the available protocols based on the templates-paths.json file
 * @returns { Array } availableProtocols
 */
function getAvailableProtocols() {
    try {
        const filePath = path.resolve(__dirname, '../templates/templates-paths.json');
        
        const templatesPaths = fs.readFileSync(filePath, 'utf8');
        const availableProtocols = Object.keys(JSON.parse(templatesPaths));

        return availableProtocols;

    } catch (error) {
        throw new Error("Could not find the available protocols");
    }
}

/**
 * Get the protocol schemes in a TD, check if they are available in the templates and only return the available ones
 * @param { string } td 
 * @returns { Array } protocols
 */
export function getTDProtocols(td) {
    const availableProtocols = getAvailableProtocols();
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
 * @returns { Array } availableLanguages
 */
export function getAvailableLanguages(protocols) {

    try {
        const filePath = path.resolve(__dirname, '../templates/templates-paths.json');
        const templatesFile = fs.readFileSync(filePath, 'utf8');
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
export function getAvailableLibraries(selectedLanguage, languageList) {
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
export async function generateFile(affordance, operation, programmingLanguage, outputCode) {

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
        }else {
            console.log(chalk.blue(`The file '${fileName}' was added to the '${folderName}' folder.`));
        }
    });
}