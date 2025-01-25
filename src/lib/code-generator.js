import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import URLToolkit from 'url-toolkit';
import * as helpers from '../helpers/utilHelpers.js';
import * as httpHelpers from '../helpers/protocols/httpHelpers.js';
import * as modbusHelpers from '../helpers/protocols/modbusHelpers.js';
import { addDefaults } from '@thing-description-playground/defaults';
import { tdValidator } from '@thing-description-playground/core';
import { getAffordanceType } from '../util/util.js';
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
    if (!userInputs || (!userInputs.programmingLanguage || !userInputs.library || !userInputs.td || !userInputs.affordance || !userInputs.operation)) {
        if (!userInputs.programmingLanguage) {
            throw new Error("A programming language must be specified");
        }
        else if (!userInputs.library) {
            throw new Error("A library must be specified");
        }
        else if (!userInputs.td) {
            throw new Error("A Thing Description must be specified");
        }
        else if (!userInputs.affordance) {
            throw new Error("An affordance must be specified");
        }
        else if (!userInputs.operation) {
            throw new Error("An operation must be specified");
        } else {
            throw new Error("Invalid or missing inputs");
        }
    }

    if (generateAI) {
        if (!aiTool) {
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
    const filePath = path.resolve(__dirname, '../templates/templates-paths.json');
    const templatesPaths = fs.readFileSync(filePath, 'utf8');
    const templates = JSON.parse(templatesPaths);

    language = language.toLowerCase();
    library = library.toLowerCase();

    let templatePath;

    Object.values(templates).forEach(value => {
        if(value[language] && value[language][library]) {
            templatePath = value[language][library];
        }
    });

    if(templatePath) {
        try {
            const template = fs.readFileSync(templatePath, 'utf8');
            return template;
    
        } catch (error) {
    
            throw new Error("An error occurred while reading the template file");
        }
    }else {
        throw new Error("No available templates for the specified language and/or library");
    }
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