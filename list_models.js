const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.list();
    console.log("AVAILABLE MODELS:");
    // @google/genai models.list() returns an array or object
    // Depending on the version, it might be an iterator
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
