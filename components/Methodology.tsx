
import React from 'react';
import { CONTENT } from '../constants';

const Methodology: React.FC = () => {
  return (
    <section id="methodology" className="py-16 sm:py-20 md:py-24 bg-accent dark:bg-secondary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">لماذا نحن؟</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white mb-6 sm:mb-8">{CONTENT.methodology.title}</h3>
            <div className="w-16 sm:w-20 h-2 bg-primary"></div>
          </div>
          
          <div className="w-full md:w-2/3 grid gap-6 sm:gap-8">
            {CONTENT.methodology.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 sm:gap-6 items-start group">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 glass-primary text-secondary flex items-center justify-center font-bold text-xl sm:text-2xl group-hover:bg-primary group-hover:text-secondary transition-all duration-300 rounded-xl">
                  0{idx + 1}
                </div>
                <div className="text-right border-b border-lightGray dark:border-darkGray pb-4 sm:pb-6 w-full">
                  <h4 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white mb-2">{step.title}</h4>
                  <p className="text-sm sm:text-base text-darkGray dark:text-gray-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
