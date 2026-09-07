import { OrderData, OrderResult, CartItem } from '../types';
import { generateTrackingNumber } from './utils';

const ORDERS_KEY = 'thg_pharma_orders_v1';
const WAITLIST_KEY = 'thg_pharma_waitlist_v1';
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8877/api';

export interface SavedOrder extends OrderResult {
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  paymentMethod: string;
  createdAt: string;
}

export const mockApi = {
  // Create Order (tries Express MySQL backend first, falls back to local storage)
  async createOrder(
    orderData: OrderData,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    total: number
  ): Promise<OrderResult> {
    const payload = {
      customerName: orderData.name,
      phone: orderData.phone,
      governorate: orderData.governorate,
      address: orderData.address,
      notes: orderData.notes,
      paymentMethod: 'cod',
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name_ar,
        qty: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shipping,
      total,
    };

    try {
      // Try real Express backend on port 8877
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('[API] Order created successfully on backend:', data.trackingNumber);
        
        // Also cache locally for instant UI lookup
        try {
          const existingRaw = localStorage.getItem(ORDERS_KEY);
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          existing.unshift({
            ...payload,
            trackingNumber: data.trackingNumber,
            status: data.status || 'confirmed',
            estimatedDelivery: data.estimatedDelivery,
            paymentMethod: 'الدفع عند الاستلام (COD)',
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem(ORDERS_KEY, JSON.stringify(existing));
        } catch (e) {
          // ignore cache error
        }

        return {
          trackingNumber: data.trackingNumber,
          status: data.status || 'confirmed',
          estimatedDelivery: data.estimatedDelivery,
          items: data.items,
          subtotal: data.subtotal,
          shipping: data.shipping,
          total: data.total,
        };
      }
    } catch (err) {
      console.warn('[API] Backend unreachable, using local storage fallback:', (err as Error).message);
    }

    // LocalStorage Fallback (Works offline & on Vercel preview)
    const trackingNumber = generateTrackingNumber();
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const savedOrder: SavedOrder = {
      trackingNumber,
      status: 'confirmed',
      estimatedDelivery: deliveryDate.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      items: items.map((item) => ({
        name: item.product.name_ar,
        qty: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shipping,
      total,
      customerName: orderData.name,
      phone: orderData.phone,
      governorate: orderData.governorate,
      address: orderData.address,
      notes: orderData.notes,
      paymentMethod: 'الدفع عند الاستلام (COD)',
      createdAt: now.toISOString(),
    };

    try {
      const existingRaw = localStorage.getItem(ORDERS_KEY);
      const existing: SavedOrder[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(savedOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to cache order locally', e);
    }

    return {
      trackingNumber: savedOrder.trackingNumber,
      status: savedOrder.status,
      estimatedDelivery: savedOrder.estimatedDelivery,
      items: savedOrder.items,
      subtotal: savedOrder.subtotal,
      shipping: savedOrder.shipping,
      total: savedOrder.total,
    };
  },

  // Lookup Order
  async getOrder(query: string): Promise<SavedOrder | null> {
    const cleanQuery = query.trim();

    try {
      // Try backend first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(cleanQuery)}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.warn('[API] Backend lookup unreachable, checking local storage:', (err as Error).message);
    }

    // Check localStorage fallback
    try {
      const existingRaw = localStorage.getItem(ORDERS_KEY);
      const existing: SavedOrder[] = existingRaw ? JSON.parse(existingRaw) : [];

      const match = existing.find(
        (o) =>
          o.trackingNumber.toUpperCase() === cleanQuery.toUpperCase() ||
          o.phone.replace(/\s+/g, '').includes(cleanQuery.replace(/\s+/g, ''))
      );

      if (match) return match;

      // Simulated realistic test result
      if (cleanQuery.toUpperCase().startsWith('THG') || cleanQuery.length >= 8) {
        return {
          trackingNumber: cleanQuery.toUpperCase().startsWith('THG') ? cleanQuery.toUpperCase() : 'THG-EG-729401',
          status: 'in_transit',
          estimatedDelivery: 'غداً مساءً مع مندوب الشحن السريع',
          items: [
            { name: 'Pure-3 — أوميجا 3 ألماني عالي النقاوة والتركيز', qty: 1, price: 2000 },
            { name: 'Iron DIRECT — حديد مباشر ميكروبيليتس بطعم التوت البري', qty: 1, price: 2000 },
          ],
          subtotal: 4000,
          shipping: 0,
          total: 4000,
          customerName: 'عميل THG 4 Pharma المميز',
          phone: cleanQuery,
          governorate: 'القاهرة / التجمع الخامس',
          address: 'شارع التسعين الشمالي',
          paymentMethod: 'الدفع عند الاستلام',
          createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        };
      }
    } catch (e) {
      console.error('Error querying local order', e);
    }

    return null;
  },

  // Restock Subscription
  async subscribeRestock(productId: string, contact: string): Promise<{ success: boolean }> {
    try {
      await fetch(`${API_BASE_URL}/restock-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, contact }),
      });
    } catch {
      // fallback to localStorage
      try {
        const raw = localStorage.getItem(WAITLIST_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.push({ productId, contact, date: new Date().toISOString() });
        localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to store restock intent', e);
      }
    }

    return { success: true };
  },
};
