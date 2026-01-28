import React, { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// Lazy load components below the fold for better performance
const About = lazy(() => import('./components/About'));
const Features = lazy(() => import('./components/Features'));
const Impact = lazy(() => import('./components/Impact'));
const Courses = lazy(() => import('./components/Courses'));
const Methodology = lazy(() => import('./components/Methodology'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<LoadingFallback />}>
          <About />
          <Features />
          <Impact />
          <Courses />
          <Methodology />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
