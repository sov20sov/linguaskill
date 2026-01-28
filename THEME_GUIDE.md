# دليل الثيم الموحد - Unified Theme Guide

## نظرة عامة
هذا الدليل يوضح كيفية استخدام الثيم الموحد والتأثيرات الزجاجية في المشروع.

## التأثيرات الزجاجية (Glass Effects)

### Classes المتاحة:

#### 1. `.glass`
تأثير زجاجي أساسي - خلفية شفافة مع blur
```html
<div className="glass">محتوى</div>
```

#### 2. `.glass-dark`
تأثير زجاجي داكن - مناسب للخلفيات الداكنة
```html
<div className="glass-dark">محتوى</div>
```

#### 3. `.glass-primary`
تأثير زجاجي بلون Primary - مع لمسة من اللون الأساسي
```html
<div className="glass-primary">محتوى</div>
```

#### 4. `.glass-nav`
تأثير زجاجي للشريط العلوي - مع blur قوي
```html
<nav className="glass-nav">...</nav>
```

#### 5. `.glass-card`
تأثير زجاجي للبطاقات - مناسب للعناصر التفاعلية
```html
<div className="glass-card">بطاقة</div>
```

## مكون Particles

### الاستخدام الأساسي:
```tsx
import Particles from './components/Particles';

<Particles
  particleCount={300}
  particleSpread={12}
  speed={0.15}
  particleColors={['#ffffff', '#ffffff', '#ffffff']}
  moveParticlesOnHover={true}
  particleHoverFactor={2}
  alphaParticles={true}
  particleBaseSize={80}
  sizeRandomness={0.8}
  cameraDistance={20}
  disableRotation={false}
  pixelRatio={Math.min(window.devicePixelRatio, 2)}
/>
```

### الخصائص:
- `particleCount`: عدد الجسيمات (افتراضي: 200)
- `particleSpread`: انتشار الجسيمات (افتراضي: 10)
- `speed`: سرعة الحركة (افتراضي: 0.1)
- `particleColors`: مصفوفة الألوان
- `moveParticlesOnHover`: تحريك الجسيمات عند التمرير
- `alphaParticles`: استخدام الشفافية
- `particleBaseSize`: حجم الجسيمات الأساسي
- `sizeRandomness`: عشوائية الحجم
- `cameraDistance`: مسافة الكاميرا
- `disableRotation`: تعطيل الدوران
- `pixelRatio`: نسبة البكسل

## الألوان الموحدة

### الألوان الأساسية:
- `primary`: #D6F200 (أخضر فاتح)
- `secondary`: #111111 (أسود)
- `accent`: #FFFFFF (أبيض)
- `darkGray`: #2B2B2B
- `lightGray`: #E5E5E5

### استخدام الألوان:
```tsx
// في Tailwind
className="bg-primary text-secondary"
className="text-primary"
className="border-primary"
```

## أفضل الممارسات

### 1. استخدام Glass Effect:
- استخدم `.glass-card` للبطاقات والعناصر التفاعلية
- استخدم `.glass-nav` للشريط العلوي
- استخدم `.glass-dark` على الخلفيات الداكنة
- استخدم `.glass-primary` للتمييز

### 2. استخدام Particles:
- استخدم كخلفية في Hero section
- اضبط `opacity` حسب الحاجة للتباين
- استخدم `alphaParticles={true}` للحصول على تأثير أنعم
- اضبط `particleCount` حسب الأداء المطلوب

### 3. التباين والقراءة:
- استخدم `.text-contrast` للنصوص على خلفيات معقدة
- تأكد من وجود تباين كافٍ بين النص والخلفية
- استخدم overlays داكنة عند الحاجة

## أمثلة

### بطاقة زجاجية:
```tsx
<div className="glass-card p-6 rounded-xl">
  <h3 className="text-white">عنوان</h3>
  <p className="text-white/80">محتوى</p>
</div>
```

### Hero Section مع Particles:
```tsx
<section className="relative min-h-screen">
  <div className="absolute inset-0 z-0">
    <Particles
      particleCount={300}
      alphaParticles={true}
      moveParticlesOnHover={true}
    />
  </div>
  <div className="relative z-10">
    {/* المحتوى */}
  </div>
</section>
```

### Navigation Bar زجاجي:
```tsx
<nav className="glass-nav fixed top-0 left-0 right-0 z-50">
  {/* محتوى الشريط */}
</nav>
```

## ملاحظات مهمة

1. **الأداء**: استخدم `pixelRatio` بحكمة لتجنب مشاكل الأداء
2. **التباين**: تأكد دائماً من وجود تباين كافٍ للقراءة
3. **الاستجابة**: جميع التأثيرات متجاوبة تلقائياً
4. **Dark Mode**: التأثيرات تعمل بشكل جيد في كلا الوضعين

## الدعم

للمزيد من المعلومات، راجع:
- `styles/theme.ts` - ملف الثيم الموحد
- `components/Particles.tsx` - مكون الجسيمات
- `index.html` - CSS للـ glass effects
