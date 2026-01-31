/**
 * Contact API Endpoint (Express)
 * نقطة نهاية API لمعالجة طلبات التواصل — يستخدم الوحدة المشتركة للتحقق والتعقيم
 */

import type { Request, Response } from 'express';
import { Resend } from 'resend';
import type { ContactFormData } from '../../utils/contact-validation';
import {
  sanitizeInput,
  validateContactData,
  createEmailContent,
} from '../../utils/contact-validation';

/**
 * إعداد عميل Resend لإرسال البريد الإلكتروني
 */
const createResendClient = () => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.CONTACT_RECIPIENT_EMAIL;

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is missing. Please check your .env file.');
  }

  if (!fromEmail) {
    throw new Error('RESEND_FROM_EMAIL or CONTACT_RECIPIENT_EMAIL is missing. Please check your .env file.');
  }

  console.log(`🔧 Creating Resend client`);
  console.log(`   From Email: ${fromEmail}`);

  return new Resend(resendApiKey);
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

    // التحقق من وجود بيانات Resend قبل المحاولة
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ Resend API key missing!');
      console.error('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅' : '❌');
      throw new Error('Resend configuration is incomplete. Please check server/.env file');
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.CONTACT_RECIPIENT_EMAIL;
    if (!fromEmail) {
      console.error('❌ From email missing!');
      console.error('   RESEND_FROM_EMAIL or CONTACT_RECIPIENT_EMAIL is required');
      throw new Error('From email is missing. Please set RESEND_FROM_EMAIL or CONTACT_RECIPIENT_EMAIL in .env file');
    }

    // إعداد عميل Resend
    const resend = createResendClient();
    
    const emailContent = createEmailContent(cleanedData);
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;

    if (!recipientEmail) {
      throw new Error('CONTACT_RECIPIENT_EMAIL is missing. Please check your .env file');
    }

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
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`✅ Email sent successfully! Message ID: ${data?.id}`);

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
    if (error.message?.includes('RESEND_API_KEY')) {
      console.error('   🔑 Resend API Key missing!');
      console.error('   Please check:');
      console.error('   1. RESEND_API_KEY is set in server/.env');
      console.error('   2. API key is correct and active');
      console.error('   3. Domain is verified in Resend dashboard');
    } else if (error.message?.includes('From email')) {
      console.error('   📧 From email configuration error!');
      console.error('   Please check:');
      console.error('   1. RESEND_FROM_EMAIL is set in server/.env');
      console.error('   2. Email domain is verified in Resend');
    } else if (error.message?.includes('Resend')) {
      console.error('   📬 Resend service error!');
      console.error('   Please check your Resend dashboard for more details');
    }
    
    // عدم كشف تفاصيل الخطأ للمستخدم
    let userMessage = 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.';
    
    if (error.message && error.message.includes('Resend')) {
      userMessage = 'خطأ في إعدادات البريد الإلكتروني. يرجى التواصل مع الدعم الفني.';
    }
    
    res.status(500).json({
      success: false,
      message: userMessage,
    });
  }
};
