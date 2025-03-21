const { AzureOpenAI } = require("openai");
const { DefaultAzureCredential, InteractiveBrowserCredential } = require("@azure/identity");

/**
 * Generate code using the ChatGPT API
 * @param { Object } generatorInputs 
 * @returns { Promise<String> } The generated code
 */
async function generateChatGPTCode(generatorInputs, endpoint="https://openai-aiattack-msa-001070-uksouth-sparql-query-00.openai.azure.com", apiVersion="2024-05-01-preview", deployment="gpt-4", apiKey="bf258e054aeb4142b2689c59d1bf72f9") {


    const credential = new InteractiveBrowserCredential({ tenantId: "72f988bf-86f1-41af-91ab-2d7cd011db47", clientId: "04b07795-8ddb-461a-bbee-02f9e1bf7b46" });
    const client = new AzureOpenAI({ endpoint, apiKey, credential, apiVersion, deployment, dangerouslyAllowBrowser: true });

    const systemInstructions = "You are an expert senior IoT and WoT developer. Based on the provided JSON object, generate protocol-specific code that follows best practices using the specified programming language and library. Do not include any extra explanations, or descriptions only the code. The input includes a Thing Description (TD) with properties, actions, and events, from which you must use the specified affordance. Implement the operation as described, using the specified form or the default if no form index is provided. If the operation is observeproperty or subscribeevent assume the user also wants a way to unobserve and/or unsubscribe. The programming language and library should be adhered to in the generated code. Focus solely on producing the required code to perform the operation based on these inputs.";


    const result = await client.chat.completions.create({
        messages: [
            { role: "system", content: systemInstructions },

            { role: "user", content: generatorInputs },
        ],


        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null
    });

    return result.choices[0].message.content;
}

//Export the function to be used in the main script
module.exports = generateChatGPTCode;