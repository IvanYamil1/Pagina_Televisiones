"use client";

import { useState, useEffect, useRef } from "react";

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

// Datos de refacciones
const refaccionesData = [
  { name: "Main Board", price: "$899", desc: "Tarjetas principales" },
  { name: "Fuente de Poder", price: "$599", desc: "Power supply boards" },
  { name: "Tarjeta T-Con", price: "$499", desc: "Timing controllers" },
  { name: "Backlight LED", price: "$299", desc: "Retroiluminación" },
  { name: "Panel LCD/LED", price: "$1,499", desc: "Paneles completos" },
  { name: "Flex y Cables", price: "$149", desc: "LVDS y ribbons" },
  { name: "Inverter Board", price: "$399", desc: "Placas inversoras" },
  { name: "Control Remoto", price: "$199", desc: "Universales y originales" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Splash Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center transition-opacity duration-500 ${splashFading ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* Logo animado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-blue-500/20 animate-ping-slow"></div>
            </div>

            {/* Logo principal */}
            <div className="relative w-16 h-16 rounded-full border border-blue-500/50 flex items-center justify-center animate-scale-in">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Nombre */}
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide mb-2 animate-fade-in-up delay-300">
            El Azul
          </h1>

          {/* Subtítulo */}
          <p className="text-white/40 text-xs tracking-[0.3em] animate-fade-in-up delay-500">
            ELECTRÓNICA
          </p>

          {/* Barra de carga */}
          <div className="mt-12 w-32 h-px bg-white/10 overflow-hidden">
            <div className="h-full bg-blue-500/50 animate-loading-bar"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
        <nav className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-blue-500/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-serif text-xl tracking-wide">El Azul</span>
            </a>

            {/* Desktop - CTA */}
            <a
              href="#contacto"
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
                  onClick={() => setMenuOpen(false)}
                >
                  {item.toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Hero - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop"
            alt="Background"
            className={`w-full h-full object-cover transition-all duration-[2s] ${heroVisible ? 'opacity-30 scale-100' : 'opacity-0 scale-105'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#030712]/40 to-[#030712]"></div>
          <div className="absolute inset-0 bg-blue-950/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className={`text-[10px] md:text-xs tracking-[0.4em] text-white/40 mb-8 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
             style={{ transitionDelay: '200ms' }}>
            ESPECIALISTAS EN REPARACIÓN DE PANTALLAS
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-10 overflow-hidden">
            <span className={`block transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
                  style={{ transitionDelay: '400ms' }}>
              Expertos en el
            </span>
            <em className={`block font-normal transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
                style={{ transitionDelay: '600ms' }}>
              futuro visual
            </em>
          </h1>

          {/* Navigation Links */}
          <div className={`flex items-center justify-center gap-6 md:gap-10 text-[10px] md:text-xs tracking-[0.25em] text-white/50 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ transitionDelay: '900ms' }}>
            <a href="#servicios" className="hover:text-white transition-colors duration-300 hover:tracking-[0.35em]">SERVICIOS</a>
            <span className="text-white/20">/</span>
            <a href="#refacciones" className="hover:text-white transition-colors duration-300 hover:tracking-[0.35em]">REFACCIONES</a>
            <span className="text-white/20">/</span>
            <a href="#contacto" className="hover:text-white transition-colors duration-300 hover:tracking-[0.35em]">CONTACTO</a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className={`absolute bottom-12 left-0 right-0 px-8 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
             style={{ transitionDelay: '1100ms' }}>
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-white/40 max-w-md">
              <span className="text-white/70">Solo excelencia.</span> Soluciones profesionales para pantallas LCD, LED y Plasma.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-12 right-8 transition-all duration-700 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}
             style={{ transitionDelay: '1300ms' }}>
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-[9px] tracking-[0.3em] rotate-90 origin-center translate-x-4">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Servicios - Minimal Design */}
      <section id="servicios" className="min-h-screen px-6 py-20 bg-[#030712] relative flex items-center">
        <div ref={serviciosAnim.ref} className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${serviciosAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-6">NUESTROS SERVICIOS</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              Soluciones<br />
              <em className="font-normal">profesionales</em>
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
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
                className={`group bg-[#030712] p-8 md:p-10 transition-all duration-700 hover:bg-white/[0.02] ${serviciosAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="text-white/10 text-sm tracking-wider">{service.num}</span>
                <h3 className="font-serif text-2xl md:text-3xl font-light mt-6 mb-1">
                  {service.title}
                </h3>
                <p className="font-serif text-xl md:text-2xl text-white/40 font-light italic mb-6">
                  {service.subtitle}
                </p>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  {service.desc}
                </p>
                <a href="#contacto" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors group-hover:text-white/70">
                  SOLICITAR
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className={`mt-16 flex flex-wrap justify-center gap-12 md:gap-20 transition-all duration-700 delay-500 ${serviciosAnim.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {[
              { number: "15+", label: "Años" },
              { number: "5,000+", label: "Reparaciones" },
              { number: "98%", label: "Satisfacción" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-3xl md:text-4xl font-light text-white/80 mb-1">
                  {stat.number}
                </div>
                <div className="text-white/30 text-xs tracking-[0.2em]">{stat.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas - Minimal */}
      <section className="py-8 bg-[#030712] border-y border-white/5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Sharp", "Vizio", "Panasonic", "Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Sharp", "Vizio", "Panasonic"].map((marca, i) => (
            <span key={i} className="mx-10 text-sm tracking-[0.2em] text-white/20">
              {marca.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* Refacciones - Infinite Marquee Carousel */}
      <section id="refacciones" className="min-h-screen py-20 bg-[#030712] relative overflow-hidden flex items-center">
        <div ref={refaccionesAnim.ref} className="w-full relative">
          {/* Header */}
          <div className={`max-w-6xl mx-auto px-6 text-center mb-16 transition-all duration-700 ${refaccionesAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-6">REFACCIONES</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4">
              Componentes<br />
              <em className="font-normal">originales</em>
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Piezas certificadas con garantía de 6 meses
            </p>
          </div>

          {/* Infinite Carousel Container */}
          <div className={`relative transition-all duration-700 ${refaccionesAnim.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Track */}
            <div className="flex overflow-hidden">
              <div className="flex animate-carousel-scroll">
                {/* First set of items */}
                {refaccionesData.map((item, index) => (
                  <div
                    key={`first-${index}`}
                    className="group flex-shrink-0 w-[280px] md:w-[320px]"
                  >
                    <div className="h-full bg-[#030712] p-8 mx-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500">
                      <span className="text-white/10 text-xs tracking-wider">
                        0{index + 1}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-light mt-6 mb-1 group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-white/30 text-sm mb-8">
                        {item.desc}
                      </p>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-white/30 text-[10px] tracking-[0.2em]">DESDE</span>
                          <div className="font-serif text-2xl font-light text-white/80 group-hover:text-white transition-colors">
                            {item.price}
                          </div>
                        </div>
                        <a
                          href="#contacto"
                          className="text-white/20 group-hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {refaccionesData.map((item, index) => (
                  <div
                    key={`second-${index}`}
                    className="group flex-shrink-0 w-[280px] md:w-[320px]"
                  >
                    <div className="h-full bg-[#030712] p-8 mx-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500">
                      <span className="text-white/10 text-xs tracking-wider">
                        0{index + 1}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-light mt-6 mb-1 group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-white/30 text-sm mb-8">
                        {item.desc}
                      </p>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-white/30 text-[10px] tracking-[0.2em]">DESDE</span>
                          <div className="font-serif text-2xl font-light text-white/80 group-hover:text-white transition-colors">
                            {item.price}
                          </div>
                        </div>
                        <a
                          href="#contacto"
                          className="text-white/20 group-hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className={`max-w-6xl mx-auto px-6 mt-16 flex flex-wrap items-center justify-center gap-8 text-white/30 text-xs tracking-[0.15em] transition-all duration-700 ${refaccionesAnim.isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <span>GARANTÍA 6 MESES</span>
            <span className="text-white/10">/</span>
            <span>ENVÍOS A TODO MÉXICO</span>
            <span className="text-white/10">/</span>
            <span>PIEZAS CERTIFICADAS</span>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="min-h-screen px-6 py-20 bg-[#030712] relative overflow-hidden flex items-center border-y border-white/5">
        <div ref={ctaAnim.ref} className="max-w-4xl mx-auto relative w-full">
          <div className={`text-center transition-all duration-700 ${ctaAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-8">DIAGNÓSTICO GRATUITO</p>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light leading-tight mb-6">
              ¿Tu TV tiene<br />
              <em className="font-normal">problemas</em>?
            </h2>

            <p className="text-white/40 text-sm md:text-base max-w-lg mx-auto mb-12">
              Más de 15 años de experiencia nos respaldan. Presupuesto sin compromiso y garantía en todos nuestros trabajos.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-200 ${ctaAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href="https://wa.me/5213314101313"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full text-sm tracking-[0.1em] hover:bg-white hover:text-[#030712] transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WHATSAPP
              </a>

              <a
                href="tel:+523330303082"
                className="group inline-flex items-center gap-3 text-white/50 hover:text-white text-sm tracking-[0.1em] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                33 3030 3082
              </a>
            </div>

            {/* Trust indicators */}
            <div className={`mt-16 flex flex-wrap items-center justify-center gap-8 text-white/30 text-xs tracking-[0.15em] transition-all duration-700 delay-400 ${ctaAnim.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <span>+500 RESEÑAS</span>
              <span className="text-white/10">/</span>
              <span>3 MESES GARANTÍA</span>
              <span className="text-white/10">/</span>
              <span>RESPUESTA INMEDIATA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto - Minimal Design */}
      <section id="contacto" className="min-h-screen px-6 py-20 bg-[#030712] relative overflow-hidden flex items-center">
        <div ref={contactoAnim.ref} className="max-w-6xl mx-auto relative w-full">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${contactoAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-6">CONTACTO</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              Estamos aquí<br />
              <em className="font-normal">para ayudarte</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info - Left Side */}
            <div className={`transition-all duration-700 delay-200 ${contactoAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              {/* Location */}
              <div className="mb-12">
                <p className="text-[10px] tracking-[0.3em] text-white/30 mb-4">UBICACIÓN</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light mb-2">
                  Guadalajara Centro
                </h3>
                <p className="text-white/40 text-sm">Jalisco, México</p>
              </div>

              {/* Hours */}
              <div className="mb-12">
                <p className="text-[10px] tracking-[0.3em] text-white/30 mb-4">HORARIO</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Lunes - Viernes</span>
                    <span className="text-white/80">9:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Sábado</span>
                    <span className="text-white/80">10:00 - 14:00</span>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div>
                <p className="text-[10px] tracking-[0.3em] text-white/30 mb-4">CONTACTO DIRECTO</p>
                <div className="space-y-4">
                  <a
                    href="tel:+523330303082"
                    className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-serif text-xl">33 3030 3082</span>
                  </a>
                  <a
                    href="https://wa.me/5213314101313"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="font-serif text-xl">331 410 1313</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Form - Right Side */}
            <div className={`transition-all duration-700 delay-400 ${contactoAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/40 mb-3">NOMBRE</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/40 mb-3">TELÉFONO</label>
                    <input
                      type="tel"
                      placeholder="10 dígitos"
                      className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-white/40 mb-3">SERVICIO</label>
                  <div className="flex flex-wrap gap-3">
                    {['Reparación', 'Tarjeta', 'Panel', 'Otro'].map((option) => (
                      <label key={option} className="relative cursor-pointer">
                        <input type="radio" name="servicio" value={option.toLowerCase()} className="peer sr-only" />
                        <div className="px-4 py-2 border border-white/10 text-white/40 text-xs tracking-[0.1em] peer-checked:border-white/50 peer-checked:text-white hover:border-white/30 transition-all">
                          {option.toUpperCase()}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-white/40 mb-3">MENSAJE</label>
                  <textarea
                    rows={4}
                    placeholder="Describe el problema: marca, modelo, síntomas..."
                    className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-xs tracking-[0.2em] hover:bg-white hover:text-[#030712] transition-all duration-300"
                >
                  ENVIAR MENSAJE
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-8 bg-[#030712] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-blue-500/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-serif text-xl tracking-wide">El Azul</span>
            </a>

            {/* Copyright */}
            <p className="text-xs text-white/30 tracking-[0.1em]">
              © 2024 ELECTRÓNICA EL AZUL — GUADALAJARA, JALISCO
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://wa.me/5213314101313"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="tel:+523330303082"
                className="text-white/30 hover:text-white transition-colors"
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
