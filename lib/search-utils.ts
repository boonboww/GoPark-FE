import { 
  SearchItem, 
  SearchResult, 
  SearchCategory, 
  Customer, 
  ParkingLot, 
  Ticket 
} from '@/types/search';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Building2,
  Ticket as TicketIcon,
  User,
  Settings,
  CreditCard,
  FileText,
  MapPin
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Mock data
export const mockCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0123456789',
    totalBookings: 15,
    status: 'active',
    registeredAt: new Date('2024-01-15')
  },
  {
    id: 'cust_2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0987654321',
    totalBookings: 8,
    status: 'active',
    registeredAt: new Date('2024-02-20')
  },
  {
    id: 'cust_3',
    name: 'Lê Hoàng Công',
    email: 'cong.le@email.com',
    phone: '0567890123',
    totalBookings: 22,
    status: 'inactive',
    registeredAt: new Date('2023-11-10')
  },
  {
    id: 'cust_4',
    name: 'Phạm Thị Dung',
    email: 'dung.pham@email.com',
    totalBookings: 3,
    status: 'blocked',
    registeredAt: new Date('2024-03-05')
  }
];

export const mockParkingLots: ParkingLot[] = [
  {
    id: 'lot_1',
    name: 'Bãi đỗ xe Vincom Center',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    totalSlots: 150,
    availableSlots: 45,
    status: 'active',
    hourlyRate: 15000,
    owner: 'owner_1'
  },
  {
    id: 'lot_2',
    name: 'Parking Time Square',
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    totalSlots: 200,
    availableSlots: 78,
    status: 'active',
    hourlyRate: 20000,
    owner: 'owner_1'
  },
  {
    id: 'lot_3',
    name: 'Smart Park Landmark',
    address: '789 Võ Văn Kiệt, Quận 5, TP.HCM',
    totalSlots: 100,
    availableSlots: 0,
    status: 'maintenance',
    hourlyRate: 12000,
    owner: 'owner_1'
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'ticket_1',
    customerName: 'Nguyễn Văn An',
    parkingLot: 'Bãi đỗ xe Vincom Center',
    vehicleNumber: '29A-123.45',
    startTime: new Date(),
    status: 'active',
    totalAmount: 30000
  },
  {
    id: 'ticket_2',
    customerName: 'Trần Thị Bình',
    parkingLot: 'Parking Time Square',
    vehicleNumber: '51F-678.90',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(),
    status: 'completed',
    totalAmount: 40000
  }
];

// Convert mock data to search items
export const getMenuSearchItems = (): SearchItem[] => [
  {
    id: 'menu_dashboard',
    title: 'Dashboard',
    subtitle: 'Tổng quan hệ thống',
    category: 'menu',
    href: '/owner',
    icon: LayoutDashboard,
    keywords: ['dashboard', 'tong quan', 'thong ke', 'home']
  },
  {
    id: 'menu_customers',
    title: 'Quản lý khách hàng',
    subtitle: 'Danh sách và thông tin khách hàng',
    category: 'menu',
    href: '/owner/customers',
    icon: Users,
    keywords: ['khach hang', 'customer', 'user', 'quan ly']
  },
  {
    id: 'menu_parking',
    title: 'Quản lý bãi đỗ',
    subtitle: 'Thông tin các bãi đỗ xe',
    category: 'menu',
    href: '/owner/parking',
    icon: Building2,
    keywords: ['bai do', 'parking', 'lot', 'xe']
  },
  {
    id: 'menu_tickets',
    title: 'Quản lý vé',
    subtitle: 'Vé đỗ xe và giao dịch',
    category: 'menu',
    href: '/owner/tickets',
    icon: TicketIcon,
    keywords: ['ve', 'ticket', 'giao dich', 'booking']
  },
  {
    id: 'menu_reports',
    title: 'Báo cáo thống kê',
    subtitle: 'Doanh thu và phân tích',
    category: 'menu',
    href: '/owner/reports',
    icon: BarChart3,
    keywords: ['bao cao', 'thong ke', 'report', 'doanh thu', 'analytics']
  },
  {
    id: 'menu_account',
    title: 'Tài khoản',
    subtitle: 'Thông tin cá nhân',
    category: 'menu',
    href: '/owner/account',
    icon: User,
    keywords: ['tai khoan', 'account', 'profile', 'ca nhan']
  }
];

export const getCustomerSearchItems = (): SearchItem[] => 
  mockCustomers.map(customer => ({
    id: `customer_${customer.id}`,
    title: customer.name,
    subtitle: customer.email,
    description: `${customer.totalBookings} lượt đặt - ${customer.status}`,
    category: 'customers' as SearchCategory,
    href: `/owner/customers/${customer.id}`,
    icon: User,
    metadata: customer,
    keywords: [
      customer.name.toLowerCase(),
      customer.email.toLowerCase(),
      customer.phone || '',
      customer.status,
      'khach hang',
      'customer'
    ]
  }));

export const getParkingLotSearchItems = (): SearchItem[] =>
  mockParkingLots.map(lot => ({
    id: `lot_${lot.id}`,
    title: lot.name,
    subtitle: lot.address,
    description: `${lot.availableSlots}/${lot.totalSlots} chỗ trống - ${lot.hourlyRate.toLocaleString()}đ/h`,
    category: 'parking-lots' as SearchCategory,
    href: `/owner/parking/${lot.id}`,
    icon: Building2,
    metadata: lot,
    keywords: [
      lot.name.toLowerCase(),
      lot.address.toLowerCase(),
      'bai do',
      'parking',
      'lot',
      lot.status
    ]
  }));

export const getTicketSearchItems = (): SearchItem[] =>
  mockTickets.map(ticket => ({
    id: `ticket_${ticket.id}`,
    title: `Vé ${ticket.id}`,
    subtitle: `${ticket.customerName} - ${ticket.vehicleNumber}`,
    description: `${ticket.parkingLot} - ${ticket.totalAmount.toLocaleString()}đ`,
    category: 'tickets' as SearchCategory,
    href: `/owner/tickets/${ticket.id}`,
    icon: TicketIcon,
    metadata: ticket,
    keywords: [
      ticket.id,
      ticket.customerName.toLowerCase(),
      ticket.vehicleNumber,
      ticket.parkingLot.toLowerCase(),
      've',
      'ticket',
      ticket.status
    ]
  }));

// Combine all search items
export const getAllSearchItems = (): SearchItem[] => [
  ...getMenuSearchItems(),
  ...getCustomerSearchItems(),
  ...getParkingLotSearchItems(),
  ...getTicketSearchItems()
];

// Search algorithm
export const searchItems = (
  query: string, 
  items: SearchItem[] = getAllSearchItems(),
  maxResults: number = 10
): SearchResult[] => {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  items.forEach(item => {
    let score = 0;
    const matchedFields: string[] = [];

    // Search in title (highest priority)
    if (item.title.toLowerCase().includes(normalizedQuery)) {
      score += 100;
      matchedFields.push('title');
    }

    // Search in subtitle
    if (item.subtitle?.toLowerCase().includes(normalizedQuery)) {
      score += 80;
      matchedFields.push('subtitle');
    }

    // Search in description
    if (item.description?.toLowerCase().includes(normalizedQuery)) {
      score += 60;
      matchedFields.push('description');
    }

    // Search in keywords
    if (item.keywords?.some(keyword => 
      keyword.toLowerCase().includes(normalizedQuery)
    )) {
      score += 40;
      matchedFields.push('keywords');
    }

    // Exact matches get higher scores
    if (item.title.toLowerCase() === normalizedQuery) {
      score += 200;
    }

    // Starts with query gets bonus
    if (item.title.toLowerCase().startsWith(normalizedQuery)) {
      score += 50;
    }

    if (score > 0) {
      results.push({ item, score, matchedFields });
    }
  });

  // Sort by score (descending) and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};

// Category filters
export const filterByCategory = (
  items: SearchItem[], 
  categories: SearchCategory[]
): SearchItem[] => {
  if (categories.length === 0) return items;
  return items.filter(item => categories.includes(item.category));
};

// Recent searches management
const RECENT_SEARCHES_KEY = 'gopark_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export const saveRecentSearch = (item: SearchItem): void => {
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(r => r.id !== item.id);
    const updated = [item, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save recent search:', error);
  }
};

export const getRecentSearches = (): SearchItem[] => {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to get recent searches:', error);
    return [];
  }
};

export const clearRecentSearches = (): void => {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.warn('Failed to clear recent searches:', error);
  }
};
