import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { firestore } from './firebase';

const collectionName = 'templatePrices';
const cacheKey = 'dbc-template-prices-cache';
export const defaultTemplatePrice = 150;

export type TemplatePrices = Record<string, number>;

interface TemplatePriceDocument {
  price?: number;
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

export function subscribeToTemplatePrices(
  onPrices: (prices: TemplatePrices) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(firestore, collectionName),
    (snapshot) => {
      const prices: TemplatePrices = {};

      snapshot.forEach((templateDoc) => {
        const data = templateDoc.data() as TemplatePriceDocument;
        if (Number.isFinite(data.price) && Number(data.price) > 0) {
          prices[templateDoc.id] = Number(data.price);
        }
      });

      cacheTemplatePrices(prices);
      onPrices(prices);
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
  return onSnapshot(
    doc(firestore, collectionName, templateId),
    (snapshot) => {
      const data = snapshot.data() as TemplatePriceDocument | undefined;
      const price = data?.price;

      if (Number.isFinite(price) && Number(price) > 0) {
        const prices = readCachedTemplatePrices();
        prices[templateId] = Number(price);
        cacheTemplatePrices(prices);
        onPrice(Number(price));
        return;
      }

      onPrice(defaultTemplatePrice);
    },
    (error) => {
      onError?.(error);
    },
  );
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

export function formatTemplatePrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}
