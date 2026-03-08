export interface Package {
  id: string;
  destinationId: string;
  name: string;
  image: string;
  duration: number;
  price: number;
  description: string;
  itinerary: string[];
  inclusions: string[];
  category: string;
}

