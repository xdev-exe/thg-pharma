import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEGP(amount: number, lang: 'ar' | 'en' = 'ar'): string {
  const formattedNumber = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
    maximumFractionDigits: 0,
  }).format(amount);

  return lang === 'ar' ? `${formattedNumber} ج.م` : `${formattedNumber} EGP`;
}

export function isValidEgyptianPhone(phone: string): boolean {
  // Accepts: 01012345678, 011..., 012..., 015..., or +201..., 201...
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const egyptianPhoneRegex = /^(010|011|012|015)[0-9]{8}$|^(\+?20)(10|11|12|15)[0-9]{8}$/;
  return egyptianPhoneRegex.test(cleaned);
}

export function normalizeEgyptianPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+20')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('20') && cleaned.length === 12) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
}

export function generateTrackingNumber(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `THG-EG-${randomDigits}`;
}
