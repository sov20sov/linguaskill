/**
 * Contact API Endpoint
 * نقطة نهاية API لمعالجة طلبات التواصل
 * 
 * هذا الملف يحتوي على منطق معالجة البيانات وإرسال البريد الإلكتروني
 */

import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

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
 * إعداد مرسل البريد الإلكتروني
 */
const createTransporter = () => {
  // التحقق من وجود بيانات SMTP
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP credentials are missing. Please check your .env file.');
  }

  const transporterConfig: any = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser.trim(), // بريد الإرسال
      pass: smtpPass.trim(), // كلمة مرور البريد أو App Password
    },
    tls: {
      // لا ترفض الاتصالات غير المصرح بها
      rejectUnauthorized: false
    }
  };

  // إضافة خيارات إضافية لـ Gmail
  if (smtpHost.includes('gmail.com')) {
    transporterConfig.service = 'gmail';
  }

  console.log(`🔧 Creating SMTP transporter with:`);
  console.log(`   Host: ${smtpHost}`);
  console.log(`   Port: ${smtpPort}`);
  console.log(`   User: ${smtpUser.trim()}`);
  console.log(`   Secure: ${transporterConfig.secure}`);

  return nodemailer.createTransport(transporterConfig);
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
 * معالج طلبات POST لنموذج التواصل
 */
export const handleContactSubmission = async (req: Request, res: Response) => {
  try {
    // التحقق من نوع الطلب
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'الطريقة غير مسموحة',
      });
    }

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

    // التحقق من وجود بيانات SMTP قبل المحاولة
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP credentials missing!');
      console.error('   SMTP_USER:', process.env.SMTP_USER ? '✅' : '❌');
      console.error('   SMTP_PASS:', process.env.SMTP_PASS ? '✅' : '❌');
      throw new Error('SMTP configuration is incomplete. Please check server/.env file');
    }

    // إعداد البريد الإلكتروني
    const transporter = createTransporter();
    
    // التحقق من صحة الاتصال (اختياري - يمكن إزالته في الإنتاج)
    try {
      await transporter.verify();
      console.log(`✅ SMTP connection verified successfully`);
    } catch (verifyError: any) {
      console.error(`❌ SMTP verification failed:`, verifyError.message);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }
    
    const emailContent = createEmailContent(cleanedData);
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || process.env.SMTP_USER;

    console.log(`📧 Attempting to send email to: ${recipientEmail}`);
    console.log(`   From: ${process.env.SMTP_USER}`);

    // إرسال البريد الإلكتروني
    const info = await transporter.sendMail({
      from: `"Linguaskill Institute" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: cleanedData.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);

    // إرسال رد نجاح
    res.status(200).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سنقوم بالرد عليك قريباً.',
    });
  } catch (error: any) {
    console.error('❌ Error processing contact form:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    // رسائل خطأ أكثر تفصيلاً في الـ console للمطور
    if (error.code === 'EAUTH') {
      console.error('   🔐 Authentication failed!');
      console.error('   Please check:');
      console.error('   1. SMTP_USER is correct:', process.env.SMTP_USER);
      console.error('   2. SMTP_PASS is correct (App Password, not regular password)');
      console.error('   3. 2-Step Verification is enabled on Gmail');
      console.error('   4. App Password was generated correctly');
    } else if (error.code === 'ECONNECTION') {
      console.error('   🌐 Connection failed!');
      console.error('   Please check your internet connection and SMTP settings');
    }
    
    // عدم كشف تفاصيل الخطأ للمستخدم
    let userMessage = 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.';
    
    if (error.message && error.message.includes('SMTP')) {
      userMessage = 'خطأ في إعدادات البريد الإلكتروني. يرجى التواصل مع الدعم الفني.';
    }
    
    res.status(500).json({
      success: false,
      message: userMessage,
    });
  }
};
