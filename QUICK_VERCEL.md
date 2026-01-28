# ⚡ دليل سريع - رفع المشروع على Vercel

## 🎯 الخطوات السريعة

### 1. تثبيت المكتبات
```powershell
npm install
```

### 2. إعداد Environment Variables في Vercel

اذهب إلى: **Vercel Dashboard** → **Settings** → **Environment Variables**

أضف:
- `RESEND_API_KEY` = `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- `RESEND_FROM_EMAIL` = `onboarding@resend.dev`
- `CONTACT_RECIPIENT_EMAIL` = `your-email@example.com`

### 3. رفع المشروع

#### من Terminal:
```powershell
npm i -g vercel
vercel login
vercel --prod
```

#### أو من Vercel Dashboard:
1. اذهب إلى https://vercel.com/new
2. اربط مستودع GitHub
3. اضغط Deploy

### 4. ✅ جاهز!

النظام الآن يعمل على Vercel بدون مشاكل!

---

## 📝 ملاحظات

- ✅ Backend يعمل كـ Serverless Function على Vercel
- ✅ لا حاجة لاستضافة منفصلة
- ✅ Frontend و Backend على نفس المنصة
- ✅ إرسال البريد يعمل بشكل موثوق

---

**للمزيد من التفاصيل:** راجع `VERCEL_SETUP.md`
