import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, firestore } from '../../lib/firebase';

type TableName =
  | 'profiles'
  | 'clients'
  | 'invoices'
  | 'invoice_items'
  | 'expenses'
  | 'bookings'
  | 'sales'
  | 'vendors'
  | 'banking'
  | 'payroll'
  | 'taxes'
  | 'products'
  | 'reports'
  | 'documents'
  | 'payment_accounts';
type DbRecord = Record<string, any> & { id: string };
type Filter = { field: string; op: 'eq' | 'gte'; value: unknown };
type OrderRule = { field: string; ascending: boolean };
type QueryResult<T = DbRecord> = { data: T[] | null; error: Error | null };
type SingleResult<T = DbRecord> = { data: T | null; error: Error | null };

export type QuickBookUser = {
  id: string;
  email: string | null;
};

export type QuickBookSession = {
  user: QuickBookUser;
};

const collectionName = (table: TableName) => `quickbook_${table}`;

const toQuickBookUser = (user: FirebaseUser): QuickBookUser => ({
  id: user.uid,
  email: user.email,
});

const toSession = (user: FirebaseUser | null): QuickBookSession | null => (
  user ? { user: toQuickBookUser(user) } : null
);

const serializeError = (error: unknown) => (
  error instanceof Error ? error : new Error('A database error occurred')
);

async function readTable(table: TableName): Promise<DbRecord[]> {
  const snapshot = await getDocs(collection(firestore, collectionName(table)));

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));
}

async function hydrateRows(table: TableName, rows: DbRecord[]) {
  if (table !== 'invoices' && table !== 'bookings') return rows;

  const clients = await readTable('clients');
  const invoiceItems = table === 'invoices' ? await readTable('invoice_items') : [];

  return rows.map((row) => ({
    ...row,
    clients: row.client_id ? clients.find((client) => client.id === row.client_id) ?? null : null,
    ...(table === 'invoices'
      ? { invoice_items: invoiceItems.filter((item) => item.invoice_id === row.id) }
      : {}),
  }));
}

class FirebaseQuery {
  private filters: Filter[] = [];
  private orderRule: OrderRule | null = null;

  constructor(private table: TableName) {}

  select(_columns?: string) {
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ field, op: 'eq', value });
    return this;
  }

  gte(field: string, value: unknown) {
    this.filters.push({ field, op: 'gte', value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderRule = { field, ascending: options?.ascending ?? true };
    return this;
  }

  async execute(): Promise<QueryResult> {
    try {
      let rows = await readTable(this.table);

      for (const filter of this.filters) {
        rows = rows.filter((row) => {
          const currentValue = row[filter.field];

          if (filter.op === 'eq') return currentValue === filter.value;
          if (typeof currentValue !== 'string' || typeof filter.value !== 'string') return false;

          return currentValue >= filter.value;
        });
      }

      if (this.orderRule) {
        const { field, ascending } = this.orderRule;
        rows = [...rows].sort((a, b) => {
          const aValue = String(a[field] ?? '');
          const bValue = String(b[field] ?? '');
          return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
      }

      return { data: await hydrateRows(this.table, rows), error: null };
    } catch (error) {
      return { data: null, error: serializeError(error) };
    }
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class FirebaseInsert {
  private shouldReturnSingle = false;

  constructor(private table: TableName, private payload: Record<string, unknown> | Record<string, unknown>[]) {}

  select() {
    return this;
  }

  single() {
    this.shouldReturnSingle = true;
    return this;
  }

  async execute(): Promise<QueryResult | SingleResult> {
    try {
      const records = Array.isArray(this.payload) ? this.payload : [this.payload];
      const saved: DbRecord[] = [];

      for (const record of records) {
        const now = new Date().toISOString();
        const nextRecord = {
          ...record,
          created_at: record.created_at ?? now,
          updated_at: now,
        };
        const newDoc = await addDoc(collection(firestore, collectionName(this.table)), nextRecord);

        saved.push({ id: newDoc.id, ...nextRecord });
      }

      if (this.shouldReturnSingle) return { data: saved[0] ?? null, error: null };
      return { data: saved, error: null };
    } catch (error) {
      return { data: null, error: serializeError(error) };
    }
  }

  then<TResult1 = QueryResult | SingleResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult | SingleResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class FirebaseUpdate {
  constructor(private table: TableName, private payload: Record<string, unknown>) {}

  async eq(field: string, value: unknown) {
    try {
      const rows = await readTable(this.table);
      const matches = rows.filter((row) => row[field] === value);

      await Promise.all(matches.map((row) => updateDoc(doc(firestore, collectionName(this.table), row.id), {
        ...this.payload,
        updated_at: new Date().toISOString(),
      })));

      return { data: matches, error: null };
    } catch (error) {
      return { data: null, error: serializeError(error) };
    }
  }
}

class FirebaseDelete {
  constructor(private table: TableName) {}

  async eq(field: string, value: unknown) {
    try {
      const rows = await readTable(this.table);
      const matches = rows.filter((row) => row[field] === value);

      await Promise.all(matches.map((row) => deleteDoc(doc(firestore, collectionName(this.table), row.id))));

      return { data: matches, error: null };
    } catch (error) {
      return { data: null, error: serializeError(error) };
    }
  }
}

export const supabase = {
  auth: {
    async getSession() {
      return { data: { session: toSession(auth.currentUser) }, error: null };
    },
    onAuthStateChange(callback: (_event: string, session: QuickBookSession | null) => void) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', toSession(user));
      });

      return { data: { subscription: { unsubscribe } } };
    },
    async signUp({ email, password }: { email: string; password: string }) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        return { data: { user: toQuickBookUser(credential.user) }, error: null };
      } catch (error) {
        return { data: { user: null }, error: serializeError(error) };
      }
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { error: null };
      } catch (error) {
        return { error: serializeError(error) };
      }
    },
    async signOut() {
      await firebaseSignOut(auth);
    },
  },
  from(table: TableName) {
    return {
      select: (_columns?: string) => new FirebaseQuery(table),
      insert: (payload: Record<string, unknown> | Record<string, unknown>[]) => new FirebaseInsert(table, payload),
      update: (payload: Record<string, unknown>) => new FirebaseUpdate(table, payload),
      delete: () => new FirebaseDelete(table),
      async upsert(payload: Record<string, unknown>) {
        try {
          const id = String(payload.id);
          const now = new Date().toISOString();

          await setDoc(doc(firestore, collectionName(table), id), {
            ...payload,
            updated_at: now,
            created_at: payload.created_at ?? now,
          }, { merge: true });

          return { data: { ...payload, id }, error: null };
        } catch (error) {
          return { data: null, error: serializeError(error) };
        }
      },
    };
  },
};

export type Profile = {
  id: string;
  full_name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  business_type?: string;
  state?: string;
  zipcode?: string;
  company_size?: string;
  company_type?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
};

export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  balance?: number;
  notes?: string;
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
  payee?: string;
  payment_account?: string;
  payment_method?: string;
  ref_no?: string;
  company_id?: string;
  company_name?: string;
  tax?: number;
  memo?: string;
  attachments?: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Vendor = {
  id: string;
  user_id: string;
  action?: string;
  title: string;
  vendor_name?: string;
  company_name?: string;
  phone?: string;
  email?: string;
  vendor_type?: 'Contractor' | '1099' | 'Supplier' | 'Other';
  form_1099?: boolean;
  payment_info?: string;
  bill_amount?: number;
  balance?: number;
  amount?: number;
  notes?: string;
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
