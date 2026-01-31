/**
 * وحدة مشتركة للتحقق وتعقيم بيانات نموذج التواصل
 * تُستخدم من قبل: server/api/contact.ts (Express) و api/contact.ts (Vercel)
 */

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  telegram: string;
  level: string;
  message: string;
}

/**
 * تنظيف البيانات من أي أكواد خبيثة (XSS)
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/&lt;script/gi, '')
    .replace(/&lt;iframe/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/Function\s*\(/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * التحقق من صحة بيانات النموذج
 */
export function validateContactData(
  data: ContactFormData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('الاسم يجب أن يكون أكثر من حرفين');
  }

  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!data.phone || !phoneRegex.test(data.phone) || data.phone.replace(/\D/g, '').length < 8) {
    errors.push('رقم الهاتف غير صحيح');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('البريد الإلكتروني غير صحيح');
  }

  const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
  if (!data.telegram || !data.telegram.trim()) {
    errors.push('معرف التلجرام مطلوب');
  } else {
    const cleanedTelegram = data.telegram.trim().startsWith('@')
      ? data.telegram.trim()
      : `@${data.telegram.trim()}`;
    if (!telegramRegex.test(cleanedTelegram.replace('@', ''))) {
      errors.push('معرف التلجرام غير صحيح');
    }
  }

  if (!data.level) {
    errors.push('المستوى مطلوب');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('الرسالة يجب أن تكون أكثر من 10 أحرف');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * إنشاء محتوى رسالة البريد (موضوع، HTML، نص)
 */
export function createEmailContent(
  data: ContactFormData
): { subject: string; html: string; text: string } {
  const subject = `طلب تواصل جديد من ${data.fullName} - ${data.level}`;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; }
        .value { padding: 10px; background: #f9f9f9; border-radius: 3px; margin-top: 5px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>طلب تواصل جديد من موقع Linguaskill Institute</h2>
        </div>
        <div class="field">
          <div class="label">الاسم الكامل:</div>
          <div class="value">${data.fullName}</div>
        </div>
        <div class="field">
          <div class="label">رقم الهاتف:</div>
          <div class="value">${data.phone}</div>
        </div>
        <div class="field">
          <div class="label">البريد الإلكتروني:</div>
          <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>
        <div class="field">
          <div class="label">معرف التلجرام:</div>
          <div class="value"><a href="https://t.me/${data.telegram.replace('@', '')}" target="_blank">${data.telegram.startsWith('@') ? data.telegram : '@' + data.telegram}</a></div>
        </div>
        <div class="field">
          <div class="label">المستوى المطلوب:</div>
          <div class="value">${data.level}</div>
        </div>
        <div class="field">
          <div class="label">الرسالة:</div>
          <div class="value">${data.message.replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
        <div class="footer">
          <p>تم إرسال هذه الرسالة تلقائياً من نموذج التواصل في الموقع</p>
          <p>يمكنك الرد مباشرة على: <a href="mailto:${data.email}">${data.email}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
طلب تواصل جديد من موقع Linguaskill Institute

الاسم الكامل: ${data.fullName}
رقم الهاتف: ${data.phone}
البريد الإلكتروني: ${data.email}
معرف التلجرام: ${data.telegram.startsWith('@') ? data.telegram : '@' + data.telegram}
المستوى المطلوب: ${data.level}

الرسالة:
${data.message}

---
يمكنك الرد مباشرة على: ${data.email}
  `;

  return { subject, html, text };
}
