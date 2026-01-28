
import React, { useRef, useState, useEffect } from 'react';
import { CONTENT } from '../constants';
import Particles from './Particles';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [pixelRatio, setPixelRatio] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    // Set pixel ratio safely
    if (typeof window !== 'undefined') {
      setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    // على الأجهزة المحمولة، إظهار/إخفاء عناصر التحكم عند النقر
    if (window.innerWidth < 768) {
      setShowControls(!showControls);
      // إخفاء عناصر التحكم تلقائياً بعد 3 ثوانٍ
      setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
  {/* Particles Background - خلفية الجسيمات */}
  <div className="absolute inset-0 z-0">
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
      pixelRatio={pixelRatio}
      className="opacity-60 dark:opacity-40"
    />
  </div>
  
  {/* Dark overlay for better contrast */}
  <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/20 to-secondary/40 dark:from-black/60 dark:via-black/40 dark:to-black/60 z-[1]"></div>

  {/* المحتوى */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    {/* نستخدم LTR فقط لترتيب الأعمدة */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center lg:[direction:ltr]">

      {/* 🎬 الفيديو – الجهة اليسرى */}
      <div className="flex justify-center lg:justify-start">
        <div 
          className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 group"
          onMouseEnter={() => window.innerWidth >= 768 && setShowControls(true)}
          onMouseLeave={() => window.innerWidth >= 768 && setShowControls(false)}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src="/videos/videoforhero.mp4"
            autoPlay
            loop
            playsInline
            muted={isMuted}
            preload="metadata"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay خفيف */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
          
          {/* Video Controls Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex gap-3 sm:gap-4 items-center" onClick={(e) => e.stopPropagation()}>
              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 glass-card hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg touch-manipulation border border-white/20"
                aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-secondary ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              
              {/* Mute/Unmute Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 glass-card hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg touch-manipulation border border-white/20"
                aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? (
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 النص – RTL */}
      <div className="text-right animate-fade-in lg:[direction:rtl] relative z-10">
        <div className="inline-block py-1.5 px-4 glass-dark text-primary text-xs font-bold uppercase tracking-widest mb-6 rounded-xl">
          معهد تعليمي معتمد
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 text-contrast">
          {CONTENT.hero.headline}
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed max-w-xl mr-auto text-contrast">
          {CONTENT.hero.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
          <a
            href="#contact"
            className="px-8 sm:px-10 py-3 sm:py-4 bg-primary text-secondary font-bold text-base sm:text-lg rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/30 text-center"
          >
            {CONTENT.hero.cta}
          </a>

          <a
            href="#about"
            className="px-8 sm:px-10 py-3 sm:py-4 glass-card border-2 border-white/30 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-white/20 hover:scale-105 transition-all duration-300 text-center"
          >
            {CONTENT.hero.secondaryCta}
          </a>
        </div>
      </div>

    </div>
  </div>

  {/* سهم النزول */}
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
    <svg
      className="w-6 h-6 text-secondary dark:text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>

  );
};

export default Hero;
