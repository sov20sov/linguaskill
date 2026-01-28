
import React from 'react';
import { CONTENT } from '../constants';
import SocialLinks from './SocialLinks';

const Footer: React.FC = () => {
  return (
    <footer className="glass-nav text-white py-12 sm:py-16 border-t border-white/10 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2 text-right">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
                <span className="text-secondary font-extrabold text-sm">L</span>
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tighter text-white">
                LINGUASKILL
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 max-w-sm mb-4 sm:mb-6 leading-relaxed">
              لنجواسكيل هي أكاديمية رائدة متخصصة في تطوير مهارات اللغة الإنجليزية بأساليب تعليمية حديثة ومبتكرة.
            </p>
          </div>
          
          <div className="text-right">
            <h5 className="font-bold mb-4 sm:mb-6 text-primary uppercase text-xs sm:text-sm tracking-widest">روابط سريعة</h5>
            <ul className="space-y-3 sm:space-y-4 text-gray-400 text-xs sm:text-sm">
              {CONTENT.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-right">
            <h5 className="font-bold mb-4 sm:mb-6 text-primary uppercase text-xs sm:text-sm tracking-widest">تواصل معنا</h5>
            <ul className="space-y-3 sm:space-y-4 text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
              <li>
                <a href={`tel:${CONTENT.contact.phone}`} className="hover:text-primary transition-colors">
                  {CONTENT.contact.phone}
                </a>
              </li>
              <li className="break-words">{CONTENT.contact.address}</li>
            </ul>
            <div>
              <h6 className="text-xs text-primary uppercase font-bold mb-3">تابعنا</h6>
              <SocialLinks variant="compact" />
            </div>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
          <p>© {new Date().getFullYear()} لنجواسكيل. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
