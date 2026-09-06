import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Product, CartItem, ModalType, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: (ar: string, en: string) => string;

  // Modals & Navigation
  activeModal: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  openProductDetails: (p: Product) => void;
  openRestockAlert: (p: Product) => void;

  // Cart
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  promoCode: string;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  total: number;

  // Filter & Search
  selectedCategory: ProductCategory;
  setSelectedCategory: (c: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredProducts: Product[];

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'thg_cart_v1';
const LANG_STORAGE_KEY = 'thg_lang_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language (default to Arabic for Egypt)
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ar';
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem(LANG_STORAGE_KEY, l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Modals
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openModal = (type: ModalType) => setActiveModal(type);
  const closeModal = () => {
    setActiveModal(null);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveModal('product');
  };

  const openRestockAlert = (product: Product) => {
    setSelectedProduct(product);
    setActiveModal('restock');
  };

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) {
      openRestockAlert(product);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(
      lang === 'ar'
        ? `تمت إضافة ${product.name_ar} إلى السلة 🛍️`
        : `Added ${product.name_en} to your bag 🛍️`,
      'success'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Promo code engine
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const applyPromo = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'THG10' || clean === 'WELCOME10' || clean === 'HEALTH10') {
      setPromoCode(clean);
      setDiscountPercent(0.10);
      showToast(
        lang === 'ar'
          ? 'تم تطبيق خصم 10% بنجاح! 🎉'
          : '10% discount applied successfully! 🎉',
        'success'
      );
      return true;
    } else {
      showToast(
        lang === 'ar' ? 'كود الخصم غير صحيح أو منتهي' : 'Invalid or expired promo code',
        'error'
      );
      return false;
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  const discount = Math.round(subtotal * discountPercent);
  const total = subtotal - discount;

  // Filtering and search
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.tags.includes(selectedCategory);

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name_ar.toLowerCase().includes(query) ||
      p.name_en.toLowerCase().includes(query) ||
      p.shortDesc_ar.toLowerCase().includes(query) ||
      p.shortDesc_en.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        activeModal,
        openModal,
        closeModal,
        selectedProduct,
        setSelectedProduct,
        openProductDetails,
        openRestockAlert,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        promoCode,
        applyPromo,
        removePromo,
        total,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
