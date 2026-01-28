/**
 * Validation utilities
 * أدوات التحقق من صحة البيانات
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleaned.length >= 8;
};

export const validateTelegram = (telegram: string): boolean => {
  const telegramRegex = /^[a-zA-Z0-9_]{5,32}$/;
  const cleaned = telegram.trim().replace('@', '');
  return telegramRegex.test(cleaned);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateMessage = (message: string): boolean => {
  return message.trim().length >= 10;
};
