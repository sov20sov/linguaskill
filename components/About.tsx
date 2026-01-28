
import React from 'react';
import { CONTENT } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-secondary relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16 md:mb-20 lg:mb-24">
          <div className="relative">
            <div className="aspect-[4/3] bg-lightGray dark:bg-darkGray rounded-sm overflow-hidden border-8 border-primary relative z-10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                alt="Linguaskill Environment" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-all"></div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary dark:bg-black -z-10 hidden md:block"></div>
            
            {/* Floating Info Tag */}
            <div className="absolute top-4 left-4 glass-primary text-secondary px-6 py-3 font-extrabold text-xl shadow-lg z-20 rounded-xl">
              18 سبب للتميز
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-primary font-bold text-sm tracking-widest uppercase mb-4">{CONTENT.about.title}</h2>
            <h3 className="text-4xl font-extrabold text-secondary dark:text-white mb-8">{CONTENT.about.subtitle}</h3>
            <p className="text-lg text-darkGray dark:text-gray-300 leading-relaxed mb-10">
              {CONTENT.about.description}
            </p>
            
            <div className="grid gap-6">
              {CONTENT.about.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4 p-6 bg-lightGray dark:bg-darkGray border-r-8 border-secondary dark:border-primary hover:border-primary dark:hover:border-white transition-all duration-300">
                   <div className="text-3xl">✨</div>
                   <div>
                     <h4 className="font-bold text-secondary dark:text-white text-xl mb-1">{feature.title}</h4>
                     <p className="text-darkGray dark:text-gray-400 text-sm">{feature.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Four Pillars Section from Course Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {CONTENT.about.pillars.map((pillar, idx) => (
            <div key={idx} className="text-center p-6 sm:p-8 glass-card border-b-4 border-primary hover:bg-primary/20 hover:text-secondary group transition-all duration-300 rounded-xl">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">{pillar.icon}</div>
              <h4 className="text-lg sm:text-xl font-extrabold mb-2 sm:mb-3 text-secondary dark:text-white">{pillar.title}</h4>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed text-secondary dark:text-gray-300">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
