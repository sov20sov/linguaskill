/**
 * Backend Server
 * خادم Backend بسيط لمعالجة طلبات API
 * 
 * هذا الخادم يتعامل مع:
 * - استقبال طلبات التواصل
 * - التحقق من البيانات
 * - إرسال البريد الإلكتروني
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { handleContactSubmission } from './api/contact';

// الحصول على __dirname في ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// تحميل متغيرات البيئة من ملف .env في مجلد server
// نحاول عدة مسارات محتملة
const possiblePaths = [
  path.join(__dirname, '.env'),           // نفس المجلد
  path.join(process.cwd(), 'server', '.env'), // من جذر المشروع
  path.join(process.cwd(), '.env'),        // من جذر المشروع مباشرة
];

let envLoaded = false;
for (const envPath of possiblePaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`✅ Loaded .env from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  // محاولة أخيرة بدون مسار محدد (سيبحث في جذر المشروع)
  dotenv.config();
  console.warn(`⚠️  Using default .env location`);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting - منع الإرسال العشوائي
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 طلبات كحد أقصى
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح. يرجى المحاولة مرة أخرى بعد 15 دقيقة.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Contact form endpoint with rate limiting
app.post('/api/contact', contactLimiter, handleContactSubmission);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 Current working directory: ${process.cwd()}`);
  console.log(`📍 Server directory: ${__dirname}\n`);
  
  // التحقق من وجود بيانات SMTP
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (smtpUser && smtpPass) {
    console.log(`✅ SMTP configured:`);
    console.log(`   User: ${smtpUser}`);
    console.log(`   Pass: ${smtpPass.substring(0, 4)}**** (hidden)`);
    console.log(`   Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
    console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
    console.log(`📧 Emails will be sent to: ${process.env.CONTACT_RECIPIENT_EMAIL || smtpUser}\n`);
  } else {
    console.error(`\n❌ ERROR: SMTP credentials not found!`);
    console.error(`   SMTP_USER: ${smtpUser ? '✅ Set' : '❌ Missing'}`);
    console.error(`   SMTP_PASS: ${smtpPass ? '✅ Set' : '❌ Missing'}`);
    console.error(`   Please check server/.env file\n`);
  }
});
