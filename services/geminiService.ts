
import { GoogleGenAI, Type } from "@google/genai";
import { TripFormData, TripItinerary, ChatMessage, PlaceResult } from "../types";

// Always initialize GoogleGenAI inside the function scope to ensure it picks up the latest API key from the environment.
export async function generateTravelPlan(data: TripFormData): Promise<TripItinerary> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Plan a trip to ${data.destination} for a ${data.travelerType} traveler/group. 
  Dates: ${data.startDate} to ${data.endDate}. 
  Budget Level: ${data.budgetLevel}. 
  Interests: ${data.interests.join(", ")}.
  
  Provide a structured, multi-city (if applicable) itinerary with a day-by-day plan. 
  Include specific activities for each day with estimated costs in INR.
  
  Create a detailed budget breakdown for exactly these categories: 'Travel', 'Stay', 'Food', 'Local Transport', 'Activities'.
  For each category, provide:
  1. A short one-sentence explanation of what it covers.
  2. The estimated total cost for that category in INR.
  
  Generate a comprehensive packing list categorized into 'Essentials', 'Clothing', 'Gear', and 'Toiletries'.
  Keep the tone friendly and practical. Set the currency to '₹' and use INR for all numerical amounts.`;

  // Use 'gemini-3-pro-preview' for complex reasoning tasks like multi-day itinerary planning.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          duration: { type: Type.STRING },
          travelers: { type: Type.STRING },
          totalBudget: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                city: { type: Type.STRING },
                summary: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER }
                    },
                    required: ["time", "title", "description", "location", "estimatedCost"]
                  }
                }
              },
              required: ["dayNumber", "city", "summary", "activities"]
            }
          },
          budgetBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                color: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["category", "amount", "color", "description"]
            }
          },
          packingList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["item", "category"]
            }
          }
        },
        required: ["destination", "duration", "travelers", "totalBudget", "currency", "itinerary", "budgetBreakdown", "packingList"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    } as TripItinerary;
  } catch (error) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Invalid response format from AI");
  }
}

export async function chatWithAI(trip: TripItinerary, history: ChatMessage[], newMessage: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chatContext = `You are an AI travel concierge for GlobeTrotter. The user has a trip planned to ${trip.destination}.
  Itinerary Context: ${trip.itinerary.map(d => `Day ${d.dayNumber} in ${d.city}`).join(', ')}.
  Total Budget: ${trip.currency}${trip.totalBudget}.
  
  Answer the user's question about this trip. Be helpful, friendly, and specific to the destination. If they ask about things not in the itinerary, provide suggestions that fit their destination. Keep responses under 3 sentences.`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: chatContext,
    },
    history: history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "I'm having a little trouble connecting. Could you try again?";
}

export async function searchPlaces(query: string, location?: { latitude: number, longitude: number }): Promise<PlaceResult[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: `Find great places for: ${query}. Return the results as a list.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: location ? {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      } : undefined
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const places: PlaceResult[] = [];

  if (groundingChunks) {
    for (const chunk of groundingChunks) {
      if (chunk.maps) {
        places.push({
          name: chunk.maps.title || "Unknown Place",
          description: "Found via Google Maps",
          address: "",
          mapUri: chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chunk.maps.title || query)}`
        });
      }
    }
  }

  // Fallback if no specific map chunks returned but text exists
  if (places.length === 0 && response.text) {
    // Simple parsing logic or just return the text description if it's more chatty
    // In a real scenario, we'd prompt for specific JSON output without tools or parse better.
    // For this implementation, we rely on the grounding chunks for the map links.
  }

  return places;
}
