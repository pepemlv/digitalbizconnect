import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  company_name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
};

export type Invoice = {
  id: string;
  user_id: string;
  client_id: string | null;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  created_at: string;
  updated_at: string;
  clients?: Client;
  invoice_items?: InvoiceItem[];
};

export type Expense = {
  id: string;
  user_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location: string;
  notes: string;
  created_at: string;
  updated_at: string;
  clients?: Client;
};

export const EXPENSE_CATEGORIES = [
  'Office Supplies',
  'Travel',
  'Meals & Entertainment',
  'Software & Subscriptions',
  'Marketing',
  'Utilities',
  'Rent',
  'Equipment',
  'Professional Services',
  'Insurance',
  'Other',
];
