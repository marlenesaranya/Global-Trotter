
import Groq from "groq-sdk";
import { TripFormData, TripItinerary, ChatMessage, PlaceResult } from "../types";

const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY || process.env.API_KEY;
    return new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
};

export async function generateTravelPlan(data: TripFormData): Promise<TripItinerary> {
    const groq = getGroqClient();

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
  Keep the tone friendly and practical. Set the currency to '₹' and use INR for all numerical amounts.
  
  IMPORTANT: Return the response as a valid JSON object matching this schema:
  {
    "destination": string,
    "duration": string,
    "travelers": string,
    "totalBudget": number,
    "currency": string,
    "itinerary": [
      {
        "dayNumber": number,
        "city": string,
        "summary": string,
        "activities": [
          {
            "time": string,
            "title": string,
            "description": string,
            "location": string,
            "estimatedCost": number
          }
        ]
      }
    ],
    "budgetBreakdown": [
      {
        "category": string,
        "amount": number,
        "color": string,
        "description": string
      }
    ],
    "packingList": [
      {
        "item": string,
        "category": string
      }
    ]
  }`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a professional travel planner. You must respond only with valid JSON."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content;
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
    const groq = getGroqClient();

    const chatContext = `You are an AI travel concierge for GlobeTrotter. The user has a trip planned to ${trip.destination}.
  Itinerary Context: ${trip.itinerary.map(d => `Day ${d.dayNumber} in ${d.city}`).join(', ')}.
  Total Budget: ${trip.currency}${trip.totalBudget}.
  
  Answer the user's question about this trip. Be helpful, friendly, and specific to the destination. If they ask about things not in the itinerary, provide suggestions that fit their destination. Keep responses under 3 sentences.`;

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: chatContext },
            ...history.map(m => ({
                role: m.role as "user" | "assistant",
                content: m.text
            })),
            { role: "user", content: newMessage }
        ]
    });

    return response.choices[0]?.message?.content || "I'm having a little trouble connecting. Could you try again?";
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: "You are a travel expert. Find great places based on the user's query. Return the results as a JSON array of objects with 'name', 'description', 'address', and 'mapUri' fields."
            },
            {
                role: "user",
                content: `Find great places for: ${query}.`
            }
        ],
        response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    try {
        const parsed = JSON.parse(content);
        // Handle both { "places": [...] } and [...] formats
        const places = Array.isArray(parsed) ? parsed : (parsed.places || parsed.results || []);
        return places.map((p: any) => ({
            name: p.name || "Unknown Place",
            description: p.description || "Found via AI search",
            address: p.address || "",
            mapUri: p.mapUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name || query)}`
        }));
    } catch (e) {
        console.error("Failed to parse places search result:", e);
        return [];
    }
}
