import { GoogleGenAI, Modality } from "@google/genai";
import { ImageAttachment } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates or edits an image using Gemini 2.5 Flash Image (Nano Banana)
 */
export const generateImage = async (
  prompt: string,
  images: ImageAttachment[]
): Promise<string> => {
  const ai = createClient();

  // Prepare content parts: Images + Text
  const parts: any[] = [];

  // Add images first (multimodal input)
  images.forEach((img) => {
    // The API expects raw base64 without the data URL prefix for inlineData
    const base64Data = img.base64.split(',')[1]; 
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: base64Data,
      },
    });
  });

  // Add the text prompt
  parts.push({
    text: prompt,
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the generated image
    const generatedPart = response.candidates?.[0]?.content?.parts?.[0];
    
    if (!generatedPart || !generatedPart.inlineData) {
      throw new Error("No image was generated. The model might have refused the prompt or encountered an error.");
    }

    const base64ImageBytes = generatedPart.inlineData.data;
    // The response typically is PNG or JPEG, usually implied by the API, but we construct the data URI.
    // Gemini Flash Image usually returns image/png or image/jpeg.
    const mimeType = generatedPart.inlineData.mimeType || 'image/png';
    const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;

    return imageUrl;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};