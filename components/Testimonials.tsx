
import React, { memo } from 'react';
import { CONTENT } from '../constants';

const Testimonials: React.FC = memo(() => {
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-secondary border-y border-lightGray dark:border-darkGray transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">تجارب الطلبة</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white">ماذا يقول عملاؤنا عن لنجواسكيل؟</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CONTENT.testimonials.map((t) => (
            <div key={t.id} className="group relative glass-card p-1 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
              {/* Star Header Style from Images */}
              <div className="glass-nav p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-primary/20 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-secondary text-xl">
                    L
                  </div>
                  <div className="text-right">
                    <div className="text-white text-xs font-bold uppercase tracking-wider">Client Review</div>
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-[10px] font-mono">ID: {t.id}</div>
              </div>

              {/* Content Body - Chat Style */}
              <div className="p-8 glass-card min-h-[220px] flex flex-col justify-between rounded-b-xl">
                <div>
                  <div className="mb-4 inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                    رسالة موثقة
                  </div>
                  <p className="text-lg text-darkGray dark:text-gray-200 leading-relaxed font-medium">
                    "{t.content}"
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-lightGray dark:border-white/5 pt-6">
                  <div className="flex items-center gap-3">
                  
                    <div className="text-right">
                      <h4 className="font-bold text-secondary dark:text-white text-sm">{t.name}</h4>
                      <span className="text-[10px] text-darkGray dark:text-gray-400 uppercase tracking-widest">{t.role}</span>
                    </div>
                  </div>
                  <div className="text-primary text-xs font-bold italic">
                    Verified Feedback
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Bar from Image Footer */}
        <div className="mt-16 flex flex-col items-center gap-6 opacity-80 hover:opacity-100 transition-all">
          <div className="text-[10px] text-secondary dark:text-gray-400 font-bold tracking-[0.2em] uppercase">
            Linguaskill Development and Training Center
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a 
              href={`tel:${CONTENT.contact.phone}`}
              className="flex items-center gap-2 text-primary font-bold hover:text-secondary dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{CONTENT.contact.phone}</span>
            </a>
            <a 
              href={CONTENT.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-500 font-bold hover:text-green-400 transition-colors glass-card px-4 py-2 rounded-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
