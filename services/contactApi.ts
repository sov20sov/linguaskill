/**
 * Contact API Service
 * خدمة API للتواصل مع الخادم لإرسال رسائل التواصل
 */

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  telegram: string;
  level: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * الحصول على رابط الـ API بحسب بيئة التشغيل
 *
 * الأولوية كالتالي:
 * 1) المتغير البيئي VITE_CONTACT_API_URL (يمكنك وضع Backend خارجي مثل Render / Railway)
 * 2) نفس Origin للموقع (مفيد مع Vercel Functions على نفس المشروع)
 */
const getContactApiUrl = (): string => {
  // 1) إذا تم تعريف متغير بيئة صريح للـ API نستخدمه
  const explicitBase =
    (import.meta as any).env?.VITE_CONTACT_API_URL ||
    (typeof process !== 'undefined' &&
      (process as any).env?.VITE_CONTACT_API_URL);

  if (explicitBase && typeof explicitBase === 'string') {
    const base = explicitBase.replace(/\/+$/, '');
    return `${base}/api/contact`;
  }

  // 2) في المتصفح نستخدم نفس الـ origin للموقع (مفيد مع Vercel)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/contact`;
  }

  // 3) كحل أخير نستخدم مسار نسبي (للبيئات الخاصة أو الاختبارات)
  return '/api/contact';
};

/**
 * إرسال بيانات نموذج التواصل إلى الخادم
 * @param formData - بيانات النموذج
 * @returns Promise<ContactResponse>
 */
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  try {
    const url = getContactApiUrl();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // التحقق من نوع الاستجابة
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Unexpected non-JSON response from contact API:', text);

      return {
        success: false,
        message:
          'حدث خطأ في الاتصال بالخادم. يرجى التأكد من إعداد رابط الـ Backend أو Function بشكل صحيح.',
      };
    }

    if (!response.ok) {
      // إذا كان الخطأ بسبب عدم توفر الـ Backend أو الـ Function
      if (
        data?.error === 'ECONNREFUSED' ||
        response.status === 503 ||
        response.status === 404
      ) {
        return {
          success: false,
          message:
            'الخادم غير متاح حالياً أو أن مسار /api/contact غير موجود في بيئة الإنتاج. يرجى التأكد من نشر الـ Backend أو Function بشكل صحيح.',
        };
      }

      return {
        success: false,
        message: data?.message || 'حدث خطأ أثناء الإرسال',
        data,
      };
    }

    return {
      success: true,
      message: data?.message || 'تم الإرسال بنجاح',
      data,
    };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);

    // تحديد نوع الخطأ (مشاكل شبكة غالباً)
    if (
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('NetworkError')
    ) {
      return {
        success: false,
        message:
          'لا يمكن الاتصال بالخادم حالياً. في التطوير تأكد من تشغيل Backend على المنفذ الصحيح، وفي الإنتاج تأكد من إعداد رابط VITE_CONTACT_API_URL أو Function Vercel.',
      };
    }

    return {
      success: false,
      message: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
    };
  }
};
