export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  destinationId: string;
  packageName: string;
  destinationName: string;
  travelers: number;
  travelDate: string;
  totalPrice: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
}
