import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, push, ref, serverTimestamp, update } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAV087GU2EiD4N5ljU5wUkRWHeR6TGKdkE',
  authDomain: 'assistmetech-45347.firebaseapp.com',
  databaseURL: 'https://assistmetech-45347-default-rtdb.firebaseio.com',
  projectId: 'assistmetech-45347',
  storageBucket: 'assistmetech-45347.firebasestorage.app',
  messagingSenderId: '121696551475',
  appId: '1:121696551475:web:c557dc0212216f0e40d946',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);

export interface ContactFormData {
  company: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
  requestType: string;
  source?: string;
  selectedAction?: string;
  demoBusinessName?: string;
  demoIndustry?: string;
  preferredDate?: string;
  preferredTime?: string;
}

export interface ContactMessage extends ContactFormData {
  id: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt?: number;
}

export function saveContactMessage(data: ContactFormData) {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

  return push(ref(database, 'contactedClients'), {
    ...cleanData,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export function subscribeToContactMessages(
  onMessages: (messages: ContactMessage[]) => void,
  onError: (error: Error) => void,
) {
  return onValue(
    ref(database, 'contactedClients'),
    (snapshot) => {
      const messages = snapshot.val() as Record<string, Omit<ContactMessage, 'id'>> | null;
      const sortedMessages = Object.entries(messages ?? {})
        .map(([id, message]) => ({ ...message, id }))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

      onMessages(sortedMessages);
    },
    onError,
  );
}

export function updateContactMessageStatus(id: string, status: ContactMessage['status']) {
  return update(ref(database, `contactedClients/${id}`), { status });
}
