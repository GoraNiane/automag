import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Vehicle, Listing, ContactRequest, Notification, ListingStatus 
} from '../types';
import { getFormattedPhoneNumber } from '../config/whatsapp';

// Dynamic API URL for deployment
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || '/api';
};
export const API_URL = getApiUrl();

interface StoreState {
  currentUser: User | null;
  users: User[];
  vehicles: Vehicle[];
  listings: Listing[];
  favorites: string[]; // vehicleIds favorited by currentUser
  contactRequests: ContactRequest[];
  notifications: Notification[];
  
  // Async initial load
  fetchCatalog: () => Promise<void>;
  
  // Auth actions
  login: (email: string, roleOrPassword: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  
  // Favorites actions
  toggleFavorite: (vehicleId: string) => void;
  
  // Listings actions
  addListing: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateListing: (vehicleId: string, updatedVehicle: Partial<Vehicle>) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  updateListingStatus: (listingId: string, status: ListingStatus) => Promise<void>;
  markAsSold: (vehicleId: string) => Promise<void>;
  
  // Form requests
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  
  // Helpers
  getListingByVehicleId: (vehicleId: string) => Listing | undefined;
  getSellerByListingId: (sellerId: string) => User | undefined;
}

// Seed fallback data for offline mode
const offlineUsers: User[] = [
  {
    id: 'usr-admin',
    email: 'admin@autoelite.sn',
    phone: getFormattedPhoneNumber(),
    firstName: 'Ibrahima',
    lastName: 'Diallo',
    role: 'ADMIN',
    location: 'Dakar',
    createdAt: '2025-01-10T12:00:00Z'
  }
];

const offlineVehicles: Vehicle[] = [
  {
    id: 'veh-1',
    brand: 'Mercedes-Benz',
    model: 'Classe C 200',
    year: 2021,
    price: 18500000,
    mileage: 45000,
    fuel: 'Diesel',
    transmission: 'Automatique',
    bodyType: 'Berline',
    color: 'Noir Obsidienne',
    location: 'Dakar',
    power: '197 ch',
    description: 'Mercedes-Benz Classe C 200 de 2021 dans un état irréprochable. Entretien exclusif chez le concessionnaire. Pack AMG intérieur et extérieur, phares LED intelligents, grand écran multimédia tactile MBUX avec navigation, radars de recul 360°, régulateur de vitesse adaptatif, toit ouvrant panoramique.',
    equipments: ['Climatisation', 'GPS', 'Caméra de recul', 'Bluetooth', 'Jantes alliage', 'Démarrage sans clé', 'Toit panoramique', 'Radars 360', 'Aide au parking', 'Régulateur de vitesse'],
    images: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800'],
    primaryImage: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800',
    condition: 'Occasion Europe',
    isFeatured: true,
    isPromo: false,
    availability: 'Disponible'
  },
  {
    id: 'veh-2',
    brand: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2022,
    price: 22000000,
    mileage: 28000,
    fuel: 'Hybride',
    transmission: 'Automatique',
    bodyType: 'SUV',
    color: 'Gris Métallisé',
    location: 'Dakar',
    power: '218 ch',
    description: 'Superbe Toyota RAV4 Hybride 2022 finition Limited. Consommation très faible idéale pour la ville et les longs trajets. Climatisation automatique bi-zone, grand écran tactile avec Apple CarPlay et Android Auto, sièges en cuir ventilés et chauffants, coffre électrique, jantes 18 pouces.',
    equipments: ['Climatisation', 'GPS', 'Caméra de recul', 'Bluetooth', 'Jantes alliage', 'Démarrage sans clé', 'Apple CarPlay'],
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800'],
    primaryImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    condition: 'Occasion Sénégal',
    isFeatured: true,
    isPromo: true,
    availability: 'Sous douane'
  }
];

const offlineListings: Listing[] = [
  { id: 'lst-1', vehicleId: 'veh-1', sellerId: 'usr-admin', status: 'Publiée', createdAt: '2025-06-01T10:00:00Z', views: 342, isPromoted: true },
  { id: 'lst-2', vehicleId: 'veh-2', sellerId: 'usr-admin', status: 'Publiée', createdAt: '2025-06-02T11:00:00Z', views: 512, isPromoted: true }
];

export const useMockStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: offlineUsers,
      vehicles: offlineVehicles,
      listings: offlineListings,
      favorites: [],
      contactRequests: [],
      notifications: [],

      // 1. Initial Load of Catalog from Backend
      fetchCatalog: async () => {
        try {
          const vRes = await fetch(`${API_URL}/vehicles`);
          const lRes = await fetch(`${API_URL}/vehicles/listings/all`);
          if (vRes.ok && lRes.ok) {
            const vehicles = await vRes.json();
            const listings = await lRes.json();
            set({ vehicles, listings });
            console.log('[AutoElite Sync] Loaded catalog from database.');
          }
        } catch (err) {
          console.warn('[AutoElite Sync] Backend is offline. Running in fallback offline mode.');
        }
      },

      // 2. Auth Actions
      login: async (email, passwordOrRole) => {
        try {
          // Attempt real API connection
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: passwordOrRole })
          });

          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('autoelite_token', data.token);
            set({ currentUser: data.user });
            return true;
          }
          return false;
        } catch (err) {
          console.warn('[AutoElite Sync] Offline login fallback used.');
          // Offline fallback
          if (email.toLowerCase() === 'admin@autoelite.sn') {
            set({ currentUser: offlineUsers[0] });
            return true;
          }
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem('autoelite_token');
        set({ currentUser: null, favorites: [] });
      },
      updateProfile: (data) => {
        const current = get().currentUser;
        if (!current) return;
        set(state => ({
          currentUser: { ...current, ...data },
          users: state.users.map(u => u.id === current.id ? { ...u, ...data } : u)
        }));
      },

      // 3. Favorites Actions (Visitor Local Cache)
      toggleFavorite: (vehicleId) => {
        const favs = get().favorites;
        if (favs.includes(vehicleId)) {
          set({ favorites: favs.filter(id => id !== vehicleId) });
        } else {
          set({ favorites: [...favs, vehicleId] });
        }
      },

      // 4. Listings Actions
      addListing: async (vehicleData) => {
        try {
          const token = localStorage.getItem('autoelite_token');
          const res = await fetch(`${API_URL}/vehicles`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(vehicleData)
          });
          if (res.ok) {
            await get().fetchCatalog();
          }
        } catch (err) {
          console.error('Offline mode: Could not add listing to backend database.', err);
          // Local fallback creation
          const newVehId = `veh-${Date.now()}`;
          const newListingId = `lst-${Date.now()}`;
          const newVeh: Vehicle = { ...vehicleData, id: newVehId, isFeatured: false, isPromo: false };
          const newLst: Listing = { id: newListingId, vehicleId: newVehId, sellerId: 'usr-admin', status: 'Publiée', createdAt: new Date().toISOString(), views: 0 };
          set(state => ({
            vehicles: [newVeh, ...state.vehicles],
            listings: [newLst, ...state.listings]
          }));
        }
      },
      updateListing: async (vehicleId, updatedVehicle) => {
        try {
          const token = localStorage.getItem('autoelite_token');
          const res = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedVehicle)
          });
          if (res.ok) {
            await get().fetchCatalog();
          } else {
            console.error('Failed to update vehicle on backend');
          }
        } catch (err) {
          console.error('Offline mode: Could not update vehicle in database.', err);
          set(state => ({
            vehicles: state.vehicles.map(v => v.id === vehicleId ? { ...v, ...updatedVehicle } as Vehicle : v)
          }));
        }
      },
      deleteListing: async (listingId) => {
        try {
          const listing = get().listings.find(l => l.id === listingId);
          if (!listing) return;
          const token = localStorage.getItem('autoelite_token');
          const res = await fetch(`${API_URL}/vehicles/${listing.vehicleId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            await get().fetchCatalog();
          }
        } catch (err) {
          console.error('Offline mode: Could not delete from database.', err);
          const listing = get().listings.find(l => l.id === listingId);
          if (listing) {
            set(state => ({
              listings: state.listings.filter(l => l.id !== listingId),
              vehicles: state.vehicles.filter(v => v.id !== listing.vehicleId)
            }));
          }
        }
      },
      updateListingStatus: async (listingId, status) => {
        try {
          const token = localStorage.getItem('autoelite_token');
          const res = await fetch(`${API_URL}/vehicles/listings/${listingId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
          });
          if (res.ok) {
            await get().fetchCatalog();
          }
        } catch (err) {
          console.error('Offline mode: Could not update status in database.', err);
          set(state => ({
            listings: state.listings.map(l => l.id === listingId ? { ...l, status } : l)
          }));
        }
      },
      markAsSold: async (vehicleId) => {
        const listing = get().listings.find(l => l.vehicleId === vehicleId);
        if (!listing) return;
        await get().updateListingStatus(listing.id, 'Vendue');
      },

      // 5. Contact Requests
      addContactRequest: async (request) => {
        try {
          const res = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
          if (res.ok) {
            console.log('[AutoElite Sync] Contact request saved on backend.');
          }
        } catch (err) {
          console.warn('[AutoElite Sync] Failed to send contact to backend, adding locally.', err);
          const newReq: ContactRequest = {
            ...request,
            id: `contact-${Date.now()}`,
            status: 'NOUVELLE',
            createdAt: new Date().toISOString()
          };
          set(state => ({
            contactRequests: [newReq, ...state.contactRequests]
          }));
        }
      },

      // 6. Helpers
      getListingByVehicleId: (vehicleId) => {
        return get().listings.find(l => l.vehicleId === vehicleId);
      },
      getSellerByListingId: (sellerId) => {
        return get().users.find(u => u.id === sellerId);
      }
    }),
    {
      name: 'autoelite-mock-db',
    }
  )
);
