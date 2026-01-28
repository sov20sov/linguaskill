# 🚀 دليل البدء السريع

## ⚠️ خطأ ECONNREFUSED - الحل السريع

إذا رأيت خطأ `ECONNREFUSED` أو `http proxy error: /api/contact`، هذا يعني أن **Backend غير مشغّل**.

### الحل:

1. **افتح Terminal جديد** (Terminal الثاني)
2. **انتقل إلى مجلد المشروع:**
   ```powershell
   cd K:\linguaskill-institute
   ```

3. **شغّل Backend:**
   ```powershell
   npm run dev:server
   ```

4. **يجب أن ترى:**
   ```
   ✅ Loaded .env from: [مسار]
   🚀 Server is running on port 3001
   ✅ SMTP configured
   ```

5. **الآن جرب النموذج مرة أخرى** - يجب أن يعمل!

---

## 📋 التشغيل الكامل

### Terminal 1 - Frontend:
```powershell
cd K:\linguaskill-institute
npm run dev
```

### Terminal 2 - Backend:
```powershell
cd K:\linguaskill-institute
npm run dev:server
```

---

## ✅ التحقق من أن كل شيء يعمل

1. **Frontend:** http://localhost:3000 ✅
2. **Backend:** يجب أن ترى في Terminal "Server is running on port 3001" ✅
3. **اختبار:** املأ النموذج واضغط "إرسال الطلب" ✅

---

## 🔧 حل المشاكل

### المشكلة: "ECONNREFUSED"
- **السبب:** Backend غير مشغّل
- **الحل:** شغّل `npm run dev:server` في Terminal منفصل

### المشكلة: "SMTP credentials not found"
- **السبب:** ملف `.env` غير موجود أو غير صحيح
- **الحل:** تأكد من وجود `server/.env` مع بيانات SMTP صحيحة

### المشكلة: "Email sending failed"
- **السبب:** App Password خاطئ أو "التحقق بخطوتين" غير مفعّل
- **الحل:** أنشئ App Password جديد من Gmail

---

**ملاحظة:** يجب أن يكون **كلا الخادمين** (Frontend و Backend) يعملان في نفس الوقت!
