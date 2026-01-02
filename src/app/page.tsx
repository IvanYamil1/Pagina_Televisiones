"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Función de easing para suavizar el movimiento
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Función para scroll suave con animación manual
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.scrollY;
  const headerOffset = 20;
  const targetPosition = absoluteElementTop - headerOffset;

  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

// Función para scroll suave al inicio
const smoothScrollToTop = () => {
  const startPosition = window.scrollY;
  const distance = -startPosition;
  const duration = 1000;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

// Hook para animaciones al hacer scroll
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Hook para contador animado
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

// Componente para número animado
function AnimatedStatNumber({ number, suffix = "", isVisible }: { number: number; suffix?: string; isVisible: boolean }) {
  const count = useCountUp(number, 2000, isVisible);
  return <>{count.toLocaleString()}{suffix}</>;
}

// Datos de refacciones con imágenes
const refaccionesData = [
  {
    name: "Main Board",
    price: "$899",
    desc: "El cerebro de tu TV",
    image: "/imagen1.jpg"
  },
  {
    name: "Fuente de Poder",
    price: "$599",
    desc: "Energía estable",
    image: "/imagen2.webp"
  },
  {
    name: "Tarjeta T-Con",
    price: "$499",
    desc: "Control de imagen",
    image: "/imagen3.jpg"
  },
  {
    name: "Backlight LED",
    price: "$299",
    desc: "Iluminación perfecta",
    image: "/imagen4.avif"
  },
  {
    name: "Panel LCD/LED",
    price: "$1,499",
    desc: "Pantalla completa",
    image: "/imagen5.avif"
  },
  {
    name: "Flex y Cables",
    price: "$149",
    desc: "Conexiones seguras",
    image: "/imagen6.webp"
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showScrollNav, setShowScrollNav] = useState(false);
  const [scrollMenuOpen, setScrollMenuOpen] = useState(false);

  // Detectar scroll para mostrar la barra de navegación
  useEffect(() => {
    const handleScroll = () => {
      // Mostrar la barra después de pasar el hero (aproximadamente 100vh)
      const scrollThreshold = window.innerHeight * 0.8;
      setShowScrollNav(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Controlar el splash screen y animaciones del hero
  useEffect(() => {
    // Prevenir scroll durante el splash
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    }

    const fadeTimer = setTimeout(() => {
      setSplashFading(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      document.body.style.overflow = 'unset';
      // Activar animaciones del hero después del splash
      setTimeout(() => setHeroVisible(true), 100);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = 'unset';
    };
  }, [showSplash]);

  // Refs para animaciones de scroll
  const serviciosAnim = useScrollAnimation();
  const refaccionesAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();
  const contactoAnim = useScrollAnimation();

  // Handler para navegación suave
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    smoothScrollTo(sectionId);
    setMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Splash Screen - Elegant */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-[#030712] flex items-center justify-center transition-all duration-700 ${splashFading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse"></div>

          <div className="text-center relative">
            {/* Small icon above */}
            <div className="mb-6 flex justify-center animate-fade-in">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Main title */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] animate-fade-in text-white/90">
              Electrónica
            </h1>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.3em] text-blue-400/60 mt-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Electrónica
            </p>

            {/* Animated line */}
            <div className="mt-10 flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-loading-bar"></div>
            </div>

            {/* Tagline */}
            <p className="mt-6 text-[10px] tracking-[0.4em] text-white/20 animate-fade-in" style={{ animationDelay: '400ms' }}>
              ESPECIALISTAS EN TV
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in bg-gradient-to-b from-[#030712] via-[#030712]/80 to-transparent">
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); smoothScrollToTop(); }} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-blue-500/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-serif text-xl tracking-wide">Electrónica</span>
            </a>

            {/* Desktop - CTA */}
            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, 'contacto')}
              className="hidden md:flex items-center gap-2 border border-white/20 px-5 py-2 rounded-full text-xs tracking-[0.2em] hover:bg-white/5 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              CONTACTO
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-6 pb-6 border-t border-white/10 pt-6">
              {["Servicios", "Refacciones", "Contacto"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 text-white/60 hover:text-white tracking-[0.2em] text-xs"
                  onClick={(e) => handleNavClick(e, item.toLowerCase())}
                >
                  {item.toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Scroll Navigation Bar - Appears on scroll */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showScrollNav
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); smoothScrollToTop(); }}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-serif text-lg tracking-wide hidden sm:block">Electrónica</span>
              </a>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-8 lg:gap-12">
                {[
                  { name: "Servicios", id: "servicios" },
                  { name: "Refacciones", id: "refacciones" },
                  { name: "Contacto", id: "contacto" }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="relative text-[11px] tracking-[0.2em] text-white/60 hover:text-white transition-all duration-300 py-2 group"
                  >
                    {item.name.toUpperCase()}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                ))}
              </div>

              {/* CTA Button - Desktop */}
              <a
                href="https://wa.me/521234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs tracking-[0.15em] text-blue-400 hover:text-blue-300 transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">WHATSAPP</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setScrollMenuOpen(!scrollMenuOpen)}
                className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {scrollMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrollMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="pt-3 pb-2 border-t border-white/10 mt-3 space-y-1">
                {[
                  { name: "Servicios", id: "servicios" },
                  { name: "Refacciones", id: "refacciones" },
                  { name: "Contacto", id: "contacto" }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { handleNavClick(e, item.id); setScrollMenuOpen(false); }}
                    className="block py-2.5 text-white/60 hover:text-white tracking-[0.2em] text-xs transition-colors"
                  >
                    {item.name.toUpperCase()}
                  </a>
                ))}
                <a
                  href="https://wa.me/521234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2.5 text-blue-400 tracking-[0.15em] text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-all duration-[2s] ${heroVisible ? 'opacity-80 scale-100' : 'opacity-0 scale-105'}`}
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              const fadeTime = 1.5;
              const timeLeft = video.duration - video.currentTime;
              if (timeLeft <= fadeTime) {
                video.style.opacity = String(0.8 * (timeLeft / fadeTime));
              } else if (video.currentTime <= fadeTime) {
                video.style.opacity = String(0.8 * (video.currentTime / fadeTime));
              } else {
                video.style.opacity = '0.8';
              }
            }}
          >
            <source src="/Fondo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-[#030712]/50 to-[#030712]"></div>
          <div className="absolute inset-0 bg-blue-950/5"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <p className={`text-[10px] md:text-xs tracking-[0.4em] text-white/40 mb-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-6 blur-sm'}`}
             style={{ transitionDelay: '200ms' }}>
            ESPECIALISTAS EN REPARACIÓN DE PANTALLAS
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8 sm:mb-10 overflow-hidden">
            <span className={`block transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[120%]'}`}
                  style={{ transitionDelay: '400ms' }}>
              Expertos en el
            </span>
            <em className={`block font-normal transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[120%]'}`}
                style={{ transitionDelay: '650ms' }}>
              futuro visual
            </em>
          </h1>

          {/* Navigation Links */}
          <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-white/50 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
               style={{ transitionDelay: '1000ms' }}>
            <a href="#servicios" onClick={(e) => handleNavClick(e, 'servicios')} className="hover:text-white transition-all duration-300 md:hover:tracking-[0.35em] hover:scale-105">SERVICIOS</a>
            <span className="text-white/20">/</span>
            <a href="#refacciones" onClick={(e) => handleNavClick(e, 'refacciones')} className="hover:text-white transition-all duration-300 md:hover:tracking-[0.35em] hover:scale-105">REFACCIONES</a>
            <span className="text-white/20">/</span>
            <a href="#contacto" onClick={(e) => handleNavClick(e, 'contacto')} className="hover:text-white transition-all duration-300 md:hover:tracking-[0.35em] hover:scale-105">CONTACTO</a>
          </div>
        </div>

        {/* Bottom Text - hidden on mobile */}
        <div className={`hidden sm:block absolute bottom-12 left-0 right-0 px-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 translate-y-6 -translate-x-8'}`}
             style={{ transitionDelay: '1200ms' }}>
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-white/40 max-w-md">
              <span className="text-white/70">Solo excelencia.</span> Soluciones profesionales para pantallas LCD, LED y Plasma.
            </p>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className={`hidden sm:block absolute bottom-12 right-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
             style={{ transitionDelay: '1400ms' }}>
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-[9px] tracking-[0.3em] rotate-90 origin-center translate-x-4">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Transición suave inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent pointer-events-none"></div>
      </section>

      {/* Separador decorativo entre Hero y Servicios */}
      <div className="relative h-24 bg-[#030712] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="w-2 h-2 rounded-full border border-white/20 bg-[#030712] z-10"></div>
      </div>

      {/* Servicios - Circuit Board Design */}
      <section id="servicios" className="min-h-screen px-4 sm:px-6 py-12 sm:py-20 bg-[#030712] relative flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[200px] pointer-events-none"></div>

        {/* Circuit Board Pattern - Left Side */}
        <svg className="hidden md:block absolute left-0 top-0 h-full w-1/3 opacity-[0.04] pointer-events-none" viewBox="0 0 400 800" fill="none" preserveAspectRatio="xMinYMid slice">
          {/* Main vertical traces */}
          <path d="M50 0 V800" stroke="white" strokeWidth="2"/>
          <path d="M120 0 V300 H200 V500 H120 V800" stroke="white" strokeWidth="2"/>
          <path d="M200 0 V200 H280 V400 H200 V600 H280 V800" stroke="white" strokeWidth="2"/>

          {/* Horizontal connections */}
          <path d="M0 150 H50" stroke="white" strokeWidth="2"/>
          <path d="M0 350 H120" stroke="white" strokeWidth="2"/>
          <path d="M0 550 H200" stroke="white" strokeWidth="2"/>
          <path d="M0 750 H50" stroke="white" strokeWidth="2"/>

          {/* Connection nodes */}
          <circle cx="50" cy="150" r="6" fill="white"/>
          <circle cx="120" cy="300" r="6" fill="white"/>
          <circle cx="200" cy="200" r="6" fill="white"/>
          <circle cx="280" cy="400" r="6" fill="white"/>
          <circle cx="120" cy="500" r="6" fill="white"/>
          <circle cx="200" cy="600" r="6" fill="white"/>
          <circle cx="50" cy="750" r="6" fill="white"/>

          {/* IC Chips */}
          <rect x="30" y="400" width="40" height="60" rx="4" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M30 420 H20 M30 440 H20 M70 420 H80 M70 440 H80" stroke="white" strokeWidth="2"/>

          <rect x="160" y="100" width="50" height="70" rx="4" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M160 120 H150 M160 140 H150 M160 160 H150 M210 120 H220 M210 140 H220 M210 160 H220" stroke="white" strokeWidth="2"/>
        </svg>

        {/* Circuit Board Pattern - Right Side */}
        <svg className="hidden md:block absolute right-0 top-0 h-full w-1/3 opacity-[0.04] pointer-events-none" viewBox="0 0 400 800" fill="none" preserveAspectRatio="xMaxYMid slice">
          {/* Main vertical traces */}
          <path d="M350 0 V800" stroke="white" strokeWidth="2"/>
          <path d="M280 0 V250 H200 V450 H280 V800" stroke="white" strokeWidth="2"/>
          <path d="M200 0 V150 H120 V350 H200 V550 H120 V800" stroke="white" strokeWidth="2"/>

          {/* Horizontal connections */}
          <path d="M400 200 H350" stroke="white" strokeWidth="2"/>
          <path d="M400 400 H280" stroke="white" strokeWidth="2"/>
          <path d="M400 600 H200" stroke="white" strokeWidth="2"/>

          {/* Connection nodes */}
          <circle cx="350" cy="200" r="6" fill="white"/>
          <circle cx="280" cy="250" r="6" fill="white"/>
          <circle cx="200" cy="150" r="6" fill="white"/>
          <circle cx="120" cy="350" r="6" fill="white"/>
          <circle cx="280" cy="450" r="6" fill="white"/>
          <circle cx="200" cy="550" r="6" fill="white"/>

          {/* IC Chips */}
          <rect x="330" y="500" width="40" height="60" rx="4" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M330 520 H320 M330 540 H320 M370 520 H380 M370 540 H380" stroke="white" strokeWidth="2"/>

          <rect x="240" y="650" width="50" height="70" rx="4" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M240 670 H230 M240 690 H230 M290 670 H300 M290 690 H300" stroke="white" strokeWidth="2"/>
        </svg>

        <div ref={serviciosAnim.ref} className="max-w-6xl mx-auto w-full relative z-10">
          {/* Header */}
          <div className={`text-center mb-10 sm:mb-16 ${serviciosAnim.isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            <p className={`text-[10px] tracking-[0.4em] text-blue-400/70 mb-4 sm:mb-6 ${serviciosAnim.isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms', animationFillMode: 'both' }}>NUESTROS SERVICIOS</p>
            <div className="overflow-hidden">
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight ${serviciosAnim.isVisible ? 'animate-clip-reveal' : 'opacity-0'}`} style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
                Soluciones<br />
                <em className="font-normal">profesionales</em>
              </h2>
            </div>
          </div>

          {/* Services Grid - TV Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {[
              {
                num: "01",
                title: "Reparación",
                subtitle: "de Pantallas",
                desc: "Diagnóstico y reparación de televisores LCD, LED, OLED y Plasma con garantía.",
              },
              {
                num: "02",
                title: "Venta",
                subtitle: "de Tarjetas",
                desc: "Main boards, fuentes de poder, T-Con y más. Piezas originales y compatibles.",
              },
              {
                num: "03",
                title: "Cambio",
                subtitle: "de Paneles",
                desc: "Reemplazo de paneles dañados con instalación profesional garantizada.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className={`group ${serviciosAnim.isVisible ? 'animate-card-3d' : 'opacity-0'}`}
                style={{ animationDelay: `${800 + i * 250}ms`, animationFillMode: 'both' }}
              >
                {/* Premium TV Frame */}
                <div className="relative group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Ambient glow behind TV */}
                  <div className="absolute -inset-4 bg-gradient-to-b from-blue-400/10 via-blue-500/15 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>

                  {/* TV Body - Premium metal frame */}
                  <div className="relative">
                    {/* Outer frame with metallic gradient - BRIGHTER */}
                    <div className="relative bg-gradient-to-b from-[#4a4a4a] via-[#353535] to-[#252525] rounded-2xl p-[3px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.15)]
                      group-hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7),0_0_80px_rgba(59,130,246,0.25),0_0_0_1px_rgba(59,130,246,0.4)] transition-all duration-500">

                      {/* Metallic highlight on top edge */}
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-2xl"></div>

                      {/* Inner bezel - BRIGHTER */}
                      <div className="relative bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-xl p-[6px] sm:p-2">

                        {/* Bezel inner highlight */}
                        <div className="absolute inset-x-1 top-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Screen container with subtle inner shadow */}
                        <div className="relative rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">

                          {/* The Screen - Brighter */}
                          <div className="relative aspect-video bg-gradient-to-br from-[#101c35] via-[#1a2d50] to-[#0e1a30] p-4 sm:p-6 flex flex-col justify-center overflow-hidden">

                            {/* Screen reflection overlay - brighter */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none"></div>

                            {/* Ambient screen light */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/15 via-blue-400/5 to-cyan-400/10 pointer-events-none"></div>

                            {/* Dynamic scanlines - subtle */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                              style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px)'
                              }}></div>

                            {/* Animated screen glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-blue-400/0 to-cyan-300/0
                              group-hover:from-blue-500/25 group-hover:via-blue-400/15 group-hover:to-cyan-300/15 transition-all duration-700"></div>

                            {/* Subtle vignette - lighter */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)] pointer-events-none"></div>

                            {/* Content */}
                            <div className="relative z-10">
                              {/* Service number with glow */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-blue-400 text-[10px] sm:text-xs tracking-[0.3em] font-light group-hover:text-blue-300 transition-colors">{service.num}</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-400/40 to-transparent group-hover:from-blue-400/70 transition-colors"></div>
                              </div>

                              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-light mb-0.5 text-white group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                                {service.title}
                              </h3>
                              <p className="font-serif text-base sm:text-lg md:text-xl text-blue-200/80 font-light italic mb-2 sm:mb-3 group-hover:text-blue-200 transition-colors">
                                {service.subtitle}
                              </p>
                              <p className="text-white/60 text-[11px] sm:text-xs md:text-sm leading-relaxed group-hover:text-white/80 transition-colors line-clamp-2">
                                {service.desc}
                              </p>
                            </div>

                            {/* Power LED - OFF by default, ON on hover */}
                            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-600 group-hover:bg-green-400
                                shadow-none group-hover:shadow-[0_0_12px_rgba(74,222,128,0.9)] transition-all duration-500"></div>
                            </div>

                            {/* Corner accents - brighter */}
                            <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white/15 rounded-tl group-hover:border-blue-400/50 transition-colors"></div>
                            <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white/15 rounded-tr group-hover:border-blue-400/50 transition-colors"></div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom bezel with brand indicator */}
                      <div className="h-3 sm:h-4 flex items-center justify-center gap-2 relative">
                        {/* Center logo/sensor area */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                          <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 rounded-full"></div>
                          <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Stand - Neck */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-3 sm:w-4 h-4 sm:h-6 bg-gradient-to-b from-[#3a3a3a] to-[#252525] mx-auto"></div>
                        {/* Stand reflection */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
                      </div>
                    </div>

                    {/* Premium Stand - Base */}
                    <div className="flex justify-center">
                      <div className="relative w-24 sm:w-32 h-1.5 sm:h-2 bg-gradient-to-b from-[#404040] to-[#252525] rounded-full
                        shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA below TV */}
                <div className="mt-5 sm:mt-6 text-center">
                  <a href="#contacto" onClick={(e) => handleNavClick(e, 'contacto')}
                    className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] text-white/40 hover:text-blue-400 transition-all duration-300 group-hover:text-white/60
                      px-4 py-2 rounded-full border border-transparent hover:border-blue-500/30 hover:bg-blue-500/5">
                    SOLICITAR
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className={`mt-10 sm:mt-16 flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-20 ${serviciosAnim.isVisible ? 'animate-wave-entrance' : 'opacity-0'}`} style={{ animationDelay: '1600ms', animationFillMode: 'both' }}>
            {[
              { num: 15, suffix: '+', label: 'AÑOS' },
              { num: 5000, suffix: '+', label: 'REPARACIONES' },
              { num: 98, suffix: '%', label: 'SATISFACCIÓN' }
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center ${serviciosAnim.isVisible ? 'animate-elastic-pop' : 'opacity-0'}`}
                style={{ animationDelay: `${1900 + i * 200}ms`, animationFillMode: 'both' }}
              >
                <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white/80 mb-1">
                  {serviciosAnim.isVisible && <AnimatedStatNumber number={stat.num} suffix={stat.suffix} isVisible={serviciosAnim.isVisible} />}
                </div>
                <div className="text-white/30 text-[10px] sm:text-xs tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas - Enhanced */}
      <section className="py-10 bg-gradient-to-b from-[#030712] via-[#050d18] to-[#030712] border-y border-white/5 overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee */}
        <div className="flex animate-marquee whitespace-nowrap">
          {["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Sharp", "Vizio", "Panasonic", "Toshiba", "Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Sharp", "Vizio", "Panasonic", "Toshiba"].map((marca, i) => (
            <div key={i} className="mx-8 flex items-center gap-3 group">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/30"></span>
              <span className="text-sm tracking-[0.25em] text-white/30 group-hover:text-white/50 transition-colors">
                {marca.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Refacciones - Bento Grid Design */}
      <section id="refacciones" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#030712] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Animated particles - hidden on mobile */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-1 h-1 bg-blue-400/40 rounded-full animate-float"></div>
          <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-[30%] w-1 h-1 bg-blue-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Circuit pattern decoration - hidden on mobile */}
        <div className="hidden sm:block absolute top-10 left-10 opacity-[0.03] pointer-events-none">
          <svg width="150" height="150" viewBox="0 0 200 200">
            <path d="M10 100 H90 V50 H150" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M10 150 H60 V100 H120 V150 H180" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="90" cy="50" r="4" fill="white"/>
            <circle cx="120" cy="100" r="4" fill="white"/>
          </svg>
        </div>

        <div ref={refaccionesAnim.ref} className="max-w-5xl mx-auto w-full relative z-10">
          {/* Header */}
          <div className={`text-center mb-8 sm:mb-10 ${refaccionesAnim.isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            <p className={`text-[10px] tracking-[0.4em] text-indigo-400/70 mb-3 sm:mb-4 ${refaccionesAnim.isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms', animationFillMode: 'both' }}>REFACCIONES</p>
            <div className="overflow-hidden">
              <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-2 sm:mb-3 ${refaccionesAnim.isVisible ? 'animate-text-reveal' : 'opacity-0'}`} style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                Componentes <em className="font-normal">originales</em>
              </h2>
            </div>
            <p className={`text-white/40 text-xs sm:text-sm max-w-md mx-auto px-4 ${refaccionesAnim.isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
              Cada pieza es el corazón de tu televisión
            </p>
          </div>

          {/* Bento Grid - Compact with Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {refaccionesData.map((item, index) => (
              <div
                key={index}
                className={`group relative rounded-xl overflow-hidden
                  ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                  ${refaccionesAnim.isVisible ? 'animate-zoom-reveal' : 'opacity-0'}`}
                style={{ animationDelay: `${900 + index * 150}ms`, animationFillMode: 'both' }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent"></div>
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-colors duration-500"></div>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-indigo-500/40 transition-colors duration-500"></div>

                {/* Content */}
                <div className={`relative p-3 sm:p-4 md:p-5 h-full flex flex-col justify-end ${index === 0 ? 'md:p-7 min-h-[200px] sm:min-h-[280px] md:min-h-[320px]' : 'min-h-[140px] sm:min-h-[160px] md:min-h-[180px]'}`}>
                  {/* Text */}
                  <div>
                    <h3 className={`font-serif font-light mb-0.5 sm:mb-1 group-hover:text-white transition-colors
                      ${index === 0 ? 'text-base sm:text-xl md:text-2xl' : 'text-sm sm:text-base md:text-lg'}`}>
                      {item.name}
                    </h3>
                    <p className={`text-white/40 group-hover:text-white/60 transition-colors hidden sm:block
                      ${index === 0 ? 'text-xs md:text-sm' : 'text-[11px] md:text-xs'}`}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-2 sm:mt-3 flex items-end justify-between">
                    <div>
                      <span className="text-white/30 text-[8px] sm:text-[9px] tracking-[0.2em] block mb-0.5">DESDE</span>
                      <div className={`font-serif font-light text-white/90 group-hover:text-white transition-colors
                        ${index === 0 ? 'text-lg sm:text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl'}`}>
                        {item.price}
                      </div>
                    </div>
                    <a
                      href="#contacto"
                      onClick={(e) => handleNavClick(e, 'contacto')}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center
                        text-white/60 group-hover:text-white group-hover:border-indigo-500/50 group-hover:bg-indigo-500/30
                        transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info - Badges style */}
          <div className={`mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${refaccionesAnim.isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '1800ms', animationFillMode: 'both' }}>
            {[
              { text: 'GARANTÍA 6 MESES', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { text: 'ENVÍOS NACIONAL', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
              { text: 'PIEZAS CERTIFICADAS', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' }
            ].map((badge, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white/40 text-[8px] sm:text-[10px] tracking-[0.1em]
                  hover:border-indigo-500/30 hover:text-white/60 transition-colors ${refaccionesAnim.isVisible ? 'animate-stagger-up' : 'opacity-0'}`}
                style={{ animationDelay: `${2000 + i * 180}ms`, animationFillMode: 'both' }}
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                </svg>
                <span className="hidden sm:inline">{badge.text}</span>
                <span className="sm:hidden">{badge.text.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal Banner */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-r from-[#030712] via-[#0a1220] to-[#030712] border-y border-white/5 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div ref={ctaAnim.ref} className="max-w-5xl mx-auto">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 ${ctaAnim.isVisible ? 'animate-glow-entrance' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
            {/* Left - Text */}
            <div className="text-center md:text-left">
              <p className="text-[9px] sm:text-[10px] tracking-[0.3em] text-white/30 mb-1 sm:mb-2">DIAGNÓSTICO GRATUITO</p>
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-light">
                ¿Tu TV tiene <em className="font-normal">problemas</em>?
              </h2>
            </div>

            {/* Right - CTA Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://wa.me/521234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs tracking-[0.15em] hover:bg-white hover:text-[#030712] transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WHATSAPP
              </a>

              <a
                href="tel:+521234567890"
                className="text-white/50 hover:text-white text-[10px] sm:text-xs tracking-[0.15em] transition-colors"
              >
                123 456 7890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto - Dynamic Design */}
      <section id="contacto" className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 bg-[#030712] relative overflow-hidden flex items-center">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none"></div>

        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute top-20 left-10 w-20 h-20 border border-white/5 rounded-full pointer-events-none"></div>
        <div className="hidden sm:block absolute bottom-20 right-10 w-32 h-32 border border-white/5 rounded-full pointer-events-none"></div>
        <div className="hidden sm:block absolute top-1/2 right-20 w-1 h-1 bg-emerald-400/50 rounded-full animate-pulse pointer-events-none"></div>

        <div ref={contactoAnim.ref} className="max-w-6xl mx-auto relative w-full">
          {/* Header */}
          <div className={`text-center mb-6 sm:mb-10 ${contactoAnim.isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            <p className={`text-[10px] tracking-[0.4em] text-emerald-400/70 mb-2 sm:mb-4 ${contactoAnim.isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms', animationFillMode: 'both' }}>CONTACTO</p>
            <div className="overflow-hidden">
              <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight ${contactoAnim.isVisible ? 'animate-clip-reveal' : 'opacity-0'}`} style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
                Estamos aquí<br />
                <em className="font-normal">para ayudarte</em>
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Contact Info - Left Side */}
            <div className={`${contactoAnim.isVisible ? 'animate-reveal-left' : 'opacity-0'}`} style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
              {/* Info Cards */}
              <div className="space-y-2 sm:space-y-3">
                {/* Location Card */}
                <div className={`group relative p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-500 ${contactoAnim.isVisible ? 'animate-stagger-up' : 'opacity-0'}`} style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/30 mb-1">UBICACIÓN</p>
                      <h3 className="font-serif text-base sm:text-lg font-light mb-0.5">Guadalajara Centro</h3>
                      <p className="text-white/40 text-xs">Jalisco, México</p>
                    </div>
                  </div>
                </div>

                {/* Hours Card */}
                <div className={`group relative p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-500 ${contactoAnim.isVisible ? 'animate-stagger-up' : 'opacity-0'}`} style={{ animationDelay: '1100ms', animationFillMode: 'both' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/30 mb-1">HORARIO</p>
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">Lunes - Viernes</span>
                          <span className="text-white/80 font-light">9:00 - 19:00</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">Sábado</span>
                          <span className="text-white/80 font-light">10:00 - 14:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className={`grid grid-cols-2 gap-2 sm:gap-3 pt-1 ${contactoAnim.isVisible ? 'animate-stagger-up' : 'opacity-0'}`} style={{ animationDelay: '1300ms', animationFillMode: 'both' }}>
                  <a
                    href="tel:+521234567890"
                    className="group relative p-2.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-500 text-center"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <p className="text-[8px] sm:text-[9px] tracking-[0.2em] text-white/30 mb-0.5">TELÉFONO</p>
                    <span className="font-serif text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">123 456 7890</span>
                  </a>

                  <a
                    href="https://wa.me/521234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-500 text-center"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <p className="text-[8px] sm:text-[9px] tracking-[0.2em] text-white/30 mb-0.5">WHATSAPP</p>
                    <span className="font-serif text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">123 456 7890</span>
                  </a>
                </div>

                {/* Map */}
                <div className={`mt-2 rounded-2xl overflow-hidden border border-white/5 ${contactoAnim.isVisible ? 'animate-zoom-reveal' : 'opacity-0'}`} style={{ animationDelay: '1500ms', animationFillMode: 'both' }}>
                  <div className="relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.9397774711454!2d-103.34897032394045!3d20.676476980891693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1f6b3a3c3c1%3A0x3a3a3a3a3a3a3a3a!2sGuadalajara%20Centro%2C%20Guadalajara%2C%20Jal.!5e0!3m2!1ses!2smx!4v1703000000000!5m2!1ses!2smx"
                      width="100%"
                      height="140"
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    ></iframe>
                    {/* Map overlay for click to open */}
                    <a
                      href="https://maps.google.com/?q=Guadalajara+Centro,+Jalisco,+Mexico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-800 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Abrir en Google Maps
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Right Side */}
            <div className={`${contactoAnim.isVisible ? 'animate-reveal-right' : 'opacity-0'}`} style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
              <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                {/* Form glow effect */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <form className="relative space-y-3 sm:space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="group">
                      <label className="block text-[9px] sm:text-[10px] tracking-[0.2em] text-white/40 mb-1.5 sm:mb-2 group-focus-within:text-emerald-400/70 transition-colors">NOMBRE</label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[9px] sm:text-[10px] tracking-[0.2em] text-white/40 mb-1.5 sm:mb-2 group-focus-within:text-emerald-400/70 transition-colors">TELÉFONO</label>
                      <input
                        type="tel"
                        placeholder="10 dígitos"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] tracking-[0.2em] text-white/40 mb-1.5 sm:mb-2">SERVICIO</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Reparación', 'Tarjeta', 'Panel', 'Otro'].map((option) => (
                        <label key={option} className="relative cursor-pointer">
                          <input type="radio" name="servicio" value={option.toLowerCase()} className="peer sr-only" />
                          <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-white/10 bg-white/[0.02] text-white/40 text-[10px] sm:text-xs tracking-[0.1em]
                            peer-checked:border-emerald-500/50 peer-checked:bg-emerald-500/10 peer-checked:text-emerald-400
                            hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer">
                            {option.toUpperCase()}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[9px] sm:text-[10px] tracking-[0.2em] text-white/40 mb-1.5 sm:mb-2 group-focus-within:text-emerald-400/70 transition-colors">MENSAJE</label>
                    <textarea
                      rows={2}
                      placeholder="Describe el problema: marca, modelo, síntomas..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs tracking-[0.2em] text-white font-medium
                      hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/20"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      ENVIAR MENSAJE
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 sm:py-12 px-4 sm:px-8 bg-[#030712] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            {/* Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); smoothScrollToTop(); }} className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-blue-500/50 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-serif text-lg sm:text-xl tracking-wide">Electrónica</span>
            </a>

            {/* Copyright */}
            <p className="text-[10px] sm:text-xs text-white/30 tracking-[0.1em] text-center order-last md:order-none">
              © 2024 ELECTRÓNICA — GDL, JAL.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-5 sm:gap-6">
              <a
                href="https://wa.me/521234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="tel:+521234567890"
                className="text-white/30 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
