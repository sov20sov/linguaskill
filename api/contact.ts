/**
 * Vercel Serverless Function - Contact Form API
 * نقطة نهاية API لمعالجة طلبات التواصل على Vercel — يستخدم الوحدة المشتركة للتحقق والتعقيم
 * يتضمن Rate Limit ورؤوس أمان (مطابق لسلوك Express في الإنتاج)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import type { ContactFormData } from '../utils/contact-validation';
import {
  sanitizeInput,
  validateContactData,
  createEmailContent,
} from '../utils/contact-validation';

/** نافذة Rate Limit: 15 دقيقة، حد 5 طلبات (مطابق لـ server/index.ts) */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0]?.trim() ?? 'unknown';
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp;
  return (req.socket?.remoteAddress as string) ?? 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  if (now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true };
}

function setSecurityHeaders(res: VercelResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
}

/**
 * معالج طلبات Vercel Serverless Function
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setSecurityHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'الطريقة غير مسموحة',
    });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfter ?? 900));
    return res.status(429).json({
      success: false,
      message: 'تم تجاوز الحد المسموح. يرجى المحاولة مرة أخرى بعد 15 دقيقة.',
    });
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
      reply_to: cleanedData.email,
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
