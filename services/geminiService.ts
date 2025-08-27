import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    ticker: {
      type: Type.STRING,
      description: "The stock ticker symbol that was analyzed."
    },
    suggestion: {
      type: Type.STRING,
      description: "The investment suggestion. Must be one of: 'Strong Buy', 'Moderate Buy', 'Hold', 'Moderate Sell', 'Strong Sell'."
    },
    confidence: {
      type: Type.STRING,
      description: "A percentage string representing the confidence level in the suggestion (e.g., '85%')."
    },
    analysis: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "An array of strings, with each string being a bullet point for positive analysis or reasons to invest based on the historical data."
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "An array of strings, with each string being a bullet point for potential risks or reasons for caution based on the historical data."
    },
    startDate: {
      type: Type.STRING,
      description: "The start date of the analysis period in YYYY-MM-DD format, matching the input."
    },
    endDate: {
      type: Type.STRING,
      description: "The end date of the analysis period in YYYY-MM-DD format, matching the input."
    },
    historicalData: {
      type: Type.ARRAY,
      description: "An array of 15-20 data points representing the stock's historical price. Each point should be an object with 'date' (YYYY-MM-DD format, chronologically ordered) and 'price' (a number).",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          price: { type: Type.NUMBER }
        },
        required: ["date", "price"]
      }
    }
  },
  required: ["ticker", "suggestion", "confidence", "analysis", "risks", "startDate", "endDate", "historicalData"]
};

export async function getStockAnalysis(ticker: string, startDate: string, endDate: string): Promise<AnalysisResult> {
  const prompt = `
    You are a highly skilled Stock Market Trading AI assistant. Your primary role is to help users make better trading decisions by providing clear, actionable, and unbiased insights based on historical data.

    Analyze the stock with the ticker symbol: "${ticker}".

    Focus your analysis on the performance and events within the following date range:
    - Start Date: ${startDate}
    - End Date: ${endDate}

    Your response must be a valid JSON object that strictly adheres to the provided schema. Do not include any markdown, introductory text, or explanations outside of the JSON structure.
    Your response MUST include the startDate and endDate you were given for the analysis.
    
    In addition to the analysis, provide a 'historicalData' array containing approximately 15 chronologically ordered data points for a simple price chart. Each object in the array should have a 'date' (YYYY-MM-DD) and a 'price' (numeric value) representing a snapshot of the stock's price within the specified date range. All price data you return, especially in the 'historicalData' array, MUST be in Indian Rupees (INR).

    When generating your analysis, consider factors like technical indicators (RSI, MACD), significant news sentiment, fundamental data (P/E ratio, earnings reports), and broad market trends *that occurred within the specified date range*.

    - The "suggestion" must be one of the predefined values, reflecting a forward-looking opinion based on the historical analysis.
    - The "confidence" must be a percentage string.
    - Both "analysis" and "risks" should be concise, clear bullet points derived from the data in the given period.
    - Be realistic about risks and never guarantee profits.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object fits the expected type
    if (
      !result.ticker ||
      !result.suggestion ||
      !result.confidence ||
      !Array.isArray(result.analysis) ||
      !Array.isArray(result.risks) ||
      !result.startDate ||
      !result.endDate ||
      !Array.isArray(result.historicalData)
    ) {
      throw new Error("API returned malformed JSON data.");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error in getStockAnalysis:", error);
    throw new Error("Failed to fetch or parse stock analysis from Gemini API.");
  }
}