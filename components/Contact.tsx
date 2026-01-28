
import React, { useState } from 'react';
import { CONTENT } from '../constants';
import { submitContactForm, type ContactFormData } from '../services/contactApi';
import SocialLinks from './SocialLinks';

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  telegram?: string;
  level?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    phone: '',
    email: '',
    telegram: '',
    level: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // التحقق من الاسم
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم مطلوب';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'الاسم يجب أن يكون أكثر من حرفين';
    }

    // التحقق من رقم الهاتف
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون صحيحاً';
    }

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    // التحقق من معرف التلجرام
    const telegramRegex = /^[a-zA-Z0-9_]{5,32}$/;
    if (!formData.telegram.trim()) {
      newErrors.telegram = 'معرف التلجرام مطلوب';
    } else {
      const cleanedTelegram = formData.telegram.trim().replace('@', '');
      if (!telegramRegex.test(cleanedTelegram)) {
        newErrors.telegram = 'معرف التلجرام غير صحيح (يجب أن يكون 5-32 حرف، أرقام وحروف فقط)';
      }
    }

    // التحقق من المستوى
    if (!formData.level) {
      newErrors.level = 'المستوى مطلوب';
    }

    // التحقق من الرسالة
    if (!formData.message.trim()) {
      newErrors.message = 'الرسالة مطلوبة';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'الرسالة يجب أن تكون أكثر من 10 أحرف';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تغيير الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // إزالة الخطأ عند البدء بالكتابة
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // إعادة تعيين حالة الإرسال
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  // إرسال البيانات إلى الخادم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('يرجى التحقق من جميع الحقول');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // إرسال البيانات إلى API باستخدام service
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'تم إرسال طلبك بنجاح! سنقوم بالرد عليك قريباً.');
        // إعادة تعيين النموذج
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          telegram: '',
          level: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-secondary dark:bg-black text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Accent */}
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Support Center Callout Inspired by Provided Image */}
        <div className="mb-12 sm:mb-16 md:mb-20 glass-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12">
            <div className="flex-shrink-0 relative">
               <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-secondary text-5xl">
                 🎧
               </div>
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-secondary animate-pulse"></div>
            </div>
            <div className="text-right flex-1">
              <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mb-3 sm:mb-4">{CONTENT.support.headline}</h4>
              <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                {CONTENT.support.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-sm">
                 <div className="glass-card p-4 sm:p-5 border-r-2 border-primary rounded-xl">
                    <p className="font-bold text-white mb-2 text-sm sm:text-base">أول خطوة في رحلتك:</p>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{CONTENT.support.steps}</p>
                 </div>
                 <div className="glass-card p-4 sm:p-5 border-r-2 border-white/20 rounded-xl">
                    <p className="font-bold text-white mb-2 text-sm sm:text-base">ساعات العمل:</p>
                    <p className="text-primary font-bold text-base sm:text-lg">{CONTENT.support.hours}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20">
          <div className="text-right">
            <h2 className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">{CONTENT.contact.title}</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8">ابدأ رحلتك التعليمية اليوم</h3>
            <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10 md:mb-12 leading-relaxed">فريقنا جاهز للإجابة على جميع استفساراتكم حول الدورات، المستويات، وطرق التسجيل.</p>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Phone */}
              <a 
                href={`tel:${CONTENT.contact.phone}`}
                className="flex items-center gap-6 group glass-card p-4 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-primary uppercase font-bold mb-1">اتصل بنا</div>
                  <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">{CONTENT.contact.phone}</div>
                </div>
                <svg className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href={CONTENT.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 group glass-card p-4 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-primary uppercase font-bold mb-1">واتساب</div>
                  <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">{CONTENT.contact.whatsapp}</div>
                </div>
                <svg className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Address */}
              <div className="flex items-start gap-6 glass-card p-4 rounded-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-xl shadow-lg flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-primary uppercase font-bold mb-1">العنوان</div>
                  <div className="text-base sm:text-lg font-bold text-white leading-relaxed">{CONTENT.contact.address}</div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 sm:mt-10">
              <SocialLinks />
            </div>
          </div>
          
          <div className="bg-darkGray dark:bg-secondary p-8 md:p-10 border-b-8 border-primary shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            {/* Status Message */}
            {submitStatus !== 'idle' && (
              <div className={`mb-6 p-4 rounded-sm border-r-4 ${
                submitStatus === 'success' 
                  ? 'bg-green-500/10 border-green-500 text-green-400' 
                  : 'bg-red-500/10 border-red-500 text-red-400'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{submitStatus === 'success' ? '✓' : '✕'}</span>
                  <p className="font-bold">{submitMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    الاسم بالكامل
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full bg-secondary dark:bg-black border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-700'
                    } p-4 focus:border-primary focus:outline-none transition-all duration-300 placeholder-gray-600`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    رقم الجوال
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-secondary dark:bg-black border ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    } p-4 focus:border-primary focus:outline-none transition-all duration-300 placeholder-gray-600`}
                    placeholder="077 or 078"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  البريد الإلكتروني
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-secondary dark:bg-black border ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  } p-4 focus:border-primary focus:outline-none transition-all duration-300 placeholder-gray-600`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  معرف التلجرام
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">@</span>
                  <input 
                    type="text" 
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    className={`w-full bg-secondary dark:bg-black border ${
                      errors.telegram ? 'border-red-500' : 'border-gray-700'
                    } p-4 pr-10 focus:border-primary focus:outline-none transition-all duration-300 placeholder-gray-600`}
                    placeholder="username"
                  />
                </div>
                {errors.telegram && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.telegram}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">يمكنك إدخال المعرف مع @ أو بدونه</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  المستوى المطلوب
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={`w-full bg-secondary dark:bg-black border ${
                      errors.level ? 'border-red-500' : 'border-gray-700'
                    } p-4 focus:border-primary focus:outline-none transition-all duration-300 appearance-none cursor-pointer pr-10`}
                  >
                    <option value="">اختر المستوى</option>
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="متقدم">متقدم</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.level && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.level}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  رسالتك
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  className={`w-full bg-secondary dark:bg-black border ${
                    errors.message ? 'border-red-500' : 'border-gray-700'
                  } p-4 focus:border-primary focus:outline-none transition-all duration-300 placeholder-gray-600 resize-none`}
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.message}
                  </p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 font-bold text-base sm:text-lg md:text-xl uppercase tracking-widest transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-secondary hover:bg-white hover:text-secondary hover:shadow-lg hover:shadow-primary/50 transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </span>
                ) : (
                  'إرسال الطلب'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
