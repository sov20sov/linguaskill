# 🚀 دليل إعداد Vercel

## نظرة عامة

تم تحديث النظام ليعمل على **Vercel** باستخدام Serverless Functions. هذا يعني أن Backend و Frontend يعملان على نفس المنصة بدون حاجة لاستضافة منفصلة.

---

## ✅ ما تم إنجازه

1. ✅ إنشاء Vercel Serverless Function (`api/contact.ts`)
2. ✅ تحديث `vite.config.ts` للعمل مع Vercel
3. ✅ إنشاء `vercel.json` للإعدادات
4. ✅ تحديث `package.json` بإضافة المكتبات المطلوبة

---

## 📋 الخطوات المطلوبة

### الخطوة 1: تثبيت المكتبات

```powershell
npm install
```

هذا سيقوم بتثبيت:
- `@vercel/node` - لتشغيل Serverless Functions
- `@vercel/static-build` - لبناء المشروع

---

### الخطوة 2: إعداد Environment Variables في Vercel

#### أ. اذهب إلى Vercel Dashboard

1. سجل دخول إلى: https://vercel.com
2. اختر مشروعك (أو أنشئ مشروع جديد)
3. اذهب إلى **Settings** → **Environment Variables**

#### ب. أضف المتغيرات التالية:

اضغط **"Add New"** وأضف كل متغير:

**1. RESEND_API_KEY**
- **Name:** `RESEND_API_KEY`
- **Value:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (API Key من Resend)
- **Environment:** Production, Preview, Development (اختر الكل)

**2. RESEND_FROM_EMAIL**
- **Name:** `RESEND_FROM_EMAIL`
- **Value:** `onboarding@resend.dev` (أو بريدك المحدد)
- **Environment:** Production, Preview, Development

**3. CONTACT_RECIPIENT_EMAIL**
- **Name:** `CONTACT_RECIPIENT_EMAIL`
- **Value:** `your-email@example.com` (البريد الذي تريد استقبال الرسائل عليه)
- **Environment:** Production, Preview, Development

---

### الخطوة 3: رفع المشروع على Vercel

#### الطريقة الأولى: من Vercel Dashboard

1. اذهب إلى: https://vercel.com/new
2. اربط مستودع GitHub/GitLab/Bitbucket
3. اختر المشروع
4. Vercel سيكتشف الإعدادات تلقائياً
5. اضغط **"Deploy"**

#### الطريقة الثانية: من Terminal

```powershell
# تثبيت Vercel CLI (مرة واحدة فقط)
npm i -g vercel

# تسجيل الدخول
vercel login

# رفع المشروع
vercel

# للإنتاج
vercel --prod
```

---

### الخطوة 4: التحقق من الإعداد

بعد الرفع:

1. اذهب إلى **Deployments** في Vercel Dashboard
2. اضغط على آخر deployment
3. اذهب إلى **Functions** → **api/contact**
4. تحقق من أن Function يعمل بدون أخطاء

---

### الخطوة 5: اختبار النظام

1. اذهب إلى رابط المشروع على Vercel (مثل: `https://your-project.vercel.app`)
2. املأ نموذج التواصل
3. اضغط "إرسال الطلب"
4. تحقق من البريد الإلكتروني - يجب أن تصل الرسالة!

---

## 🔧 الإعدادات المتقدمة

### تحديث vercel.json (اختياري)

إذا كنت تريد تخصيص الإعدادات، يمكنك تعديل `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/contact.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/contact",
      "dest": "/api/contact.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

---

## 🐛 حل المشاكل

### المشكلة: "Function not found" أو "404"

**الحل:**
1. تأكد من وجود ملف `api/contact.ts` في الجذر
2. تأكد من أن `vercel.json` موجود وصحيح
3. أعد الرفع مرة أخرى

### المشكلة: "Environment variable not found"

**الحل:**
1. اذهب إلى Vercel Dashboard → Settings → Environment Variables
2. تأكد من إضافة جميع المتغيرات المطلوبة
3. تأكد من تحديد البيئات الصحيحة (Production, Preview, Development)
4. أعد الرفع بعد إضافة المتغيرات

### المشكلة: "Resend API Key missing"

**الحل:**
1. تحقق من `RESEND_API_KEY` في Environment Variables
2. تأكد من نسخ المفتاح بشكل صحيح
3. أعد الرفع بعد التحديث

### المشكلة: الرسائل لا تصل

**الحل:**
1. تحقق من Vercel Dashboard → Functions → api/contact → Logs
2. ابحث عن أخطاء في الـ logs
3. تحقق من Resend Dashboard لمعرفة حالة الرسائل
4. تأكد من أن `RESEND_FROM_EMAIL` و `CONTACT_RECIPIENT_EMAIL` صحيحة

---

## 📊 مراقبة الأداء

### في Vercel Dashboard:

1. **Deployments:** رؤية جميع الرفعات
2. **Functions:** رؤية جميع Serverless Functions
3. **Logs:** رؤية logs في الوقت الفعلي
4. **Analytics:** إحصائيات الاستخدام

### في Resend Dashboard:

1. **Emails:** رؤية جميع الرسائل المرسلة
2. **Analytics:** إحصائيات التسليم والفتح
3. **Logs:** تفاصيل كل رسالة

---

## 🔄 التطوير المحلي

### للتطوير المحلي:

1. **شغّل Frontend:**
   ```powershell
   npm run dev
   ```

2. **شغّل Backend (اختياري - للتطوير فقط):**
   ```powershell
   npm run dev:server
   ```

   **ملاحظة:** في التطوير المحلي، Frontend سيستخدم proxy للاتصال بـ Backend المحلي. على Vercel، سيستخدم `/api/contact` مباشرة.

---

## 📝 ملاحظات مهمة

1. **Environment Variables:**
   - لا تضع قيم حساسة في الكود
   - استخدم Environment Variables في Vercel
   - لا ترفع ملف `.env` إلى Git

2. **البناء:**
   - Vercel سيقوم ببناء المشروع تلقائياً
   - تأكد من أن `build` script في `package.json` يعمل

3. **الملفات المهمة:**
   - `api/contact.ts` - Serverless Function
   - `vercel.json` - إعدادات Vercel
   - `.env.local` - متغيرات البيئة المحلية (لا ترفعه)

---

## 🎉 النتيجة

بعد اتباع الخطوات:

- ✅ Frontend يعمل على Vercel
- ✅ Backend يعمل كـ Serverless Function على Vercel
- ✅ لا حاجة لاستضافة منفصلة
- ✅ كل شيء على نفس المنصة
- ✅ إرسال بريد إلكتروني يعمل بشكل موثوق

---

## 📞 الدعم

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Support:** support@vercel.com
- **Resend Documentation:** https://resend.com/docs

---

**تم بنجاح! 🚀**

النظام الآن جاهز للعمل على Vercel بدون مشاكل!
