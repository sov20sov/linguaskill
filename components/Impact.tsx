
import React from 'react';
import { CONTENT } from '../constants';

const Impact: React.FC = () => {
  return (
    <section id="impact" className="py-16 sm:py-20 md:py-24 bg-accent dark:bg-secondary border-b border-lightGray dark:border-darkGray overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">أرقام وإنجازات</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white">زيادة قيمة سيرتك الذاتية ودخلك</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* CV Section */}
          <div className="glass-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border-t-8 border-secondary dark:border-white">
            <h4 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-secondary dark:text-white border-b border-lightGray dark:border-white/10 pb-3 sm:pb-4">تعزيز السيرة الذاتية</h4>
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {CONTENT.impact.cvStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 sm:gap-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-primary w-20 sm:w-24 flex-shrink-0">{stat.value}</div>
                  <div className="text-right flex-1">
                    <div className="font-bold text-base sm:text-lg text-secondary dark:text-white mb-1">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-darkGray dark:text-gray-400 leading-relaxed">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Section */}
          <div className="glass-nav p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border-t-8 border-primary text-white">
            <h4 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-primary border-b border-white/10 pb-3 sm:pb-4">تطور الدخل والترقية</h4>
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {CONTENT.impact.incomeStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 sm:gap-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary w-20 sm:w-24 flex-shrink-0">{stat.value}</div>
                  <div className="text-right flex-1">
                    <div className="font-bold text-base sm:text-lg text-white mb-1">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
