// Core POS Types for Restaurant Management System

export interface MenuItem {
  id: string;
  name: string;
  nameHindi?: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  gstRate: number; // GST percentage (5% or 18% typically for restaurants)
  preparationTime?: number; // in minutes
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  tokenNumber?: number;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  cgst: number;
  sgst: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  grandTotal: number;
  paymentMode?: PaymentMode;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  gstRate: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type PaymentMode = 'cash' | 'upi' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  order: Order;
  restaurantInfo: RestaurantInfo;
  generatedAt: Date;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  gstin: string;
  fssaiNumber?: string;
  logo?: string;
}

export interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  cashAmount: number;
  upiAmount: number;
  cardAmount: number;
  cgstCollected: number;
  sgstCollected: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pin?: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'cashier' | 'kitchen';

export interface Table {
  id: string;
  number: string;
  section: string;
  status: 'blank' | 'running' | 'printed' | 'paid' | 'running-kot';
  amount?: number;
  time?: number; // minutes
  guests?: number;
}

// Helper function for formatting INR
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper to calculate GST
export const calculateGST = (subtotal: number, gstRate: number) => {
  const totalGst = (subtotal * gstRate) / 100;
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  return { cgst, sgst, totalGst };
};

// Generate invoice number
export const generateInvoiceNumber = (prefix: string = 'INV'): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${month}${day}${random}`;
};
