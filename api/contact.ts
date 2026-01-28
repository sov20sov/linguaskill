/**
 * Vercel Serverless Function - Contact Form API
 * نقطة نهاية API لمعالجة طلبات التواصل على Vercel
 * 
 * هذا الملف يعمل كـ Serverless Function على Vercel
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  telegram: string;
  level: string;
  message: string;
}

/**
 * تنظيف البيانات من أي أكواد خبيثة
 */
const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    // إزالة جميع tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // إزالة جميع attributes الخطيرة
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // إزالة javascript: و data: URLs الخطيرة
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    // تنظيف HTML entities
    .replace(/&lt;script/gi, '')
    .replace(/&lt;iframe/gi, '')
    // إزالة أي محاولة لاستخدام eval أو Function
    .replace(/eval\s*\(/gi, '')
    .replace(/Function\s*\(/gi, '')
    // إزالة HTML tags المتبقية
    .replace(/<[^>]+>/g, '')
    // تنظيف المسافات الزائدة
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * التحقق من صحة البيانات
 */
const validateContactData = (data: ContactFormData): { valid: boolean; errors: string[] } => {
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

  // التحقق من معرف التلجرام
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
};

/**
 * إنشاء محتوى رسالة البريد الإلكتروني
 */
const createEmailContent = (data: ContactFormData): { subject: string; html: string; text: string } => {
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
};

/**
 * معالج طلبات Vercel Serverless Function
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'الطريقة غير مسموحة',
    });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // معالجة OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // استخراج البيانات
    const rawData: ContactFormData = req.body;

    // تنظيف البيانات
    let telegram = sanitizeInput(rawData.telegram || '');
    // التأكد من أن Telegram يبدأ بـ @
    if (telegram && !telegram.startsWith('@')) {
      telegram = '@' + telegram;
    }
    
    const cleanedData: ContactFormData = {
      fullName: sanitizeInput(rawData.fullName || ''),
      phone: sanitizeInput(rawData.phone || ''),
      email: sanitizeInput(rawData.email || ''),
      telegram: telegram,
      level: sanitizeInput(rawData.level || ''),
      message: sanitizeInput(rawData.message || ''),
    };

    // التحقق من صحة البيانات
    const validation = validateContactData(cleanedData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join('، '),
        errors: validation.errors,
      });
    }

    // التحقق من وجود بيانات Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.CONTACT_RECIPIENT_EMAIL;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;

    if (!resendApiKey) {
      console.error('❌ Resend API key missing!');
      return res.status(500).json({
        success: false,
        message: 'خطأ في إعدادات الخادم. يرجى التواصل مع الدعم الفني.',
      });
    }

    if (!fromEmail) {
      console.error('❌ From email missing!');
      return res.status(500).json({
        success: false,
        message: 'خطأ في إعدادات الخادم. يرجى التواصل مع الدعم الفني.',
      });
    }

    if (!recipientEmail) {
      console.error('❌ Recipient email missing!');
      return res.status(500).json({
        success: false,
        message: 'خطأ في إعدادات الخادم. يرجى التواصل مع الدعم الفني.',
      });
    }

    // إعداد عميل Resend
    const resend = new Resend(resendApiKey);
    
    const emailContent = createEmailContent(cleanedData);

    console.log(`📧 Attempting to send email using Resend`);
    console.log(`   From: ${fromEmail}`);
    console.log(`   To: ${recipientEmail}`);

    // إرسال البريد الإلكتروني باستخدام Resend
    const { data, error } = await resend.emails.send({
      from: `Linguaskill Institute <${fromEmail}>`,
      to: recipientEmail,
      replyTo: cleanedData.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى لاحقاً.',
      });
    }

    console.log(`✅ Email sent successfully! Message ID: ${data?.id}`);

    // إرسال رد نجاح
    return res.status(200).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سنقوم بالرد عليك قريباً.',
    });
  } catch (error: any) {
    console.error('❌ Error processing contact form:', error);
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.',
    });
  }
}
