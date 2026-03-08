export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredTravelStyle?: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  phone: string;
  preferredTravelStyle: string;
}
