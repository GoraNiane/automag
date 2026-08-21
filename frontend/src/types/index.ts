export type UserRole = 'USER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  createdAt: string;
  listingsCount?: number;
}

export type FuelType = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique' | 'GPL';
export type TransmissionType = 'Manuelle' | 'Automatique';
export type BodyType = 'Citadine' | 'Berline' | 'SUV' | '4x4' | 'Coupé' | 'Cabriolet' | 'Utilitaire' | 'Camionnette';
export type ListingStatus = 'Brouillon' | 'En attente' | 'Publiée' | 'Refusée' | 'Vendue' | 'Expirée';
export type RequestStatus = 'NOUVELLE' | 'EN_COURS' | 'TRAITEE' | 'ANNULEE';
export type AvailabilityType = 'Disponible' | 'Sous douane' | 'Sur commande';

export interface VehicleImage {
  id: string;
  url: string;
  publicId: string;
  order: number;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number; // in FCFA
  mileage: number; // in km
  fuel: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  color: string;
  location: string; // e.g. Dakar, Thiès
  power?: string; // e.g. 150 ch
  description: string;
  equipments: string[];
  images: string[];
  imageObjects?: VehicleImage[];
  primaryImage: string;
  condition: 'Neuf' | 'Occasion Europe' | 'Occasion Sénégal';
  isFeatured?: boolean;
  isPromo?: boolean;
  availability: AvailabilityType;
}

export interface Listing {
  id: string;
  vehicleId: string;
  sellerId: string;
  status: ListingStatus;
  createdAt: string;
  views: number;
  isPromoted?: boolean;
}

export interface Favorite {
  userId: string;
  vehicleId: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: 'listing_status' | 'request_update' | 'new_message' | 'system';
}
