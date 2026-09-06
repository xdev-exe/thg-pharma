import { OrderData, OrderResult, CartItem } from '../types';
import { generateTrackingNumber } from './utils';

const ORDERS_KEY = 'thg_pharma_orders_v1';
const WAITLIST_KEY = 'thg_pharma_waitlist_v1';

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
  // Create Order
  async createOrder(
    orderData: OrderData,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    total: number
  ): Promise<OrderResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 900));

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

    // Save to localStorage
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
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const existingRaw = localStorage.getItem(ORDERS_KEY);
      const existing: SavedOrder[] = existingRaw ? JSON.parse(existingRaw) : [];

      const cleanQuery = query.trim().toUpperCase();
      const match = existing.find(
        (o) =>
          o.trackingNumber.toUpperCase() === cleanQuery ||
          o.phone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
      );

      if (match) return match;

      // If simulated query like THG-EG-123456 or a valid format, return a realistic simulated order
      if (cleanQuery.startsWith('THG') || query.length >= 8) {
        return {
          trackingNumber: cleanQuery.startsWith('THG') ? cleanQuery : `THG-EG-729401`,
          status: 'in_transit',
          estimatedDelivery: 'غداً مساءً مع مندوب الشحن السريع',
          items: [
            { name: 'Pure-3 — أوميجا 3 ألماني عالي النقاوة والتركيز', qty: 1, price: 2000 },
            { name: 'Iron DIRECT — حديد مباشر ميكروبيليتس بطعم التوت البري', qty: 1, price: 2000 }
          ],
          subtotal: 4000,
          shipping: 0,
          total: 4000,
          customerName: 'عميل THG المميز',
          phone: query,
          governorate: 'القاهرة / التجمع الخامس',
          address: 'شارع التسعين الشمالي',
          paymentMethod: 'الدفع عند الاستلام',
          createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        };
      }
    } catch (e) {
      console.error('Error querying order', e);
    }

    return null;
  },

  // Restock Subscription
  async subscribeRestock(productId: string, contact: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const raw = localStorage.getItem(WAITLIST_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push({ productId, contact, date: new Date().toISOString() });
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to store restock intent', e);
    }

    return { success: true };
  },
};
