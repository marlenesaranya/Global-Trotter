
export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  estimatedCost: number;
  // User-added fields
  personalReview?: string;
  personalRating?: number;
}

export interface DayPlan {
  dayNumber: number;
  city: string;
  activities: Activity[];
  summary: string;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  color: string;
  description: string;
  [key: string]: string | number | undefined;
}

export interface PackingItem {
  item: string;
  category: string;
}

export interface TripItinerary {
  id: string;
  destination: string;
  duration: string;
  travelers: string;
  totalBudget: number;
  currency: string;
  itinerary: DayPlan[];
  budgetBreakdown: BudgetBreakdown[];
  packingList: PackingItem[];
  createdAt: number;
  personalNotes?: string; // Overall trip notes
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelerType: 'solo' | 'couple' | 'family' | 'friends';
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  interests: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PlaceResult {
  name: string;
  description: string;
  rating?: string;
  address: string;
  mapUri: string;
}
