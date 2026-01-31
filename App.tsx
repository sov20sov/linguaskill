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

const SectionFallback = () => <div className="min-h-[320px]" aria-hidden="true" />;

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Impact />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Courses />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Methodology />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
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
