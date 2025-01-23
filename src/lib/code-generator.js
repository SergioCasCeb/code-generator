import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as helpers from '../helpers/utilHelpers.js';
import * as httpHelpers from '../helpers/protocols/httpHelpers.js';
import * as modbusHelpers from '../helpers/protocols/modbusHelpers.js';
import URLToolkit from 'url-toolkit';
import { addDefaults } from '@thing-description-playground/defaults';
import { tdValidator } from '@thing-description-playground/core';
import { detectProtocolSchemes } from '@thingweb/td-utils'
import { generateChatGPTCode } from '../ai-generators/chatgpt-generator.js';
import { generateGeminiCode } from '../ai-generators/gemini-generator.js';
import { generateLlamaCode } from '../ai-generators/llama-generator.js';


//Register all helpers
const handlebarsHelpers = [helpers, httpHelpers, modbusHelpers];

handlebarsHelpers.forEach(module => {
    for (const key in module) {
        Handlebars.registerHelper(key, module[key]);
    }
})

//Utilize the url library to get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**************************************/
/*********** Main generator ***********/
/**************************************/

/**
 * Main function to generate code based on the user inputs. It also defines whether to generate code using an AI tool or not.
 * @param { Object } userInputs - the full object with all the required user inputs
 * @param { Boolean } generateAI - whether to generate code using an AI tool or not
 * @param { string } aiTool - the AI tool to use for code generation
 * @returns { String } - the generated code
 */
export async function generateCode(userInputs, generateAI = false, aiTool) {

    //Basic input validation check
    //TODO: Add individual validation checks for easier debugging
    if (!userInputs || (!userInputs.programmingLanguage || !userInputs.library || !userInputs.td || !userInputs.affordance || !userInputs.operation)) {
        throw new Error("Invalid or missing inputs");
    }

    if (generateAI) {
        if(!aiTool) {
            throw new Error("For the AI generation, an AI tool must be specified");
        }

        if (aiTool === "chatgpt") {
            return generateChatGPTCode(JSON.stringify(userInputs));
        }
        else if (aiTool === "gemini") {
            return generateGeminiCode(JSON.stringify(userInputs));
        }
        else if (aiTool === "llama") {
            return generateLlamaCode(JSON.stringify(userInputs));
        }
        else {
            throw new Error("The specified AI tool is not supported");
        }

    } else {
        const template = getTemplate(userInputs.programmingLanguage, userInputs.library);
        const templateInputs = await getTemplateInputs(userInputs.td, userInputs.affordance, userInputs.operation, userInputs.formIndex);

        // Compile the template with the filtered inputs
        const compiledTemplate = Handlebars.compile(template);

        return compiledTemplate(templateInputs);
    }
}


/*******************************/
/******* Main functions ********/
/*******************************/

/**
 * Get the specific template path based on the language and library, and return the file content
 * @param { String } language 
 * @param { String } library 
 * @returns { String } file - the content of the template file
 */
function getTemplate(language, library) {
    language = language.toLowerCase();
    library = library.toLowerCase();

    const templateName = `${language}-${library}`;

    let templatesDirectory = {
        "javascript-fetch": path.resolve(__dirname, '../templates', 'javascript', 'fetch', 'template.hbs'),
        "javascript-node-wot": path.resolve(__dirname, '../templates', 'javascript', 'node-wot', 'template.hbs'),
        "javascript-modbus-serial": path.resolve(__dirname, '../templates', 'javascript', 'modbus-serial', 'template.hbs'),
        "python-requests": path.resolve(__dirname, '../templates', 'python', 'requests', 'template.hbs'),
    }

    //Check if template directory exists
    if (!templatesDirectory[templateName]) {
        throw new Error("Template not found");
    }

    const file = fs.readFileSync(templatesDirectory[templateName], 'utf8');

    //check if file is empty
    if (!file) {
        throw new Error("Template is empty");
    }

    return file;
}

/**
 * Get the required data to work as the inputs for the the code templates
 * @param { Object } td 
 * @param { string } affordance 
 * @param { string } operation 
 * @param { integer } formIndex 
 * @returns { Object } templateValues
 */
async function getTemplateInputs(td, affordance, operation, formIndex) {

    let templateValues = {
        "absoluteURL": null,
        "affordanceType": null,
        "affordance": affordance,
        "affordanceObject": null,
        "form": null,
        "operation": null,
    }

    //add defaults to the td, to assure that all forms have an operation and contentType

    const isValid = await validateTD(td);

    if (isValid) {
        //Check the operation and formIndex to get the inner values of the affordance
        const affordanceType = getAffordanceType(td, affordance);
        templateValues.affordanceType = affordanceType;

        const forms = td[affordanceType][affordance]["forms"];
        const form = getForm(forms, operation, formIndex);

        templateValues.affordanceObject = td[affordanceType][affordance];
        templateValues.form = form;

        //treat the unsubscribe and unobserve operations as subscribe and observe
        if (operation === "unsubscribeevent" || operation === "unobserveproperty") {
            operation = operation.replace("un", "");
        }
        templateValues.operation = operation;

        const absoluteURL = getAbsoluteURL(td.base, form["href"]);
        templateValues.absoluteURL = absoluteURL;

        return templateValues;
    }
}

/**
 * Add defaults and validate the TD
 * @param { Object } td 
 * @returns { Boolean }
 */
async function validateTD(td) {
    //add defaults to the td, to assure that all forms have an operation and contentType
    addDefaults(td);

    // Store log messages, to show only if the validation fails
    let logMessages = [];

    // Push log messages to the logMessages array
    function validationLog(msg) {
        logMessages.push(msg);
    }

    //run the tdValidator function
    const validation = await tdValidator(JSON.stringify(td), validationLog, { checkDefaults: true, checkJsonLd: true, checkTmConformance: false });

    //check al the report values to see if the validation passed
    const validTD = Object.values(validation.report).every(value => value !== 'failed');

    if (validTD) {
        return true;
    } else {
        const errorMsg = logMessages.join('\n');
        throw new Error(errorMsg);
    }
}

/*******************************/
/****** Utility functions *******/
/*******************************/

/**
 * Get the affordance type based on the affordance name (property, action, event)
 * @param { Object } td 
 * @param { String } affordance 
 * @returns { String } - the affordance type
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

//TODO: Improve this function to retrieve possible protocols if there are multliple forms with the same operation
/**
 * Validate that the given operation belongs to the given form. If no form given look for the form with the given operation.
 * @param { Array } forms 
 * @param { string } operation 
 * @param { number } formIndex 
 * @returns { Object } formToUse
 */
function getForm(forms, operation, formIndex) {
    let formToUse;

    if (!forms) {
        throw new Error("No forms array was found for the specified affordance");
    }

    if (forms.length === 0) {
        throw new Error(`The forms array cannot be empty`);
    }

    if (formIndex !== null && formIndex !== undefined) {
        try {
            const form = forms[formIndex];

            if (typeof form["op"] === 'object' && form["op"].includes(operation)) {
                formToUse = form;
            }

            if (typeof form["op"] === 'string' && form["op"] === operation) {
                formToUse = form;
            }

        } catch (error) {
            throw new Error(`The form index ${formIndex} does not exist in the specified affordance`);
        }

        if (!formToUse) {
            throw new Error(`The ${operation} operation is not available in the specified form index ${formIndex}`);
        }

    }
    else {
        if (forms.length > 0) {
            forms.forEach(form => {
                if (typeof form["op"] === 'object' && form["op"].includes(operation)) {

                    formToUse = form;
                }

                if (typeof form["op"] === 'string' && form["op"] === operation) {

                    formToUse = form;
                }
            })
        }

        if (!formToUse) {
            throw new Error(`No form was found with the specified ${operation} operation`);
        }
    }

    if (formToUse) {
        return formToUse;
    } else {
        return;
    }
}

/**
 * Construct the absolute URL utilizing the base and the individual href from the form
 * @param { string } baseURL 
 * @param { string } partialURL 
 * @returns { string } absoluteURL
 */
function getAbsoluteURL(baseURL, partialURL) {

    const base = baseURL ? baseURL : '';
    const partial = partialURL ? partialURL : '';

    const absoluteURL = URLToolkit.buildAbsoluteURL(base, partial);

    return absoluteURL;
}

/**
 * Gets the list of available programming languages based on the templates folders
 * @returns { Array } languages
 */
export function getProgrammingLanguages() {

    try {
        const templateDir = path.resolve(__dirname, '../templates');
        const languages = fs.readdirSync(templateDir);

        return languages;

    } catch (error) {
        throw new Error("The templates directory could not be found or is empty");
    }
}

/**
 * Gets the list of available libraries based on the folders inside each programming language foder
 * @param { string } language 
 * @returns { Array } libraries
 */
export function getLibraries(language) {

    try {
        const templateDir = path.resolve(__dirname, '../templates', language);
        const libraries = fs.readdirSync(templateDir);

        return libraries

    } catch (error) {
        throw new Error("There are no available templates for the specified language");
    }
}

//TODO: Improve this function to get the protocol from the TD
export function getProtocol(td) {
    return detectProtocolSchemes(td);
}