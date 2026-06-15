import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { firestore } from './firebase';

const collectionName = 'templatePrices';
const paymentsCollectionName = 'websitePayments';
const cacheKey = 'dbc-template-prices-cache';
export const defaultTemplatePrice = 150;

export type TemplatePrices = Record<string, number>;
export type TemplateAvailability = Record<string, boolean>;

export interface TemplateSettings {
  price: number;
  available: boolean;
}

export interface WebsitePaymentData {
  templateId: string;
  businessName: string;
  websiteDomain: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountPaid: number;
  promoPrice: number;
  balanceDue: number;
  checkoutMode: 'full' | 'reserve';
  paymentIntentId: string;
  notes?: string;
}

export interface WebsitePayment extends WebsitePaymentData {
  id: string;
  createdAt?: { seconds?: number } | Date | null;
}

interface TemplatePriceDocument {
  price?: number;
  available?: boolean;
}

function readCachedTemplatePrices(): TemplatePrices {
  try {
    const saved = localStorage.getItem(cacheKey);
    if (!saved) return {};
    const parsed = JSON.parse(saved) as TemplatePrices;
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function cacheTemplatePrices(prices: TemplatePrices) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(prices));
  } catch {
    // Cache is only a loading fallback; Firestore remains the source of truth.
  }
}

export function getCachedTemplatePrices(): TemplatePrices {
  return readCachedTemplatePrices();
}

export function getCachedTemplatePrice(templateId: string) {
  const price = readCachedTemplatePrices()[templateId];
  return Number.isFinite(price) && price > 0 ? price : defaultTemplatePrice;
}

export function subscribeToTemplateSettings(
  onSettings: (settings: Record<string, TemplateSettings>) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(firestore, collectionName),
    (snapshot) => {
      const settings: Record<string, TemplateSettings> = {};
      const prices: TemplatePrices = {};

      snapshot.forEach((templateDoc) => {
        const data = templateDoc.data() as TemplatePriceDocument;
        const price = Number.isFinite(data.price) && Number(data.price) > 0 ? Number(data.price) : defaultTemplatePrice;
        prices[templateDoc.id] = price;
        settings[templateDoc.id] = {
          price,
          available: data.available !== false,
        };
      });

      cacheTemplatePrices(prices);
      onSettings(settings);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToTemplatePrices(
  onPrices: (prices: TemplatePrices) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeToTemplateSettings(
    (settings) => {
      onPrices(Object.fromEntries(Object.entries(settings).map(([id, setting]) => [id, setting.price])));
    },
    onError,
  );
}

export function subscribeToTemplateSetting(
  templateId: string,
  onSetting: (setting: TemplateSettings) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(firestore, collectionName, templateId),
    (snapshot) => {
      const data = snapshot.data() as TemplatePriceDocument | undefined;
      const price = data?.price;
      const nextPrice = Number.isFinite(price) && Number(price) > 0 ? Number(price) : defaultTemplatePrice;

      const prices = readCachedTemplatePrices();
      prices[templateId] = nextPrice;
      cacheTemplatePrices(prices);
      onSetting({
        price: nextPrice,
        available: data?.available !== false,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToTemplatePrice(
  templateId: string,
  onPrice: (price: number) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribeToTemplateSetting(templateId, (setting) => onPrice(setting.price), onError);
}

export function saveTemplatePrice(templateId: string, price: number) {
  return setDoc(
    doc(firestore, collectionName, templateId),
    {
      price,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function saveTemplateAvailability(templateId: string, available: boolean) {
  return setDoc(
    doc(firestore, collectionName, templateId),
    {
      available,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function saveWebsitePayment(payment: WebsitePaymentData) {
  return addDoc(collection(firestore, paymentsCollectionName), {
    ...payment,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToWebsitePayments(
  onPayments: (payments: WebsitePayment[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(firestore, paymentsCollectionName), orderBy('createdAt', 'desc')),
    (snapshot) => {
      onPayments(snapshot.docs.map((paymentDoc) => ({
        ...(paymentDoc.data() as WebsitePaymentData),
        id: paymentDoc.id,
        createdAt: paymentDoc.data().createdAt,
      })));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function formatTemplatePrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}
