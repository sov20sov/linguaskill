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
 * إرسال بيانات نموذج التواصل إلى الخادم
 * @param formData - بيانات النموذج
 * @returns Promise<ContactResponse>
 */
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  try {
    const response = await fetch('/api/contact', {
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
      return {
        success: false,
        message: 'حدث خطأ في الاتصال بالخادم. يرجى التأكد من تشغيل Backend.',
      };
    }

    if (!response.ok) {
      // إذا كان الخطأ بسبب عدم تشغيل Backend
      if (data.error === 'ECONNREFUSED' || response.status === 503 || response.status === 404) {
        return {
          success: false,
          message: 'الخادم غير متاح حالياً. يرجى التأكد من تشغيل Backend.',
        };
      }
      
      return {
        success: false,
        message: data.message || 'حدث خطأ أثناء الإرسال',
        data: data,
      };
    }

    return {
      success: true,
      message: data.message || 'تم الإرسال بنجاح',
      data: data,
    };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    
    // تحديد نوع الخطأ
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      return {
        success: false,
        message: 'لا يمكن الاتصال بالخادم. يرجى التأكد من تشغيل Backend على port 3001.',
      };
    }
    
    return {
      success: false,
      message: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
    };
  }
};
