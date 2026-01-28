
import React from 'react';
import { CONTENT } from '../constants';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-secondary relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 items-center mb-16 sm:mb-20 md:mb-24">
          <div className="lg:col-span-1 text-right">
            <h2 className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">التميز في سوق العمل</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white mb-4 sm:mb-6 leading-tight">تدريس اللغات كمهنة واعدة</h3>
            <p className="text-base sm:text-lg text-darkGray dark:text-gray-300 leading-relaxed">نعدك لتكون رائداً في مجال اللغات، سواء كنت تطمح للتدريس أو الترجمة أو صناعة المحتوى.</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CONTENT.careers.map((career, idx) => (
              <div key={idx} className="glass-card p-5 sm:p-6 border-b-4 border-primary hover:bg-primary/20 hover:text-secondary transition-all duration-300 text-secondary dark:text-white rounded-xl hover:scale-105">
                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">{career.title}</h4>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed">{career.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-secondary dark:text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">فوائد تتجاوز مجرد كلمات</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white">لماذا لنجواسكيل؟</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CONTENT.reasons.map((reason, idx) => (
            <div key={idx} className="p-6 sm:p-8 glass-card border border-white/20 rounded-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">{reason.icon}</div>
              <h4 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white mb-3 sm:mb-4">{reason.title}</h4>
              <p className="text-sm sm:text-base text-darkGray dark:text-gray-300 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center glass-nav p-8 sm:p-10 md:p-12 text-white border-t-8 border-primary rounded-2xl">
          <div className="md:col-span-1 text-center md:text-right">
             <h4 className="text-2xl sm:text-3xl font-extrabold text-primary mb-3 sm:mb-4">النجاح في الاختبارات العالمية</h4>
             <p className="text-sm sm:text-base text-gray-400 leading-relaxed">نؤهلك لاجتياز أهم الاختبارات الدولية لفتح آفاقك العالمية.</p>
          </div>
          {CONTENT.exams.map((exam, idx) => (
            <div key={idx} className="border-r-0 md:border-r border-white/10 pr-0 md:pr-8 text-center md:text-right">
               <h5 className="text-lg sm:text-xl font-bold text-white mb-2">{exam.title}</h5>
               <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{exam.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
