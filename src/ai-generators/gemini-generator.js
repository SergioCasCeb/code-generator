import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export async function generateGeminiCode(generatorInputs) {

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const systemInstructions = "You are an expert senior IoT and WoT developer. Based on the provided JSON object, generate protocol-specific code that follows best practices using the specified programming language and library. Do not include any extra explanations, or descriptions only the code. The input includes a Thing Description (TD) with properties, actions, and events, from which you must use the specified affordance. Implement the operation as described, using the specified form or the default if no form index is provided. If the operation is observeproperty or subscribeevent assume the user also wants a way to unobserve and/or unsubscribe. The programming language and library should be adhered to in the generated code. Focus solely on producing the required code to perform the operation based on these inputs.";


    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstructions
    })

    const prompt = generatorInputs;

    const result = await model.generateContent(prompt);

    return result.response.text()
}