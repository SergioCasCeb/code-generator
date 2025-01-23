#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { input, select, editor } from '@inquirer/prompts';
import fileSelector from 'inquirer-file-selector';
import { createSpinner } from 'nanospinner';
import { generateCode, getAffordanceType, getProgrammingLanguages, getLibraries } from '../src/lib/code-generator.js';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

//TODO: should the output file be in the project directory or in the current directory?
/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/

/**
 * Provide a user friendly message when the user exits the program and throw an error if the reason for the exit is not an ExitPromptError
 */
process.on('uncaughtException', (error) => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\nThe Code Generator has been exited!'));
        process.exit(1);
    } else {
        throw error;
    }
});


async function tdInputType() {
    const tdInput = await select({
        message: 'How would you like to input your TD?',
        choices: [
            {
                name: 'File',
                value: 'file',
            },
            {
                name: 'Text',
                value: 'text',
            },
        ],
    });

    return tdInput;
}

async function getTDFile() {
    const filePath = await fileSelector({
        message: 'Select the path to your TD file:',
        basePath: process.cwd(),
        type: 'file',
        allowCancel: true,
        cancelText: 'Exited file selection',
    });

    try {
        const fileType = path.extname(filePath);

        if (fileType !== '.json' && fileType !== '.jsonld' && fileType !== '.txt') {
            console.log(chalk.red("Invalid file format! Please select a JSON, JSONLD or TXT file."));
            process.exit(1);
        } else {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parsedTD = JSON.parse(fileContent);
            return parsedTD;
        }
    } catch (error) {
        if (error.name === 'SyntaxError') {
            console.log(chalk.red("Invalid JSON format! Please enter a valid TD."));
        }
        else {
            console.log(chalk.red("An error occurred! Please try again."));
        }
    }
}


async function getTDEditor() {

    const td = await editor({
        message: 'Enter your TD here:',
    });

    try {
        const parsedTD = JSON.parse(td);
        return parsedTD;
    }
    catch (error) {
        if (error.name === 'SyntaxError') {
            console.log(chalk.red("Invalid JSON format! Please enter a valid TD."));
        } else {
            console.log(chalk.red("An error occurred! Please try again."));
        }
    }
}

async function getAffordanceOptions(td) {

    const properties = td.properties ? Object.keys(td.properties) : [];
    const actions = td.actions ? Object.keys(td.actions) : [];
    const events = td.events ? Object.keys(td.events) : [];

    const affordanceOptions = [
        ...properties.map(property => ({ name: property, value: property })),
        ...actions.map(action => ({ name: action, value: action })),
        ...events.map(event => ({ name: event, value: event }))
    ];

    if (affordanceOptions.length === 0) {
        console.log(chalk.red('Invalid or empty TD! Please provide a valid TD with properties, actions or events.'));
        process.exit(1);
    } else {
        const affordance = await select({
            message: 'Select an affordance:',
            choices: affordanceOptions,
        });

        return affordance;
    }
}

async function getFormIndex(td, affordanceType, affordance) {
    const availableForms = td[affordanceType][affordance].forms;

    if (availableForms && availableForms.length > 0) {
        const availableIndexes = Array.from(availableForms.keys());
        const emptyForm = [{ name: 'None', value: null, description: "Do not want to specify any form!" }];

        const formIndexOptions = [
            ...emptyForm,
            ...availableIndexes.map(index => ({ name: index, value: index }))
        ];

        const formIndex = await select({
            message: `Select a form index:`,
            choices: formIndexOptions,
        });

        return formIndex;

    } else {
        console.log(chalk.red('No forms available for the selected affordance!'));
        process.exit(1);
    }
}

async function getOperation(affordanceType) {

    const operationList = {
        properties: [
            { name: 'readproperty', value: 'readproperty' },
            { name: 'writeproperty', value: 'writeproperty' },
            { name: 'observeproperty/unobserveproperty', value: 'observeproperty' }
        ],
        actions: [{ name: 'invokeaction', value: 'invokeaction' }],
        events: [{ name: 'subscribeevent/unsubscribeevent', value: 'subscribeevent' }]
    }

    const operationOptions = [
        ...operationList[affordanceType]
    ]

    const operation = await select({
        message: 'Select an operation:',
        choices: operationOptions,
    });

    return operation;
}

async function getGeneratorType() {
    const isAI = await select({
        message: 'Select a generator type:',
        choices: [
            { name: 'Deterministic', value: false },
            { name: 'AI', value: true },
        ],
    });

    return isAI;
}

async function getAITool() {
    const aiTool = await select({
        message: 'Select an AI tool:',
        choices: [
            { name: 'ChatGPT', value: "chatgpt" },
            { name: 'Gemini', value: "gemini" },
            { name: 'Llama', value: "llama" },
        ],
    });

    return aiTool;
}

async function getProgrammingLanguage(isAI) {

    if (isAI) {
        const programmingLanguage = await input({
            type: 'text',
            message: 'Enter a programming language:',
        });

        return programmingLanguage;
    } else {
        const availableLanguages = getProgrammingLanguages();

        if (availableLanguages && availableLanguages.length > 0) {
            const programmingLanguage = await select({
                message: 'Enter a programming language:',
                choices: availableLanguages,
            });

            return programmingLanguage;
        } else {
            console.log(chalk.red('No programming languages available!'));
            process.exit(1);
        }
    }
}

async function getLibrary(isAI, programmingLanguage) {

    if (isAI) {
        const library = await input({
            type: 'text',
            message: 'Enter a library:',
        });

        return library;
    }
    else {
        const availableLibraries = getLibraries(programmingLanguage);

        if (availableLibraries && availableLibraries.length > 0) {
            const library = await select({
                message: 'Select a library:',
                choices: availableLibraries,
            });

            return library;
        } else {
            console.log(chalk.red('No libraries available!'));
            process.exit(1);
        }
    }
}

async function getOutputType() {
    const output = await select({
        message: 'How would you like to output the code?',
        choices: [
            {
                name: 'Console',
                value: 'console',
            },
            {
                name: 'File',
                value: 'file',
            },
        ],
    });

    return output;
}

async function generateFile(affordance, operation, programmingLanguage, outputCode) {

    // const projectDirectory = path.resolve(__dirname);
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
        console.log(chalk.blue(`The Folder '${folderName}' was created.`));
    }

    const filePath = path.join(folderName, fileName);

    fs.writeFile(filePath, outputCode, (err) => {
        if (err) {
            console.log(chalk.red('An error occurred while writing the file!'));
            process.exit(1);
        } else {
            console.log(chalk.blue(`The file '${fileName}' was added to the '${folderName}' folder.`));
        }
    });
}

async function runCLI() {

    const inputType = await tdInputType();

    let inputTD;
    let affordance;
    let formIndex;
    let operation;
    let isAI = false;
    let aiTool;
    let programmingLanguage;
    let library;
    let outputType = 'console';

    if (inputType === 'file') {
        inputTD = await getTDFile();
    } else {
        inputTD = await getTDEditor();
    }

    //Get the affordance
    affordance = await getAffordanceOptions(inputTD);
    //Get the affordance type
    const affordanceType = getAffordanceType(inputTD, affordance);
    //Get the form index
    formIndex = await getFormIndex(inputTD, affordanceType, affordance);
    //Get the operation
    operation = await getOperation(affordanceType);
    //Get the generator type
    isAI = await getGeneratorType();
    //Get the AI tool if the generator type is AI
    if (isAI) {
        aiTool = await getAITool();
    }
    //Get the programming language
    programmingLanguage = await getProgrammingLanguage(isAI);
    //Get the library
    library = await getLibrary(isAI, programmingLanguage);

    //Get the output type
    outputType = await getOutputType();


    //Prepare the inputs for the code generator and generate the code
    const generatorInputs = {
        td: inputTD,
        affordance: affordance,
        formIndex: formIndex,
        operation: operation,
        programmingLanguage: programmingLanguage,
        library: library
    };

    const spinner = createSpinner('Generating Code...').start();

    try {
        const outputCode = await generateCode(generatorInputs, isAI, aiTool ? aiTool : null);
        setTimeout(() => {
            spinner.success(`Success: ${chalk.green('Code generated successfully!')}`)
            if (outputType === 'file') {
                generateFile(affordance, operation, programmingLanguage, outputCode);
            } else {
                console.log(`\n${outputCode}`);
            }
        }, 1000);

    } catch (error) {
        spinner.error(`Error: ${chalk.red(error.message)}`);
        process.exit(1);
    }

}

runCLI();