
import React from 'react';
import { CONTENT } from '../constants';

const Courses: React.FC = () => {
  return (
    <section id="languages" className="py-16 sm:py-20 md:py-24 bg-secondary text-white overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">لغاتنا وتخصصاتنا</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold mb-3 sm:mb-4">اختر لغتك المفضلة</h3>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">نقدم دورات متخصصة في 8 لغات عالمية بمسارات تعليمية مدروسة تناسب تطلعاتك الشخصية والمهنية.</p>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20 md:mb-24">
          {CONTENT.languages.map((lang, idx) => (
            <div key={idx} className="p-4 sm:p-6 glass-card border border-white/10 hover:border-primary transition-all duration-300 group text-center rounded-xl hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 grayscale group-hover:grayscale-0 transition-all">{lang.icon}</div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{lang.name}</h4>
              <p className="text-[10px] sm:text-xs text-white/70 line-clamp-2 leading-relaxed">{lang.desc}</p>
            </div>
          ))}
        </div>

        {/* Course Types Tracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
          {CONTENT.courseTypes.map((type, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 sm:p-8 rounded-xl border-t-4 border-transparent hover:border-primary transition-all duration-300 group hover:scale-105"
            >
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-primary">0{idx + 1}</div>
              <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{type.title}</h4>
              <p className="text-white/80 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">{type.desc}</p>
             
            </div>
          ))}
        </div>

        {/* Skills Summary Banner */}
        <div className="bg-primary p-8 sm:p-10 md:p-12 rounded-sm text-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10">
            <svg className="w-24 h-24 sm:w-32 sm:h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-right">
            <div className="flex-1">
              <h4 className="text-2xl sm:text-3xl font-extrabold mb-2">تطوير المهارات اللغوية المتكاملة</h4>
              <p className="text-base sm:text-lg opacity-80">نركز على المهارات الأربع الأساسية لضمان الإتقان الكامل والتواصل بطلاقة</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {CONTENT.skills.map((skill, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">
                  <span className="text-xl sm:text-2xl mb-1">{skill.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold">{skill.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
