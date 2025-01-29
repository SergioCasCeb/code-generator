import { parseTD, getTDAffordances, getAffordanceType, getFormIndexes, getOperations, getTDProtocols, getAvailableLanguages } from '../../../src/util/util.js';
import templatePaths from '../template-paths/templates-paths.json';

const inputsForm = document.getElementById("inputs-form");
const generatorSelect = document.getElementById("generator-type");
const apiKeyWrapper = document.getElementById("api-key-wrapper");
const generatorToolWrapper = document.getElementById("generator-tool-wrapper");
const generatorToolSelect = document.getElementById("generator-tool");

const languageSelectWrapper = document.getElementById("language-select-wrapper");
const languageSelect = document.getElementById("language-select");
const languageInput = document.getElementById("language-input");
const librarySelectWrapper = document.getElementById("library-select-wrapper");
const librarySelect = document.getElementById("library-select");
const libraryInput = document.getElementById("library-input");


const tdInput = document.getElementById("input-td");
const outputCode = document.getElementById("output-code");

let affordanceSelect = document.getElementById("affordance");
let formIndexSelect = document.getElementById("form-index");
let operationSelect = document.getElementById("operation");

let parsedTD = {};
let affordanceType = "";
let affordance = affordanceSelect.value;
let formIndex = formIndexSelect.value;
let protocols = [];

document.addEventListener("DOMContentLoaded", () => {
    checkGeneratorType();
});

tdInput.addEventListener("input", () => {
    try {
        parsedTD = parseTD(tdInput.value);
        const affordanceOptions = getTDAffordances(parsedTD);
        populateAffordances(affordanceOptions);
        getProtocols(parsedTD);
        populateLanguages(protocols);

    } catch (error) {
        resetInputs();
        return;
    }

})

affordanceSelect.addEventListener("change", () => {
    try {
        affordance = affordanceSelect.value;
        affordanceType = getAffordanceType(parsedTD, affordance);
        populateFormIndexes(parsedTD, affordanceType);
        populateOperations(parsedTD, affordanceType, affordance, formIndex);

    } catch (error) {
        console.error(error.message);
    }
});

formIndexSelect.addEventListener("change", () => {
    try {
        formIndex = formIndexSelect.value;
        populateOperations(parsedTD, affordanceType, affordance, formIndex);

    } catch (error) {
        console.error(error.message);
    }
});


generatorSelect.addEventListener("change", () => {
    checkGeneratorType();
});

languageSelect.addEventListener("change", () => {
    populateLibraries(protocols, languageSelect.value);
});

/**
 * Event listener to handle the form submission
 */
inputsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    //get the all the form inputs for the code generator functions
    const formData = new FormData(inputsForm);
    const inputsData = Object.fromEntries(formData.entries());
    const isAI = inputsData["generator-type"] === "ai" ? true : false;
    const aiTool = inputsData["generator-tool"] ? inputsData["generator-tool"] : null;
    outputCode.value = "";

    try {
        const generatorInputs = {
            td: parsedTD,
            affordance: inputsData["affordance"],
            formIndex: inputsData["form-index"] ? inputsData["form-index"] : null,
            operation: inputsData["operation"],
            programmingLanguage: inputsData["language"],
            library: inputsData["library"],
        };

        const generatedCode = await generateCode(generatorInputs, isAI, aiTool);
        outputCode.value = generatedCode;

    } catch (error) {
        console.log(error.message);
    }
});

inputsForm.addEventListener("reset", (e) => {
    e.preventDefault();
    resetInputs();
});

/************************/
/*  Utility Functions   */
/************************/

function checkGeneratorType() {
    if (generatorSelect.value === "deterministic" || generatorSelect.value === "") {
        generatorToolWrapper.classList.add("hidden");
        apiKeyWrapper.classList.add("hidden");
        languageInput.classList.add("hidden");
        libraryInput.classList.add("hidden");
        languageSelectWrapper.classList.remove("hidden");
        librarySelectWrapper.classList.remove("hidden");

        languageInput.value = "";
        libraryInput.value = "";
        generatorToolSelect.value = "";
    } else {
        generatorToolWrapper.classList.remove("hidden");
        apiKeyWrapper.classList.remove("hidden");
        languageInput.classList.remove("hidden");
        libraryInput.classList.remove("hidden");
        languageSelectWrapper.classList.add("hidden");
        librarySelectWrapper.classList.add("hidden");

        languageSelect.value = "";
        librarySelect.value = "";
    }

    toogleSelectInputs(generatorSelect.value);
}

function toogleSelectInputs(type) {
    if (type == "deterministic") {
        languageSelect.required = true;
        librarySelect.required = true;

        languageInput.required = false;
        libraryInput.required = false;

        generatorToolSelect.required = false;

        languageInput.disabled = true;
        libraryInput.disabled = true;

        languageSelect.disabled = false;
    } else {
        languageSelect.required = false;
        librarySelect.required = false;

        languageInput.required = true;
        libraryInput.required = true;

        generatorToolSelect.required = true;

        languageInput.disabled = false;
        libraryInput.disabled = false;

        languageSelect.disabled = true;
        librarySelect.disabled = true;

        generatorToolSelect.disabled = false;
    }
}


function populateAffordances(affordanceList) {
    // Clearing the affordance select options
    for (let i = affordanceSelect.options.length - 1; i > 0; i--) {
        affordanceSelect.remove(i);
    }

    affordanceList.forEach(affordance => {
        let option = document.createElement("option");
        option.text = affordance;
        option.value = affordance;
        affordanceSelect.add(option);
    });

    affordanceSelect.disabled = false;

}

function populateFormIndexes(td, type) {
    // Clearing the form index select options
    for (let i = formIndexSelect.options.length - 1; i > 0; i--) {
        formIndexSelect.remove(i);
    }

    try {
        const formOptions = getFormIndexes(td, type, affordanceSelect.value);

        formOptions.forEach(option => {
            let formOption = document.createElement("option");
            formOption.text = option;
            formOption.value = option;
            formIndexSelect.add(formOption);
        });

        formIndexSelect.disabled = false;
    } catch (error) {
        console.error(error.message);
    }


}

function populateOperations(td, type) {

    for (let i = operationSelect.options.length - 1; i > 0; i--) {
        operationSelect.remove(i);
    }

    try {
        const operationOptions = getOperations(td, type, affordanceSelect.value, formIndexSelect.value);

        operationOptions.forEach(option => {
            let operationOption = document.createElement("option");
            operationOption.text = option;
            operationOption.value = option;
            operationSelect.add(operationOption);
        });

        if (operationOptions.length === 1) {
            operationSelect.value = operationOptions[0];
        } else {
            operationSelect.value = "";
        }

        operationSelect.disabled = false;

    } catch (error) {
        console.error(error.message);
    }
}

function getProtocols(td) {
    try {
        protocols = getTDProtocols(JSON.stringify(td), JSON.stringify(templatePaths));
        generatorSelect.disabled = false;

        if (protocols) {
            generatorSelect.value = "deterministic";
            generatorSelect.options[1].disabled = false;
            populateLanguages(protocols);
        } else {
            generatorSelect.value = "ai";
            generatorSelect.options[1].disabled = true;
        }

        toogleSelectInputs(generatorSelect.value);

    } catch (error) {
        console.error(error.message);
    }
}

function populateLanguages(protocols) {
    try {
        const languages = getAvailableLanguages(protocols, JSON.stringify(templatePaths));

        //clearing the language and libraries select options
        for (let i = languageSelect.options.length - 1; i > 0; i--) {
            languageSelect.remove(i);
        }

        languages.forEach(language => {
            Object.entries(language).forEach(([key, value]) => {
                let languageOption = document.createElement("option");
                languageOption.text = key;
                languageOption.value = key;
                languageSelect.add(languageOption);
            });
        });

    } catch (error) {
        console.error(error.message);
    }
}

function populateLibraries(protocols, selectedLanguage) {
    try {
        const languages = getAvailableLanguages(protocols, JSON.stringify(templatePaths));

        //clearing the language and libraries select options
        for (let i = librarySelect.options.length - 1; i > 0; i--) {
            librarySelect.remove(i);
        }

        languages.forEach(language => {
            if (language[selectedLanguage]) {
                language[selectedLanguage].forEach(library => {
                    let libraryOption = document.createElement("option");
                    libraryOption.text = library;
                    libraryOption.value = library;
                    librarySelect.add(libraryOption);
                });
            }
        });

        librarySelect.disabled = false;

    } catch (error) {
        console.error(error.message);
    }
}

function resetInputs() {
    affordanceSelect.disabled = true;
    formIndexSelect.disabled = true;
    operationSelect.disabled = true;
    generatorSelect.disabled = true;
    languageSelect.disabled = true;
    librarySelect.disabled = true;
    languageInput.disabled = true;
    libraryInput.disabled = true;
    generatorToolSelect.disabled = true;

    affordanceSelect.value = "";
    formIndexSelect.value = "";
    operationSelect.value = "";
    generatorSelect.value = "";
    languageSelect.value = "";
    librarySelect.value = "";
    languageInput.value = "";
    libraryInput.value = "";
    generatorToolSelect.value = "";
    outputCode.value = "";
    tdInput.value = "";
}

async function generateCode(generatorInputs, isAI, aiTool) {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ generatorInputs, isAI, aiTool })
    });

    const generatedCode = await res.json();

    console.log(generatedCode);
    

    return generatedCode;
}

