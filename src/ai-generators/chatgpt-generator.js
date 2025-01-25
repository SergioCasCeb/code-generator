import { AzureOpenAI } from "openai";
import { DefaultAzureCredential } from "@azure/identity";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiVersion = process.env["OPENAI_API_VERSION"]
const deployment = process.env["AZURE_OPENAI_DEPLOYMENT_NAME"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];


const credential = new DefaultAzureCredential();
const client = new AzureOpenAI({ endpoint, apiKey, credential, apiVersion, deployment });

const systemInstructions = "You are an expert senior IoT and WoT developer. Based on the provided JSON object, generate protocol specific code that follows best practices using the specified programming language and library. Do not include any extra explanations, or descriptions only the code.The input includes a Thing Description (TD) with properties, actions, and events, from which you must use the specified affordance.Implement the operation as described, using the specified form or the default if no form index is provided.The programming language and library should be adhered to in the generated code. Focus solely on producing the required code to perform the operation based on these inputs.";

export async function generateChatGPTCode(generatorInputs) {

    const result = await client.chat.completions.create({
        messages: [
            { role: "system", content: systemInstructions },

            { role: "user", content: generatorInputs },
        ],

        // max_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null

    });

    return result.choices[0].message.content;
}