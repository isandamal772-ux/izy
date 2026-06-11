export enum DestinationCategory {
  WATERFALLS = "waterfalls",
  BEACHES = "beaches",
  MOUNTAINS_HILL_COUNTRY = "mountains_hill_country",
  MOUNTAINS = "mountains_hill_country",
  SAFARI_PARKS = "safari_parks",
  SAFARI = "safari_parks",
  HERITAGE_SITES = "heritage_sites",
  HERITAGE = "heritage_sites",
  HIDDEN_GEMS = "hidden_gems"
}

export interface UserReview {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  entityId: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Place {
  id: string;
  name: string;
  category: DestinationCategory;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewsCount: number;
  description: string;
  seoReview?: string; // made optional
  visitorTips?: string[]; // made optional
  entranceFee?: string; // made optional
  bestTime?: string; // made optional
  imageUrls: string[]; // gallery of images
  imageUrl?: string; // made optional
  imageLicense?: string; // made optional for licensing attribution e.g. CC BY-SA 4.0, Unsplash Free etc.
  
  // Category-specific properties
  surfingInfo?: string;     // beaches
  swimmingSafety?: string;  // beaches
  difficultyLevel?: string; // mountains
  hikingGuide?: string;     // mountains
  weatherForecast?: string; // mountains
  animalSightings?: string[]; // safari
  safariCosts?: string;     // safari
  jeepBooking?: string;     // safari
  unescoInfo?: string;      // heritage
  history?: string;         // heritage
}

export enum HotelCategory {
  LUXURY = "luxury",
  BUDGET = "budget",
  HOSTEL = "hostel",
  RESORT = "resort",
  LODGE = "lodge"
}

export interface Hotel {
  id: string;
  name: string;
  category: HotelCategory;
  description: string; // 200+ words review
  priceRange: string;
  facilities: string[];
  imageUrl: string;
  rating: number;
  location: string;
  latitude: number;
  longitude: number;
  bookingUrl: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  menuHighlights: string[];
  priceRange: string;
  description: string;
  imageUrl: string;
  rating: number;
  location: string;
  latitude: number;
  longitude: number;
}

export interface Review {
  id: string;
  placeType: "places" | "hotels" | "restaurants";
  referenceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  favorites?: string[]; // list of ids of places/hotels/restaurants
  createdAt: string;
}

export interface TripPlan {
  id: string;
  userId: string;
  title: string;
  durationDays: number; // 1 | 3 | 7 | 14
  itinerary: {
    [day: string]: {
      theme: string;
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
  };
  createdAt: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
}
