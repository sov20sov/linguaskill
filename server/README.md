# Backend Server Documentation

## نظرة عامة

هذا الخادم البسيط يتعامل مع طلبات التواصل من الموقع ويقوم بإرسالها عبر البريد الإلكتروني.

## المتطلبات

- Node.js 18+
- npm أو yarn

## التثبيت

```bash
npm install express cors nodemailer
npm install --save-dev @types/express @types/cors @types/nodemailer
```

## الإعداد

1. أنشئ ملف `.env` في مجلد `server/`:

```env
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Recipient Email (where contact form submissions will be sent)
CONTACT_RECIPIENT_EMAIL=recipient@example.com
```

### إعداد Gmail

1. اذهب إلى حساب Google الخاص بك
2. قم بتمكين "التحقق بخطوتين"
3. أنشئ "App Password":
   - اذهب إلى: https://myaccount.google.com/apppasswords
   - اختر "البريد" و "جهاز آخر"
   - استخدم كلمة المرور المولدة في `SMTP_PASS`

## التشغيل

```bash
# Development
npm run dev:server

# Production
npm run build:server
npm start:server
```

## API Endpoints

### POST /api/contact

إرسال نموذج التواصل

**Request Body:**
```json
{
  "fullName": "اسم المستخدم",
  "phone": "05xxxxxxxx",
  "email": "user@example.com",
  "level": "مبتدئ",
  "message": "رسالة المستخدم"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إرسال طلبك بنجاح! سنقوم بالرد عليك قريباً."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "رسالة الخطأ",
  "errors": ["قائمة الأخطاء"]
}
```

## الأمان

- تنظيف البيانات من أي أكواد خبيثة
- التحقق من صحة جميع الحقول
- عدم كشف تفاصيل الأخطاء للمستخدم
- استخدام HTTPS في الإنتاج

## ملاحظات

- تأكد من إعداد متغيرات البيئة بشكل صحيح
- استخدم App Password وليس كلمة المرور العادية
- في الإنتاج، استخدم خدمة SMTP احترافية مثل SendGrid أو Mailgun
