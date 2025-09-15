/**
 * Types and interfaces for Quick Search functionality
 */

import { LucideIcon } from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: SearchCategory;
  href?: string;
  icon?: LucideIcon;
  metadata?: Record<string, any>;
  keywords?: string[];
}

export type SearchCategory = 
  | 'menu'
  | 'customers' 
  | 'parking-lots'
  | 'tickets'
  | 'reports'
  | 'settings'
  | 'recent';

export interface SearchResult {
  item: SearchItem;
  score: number;
  matchedFields: string[];
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  selectedIndex: number;
  isLoading: boolean;
  recentSearches: SearchItem[];
  categories: SearchCategory[];
}

export interface QuickSearchProps {
  isCollapsed?: boolean;
  onItemSelect?: (item: SearchItem) => void;
  onClose?: () => void;
  placeholder?: string;
  maxResults?: number;
}

export interface SearchFilters {
  categories?: SearchCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
}

// Mock data interfaces
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  status: 'active' | 'inactive' | 'blocked';
  registeredAt: Date;
}

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSlots: number;
  availableSlots: number;
  status: 'active' | 'maintenance' | 'closed';
  hourlyRate: number;
  owner: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  parkingLot: string;
  vehicleNumber: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  totalAmount: number;
}
