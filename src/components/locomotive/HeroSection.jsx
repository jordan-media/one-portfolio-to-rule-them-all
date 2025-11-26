
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlitchText } from './InteractiveElements';
import CodeSnippets from './CodeSnippets';
import { useTranslation } from 'react-i18next';

const HeroSection = ({ entryPoint = 'developer' }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [showScrollCursor, setShowScrollCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Hide scroll cursor after user starts scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollCursor(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    if (showScrollCursor) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showScrollCursor]);

  const getHeroContent = () => {
    const key = entryPoint === 'developer' || entryPoint === 'storyteller' || entryPoint === 'ux_designer'
      ? entryPoint
      : 'default';

    return {
      title: t(`hero.${key}.title`),
      subtitle: t(`hero.${key}.subtitle`),
      description: t(`hero.${key}.description`),
      accent: t(`hero.${key}.accent`)
    };
  };

  const content = getHeroContent();

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-black dark:to-slate-900 px-4 sm:px-6 py-8 sm:py-0 cursor-default transition-colors duration-300"
      style={{ cursor: showScrollCursor ? 'none' : 'default' }}
    >
      {/* Custom Scroll Cursor */}
      {showScrollCursor && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: cursorPosition.x - 50,
            top: cursorPosition.y - 15,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-slate-900 dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full shadow-lg">
            {t('common.scroll')}
          </div>
        </div>
      )}

      {/* Code Snippets */}
      <CodeSnippets section="hero" count={6} />

      {/* Animated background elements */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-1/4 w-2 h-96 bg-white transform rotate-45 opacity-5"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-64 bg-white transform -rotate-12 opacity-10"></div>
        
        {/* Matrix-style rain effect */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse delay-1000"></div>
      </motion.div>

      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto text-center relative z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Status indicator - Moved to top */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-4 sm:mt-8 2xl:mt-12 mb-6 sm:mb-8 2xl:mb-12 cursor-default"
          >
            <div className="w-2 h-2 2xl:w-3 2xl:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 dark:text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg">{t('common.availableForProjects')}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-tight sm:tracking-[0.3em] text-slate-600 dark:text-white/60 mb-3 sm:mb-4 2xl:mb-8 uppercase cursor-default px-2"
          >
            {content.subtitle}
          </motion.p>

          {/* Accent line with typing effect */}
          <motion.p
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-green-500 dark:text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg mb-3 sm:mb-4 2xl:mb-8 overflow-hidden sm:whitespace-nowrap mx-auto cursor-default break-words max-w-full px-2"
            style={{ width: "fit-content", maxWidth: "100%" }}
          >
            $ {content.accent.toLowerCase()}.replace('limits', 'possibilities') ⚡
          </motion.p>
          
          <GlitchText className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[14rem] font-black leading-none tracking-tighter mb-4 sm:mb-12 2xl:mb-20 cursor-default px-2 text-slate-900 dark:text-white">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {content.title.split('\n').map((line, i) => (
                <div key={i} className="block break-words">
                  {line}
                </div>
              ))}
            </motion.h1>
          </GlitchText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-base sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-slate-700 dark:text-white/80 max-w-4xl 2xl:max-w-7xl mx-auto mb-6 sm:mb-16 2xl:mb-24 font-light cursor-default px-2"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 xl:gap-8 2xl:gap-12 justify-center"
          >
            <motion.button
  onClick={() => {
    const section = document.getElementById("projects");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }}
  className="group border-2 border-slate-400 dark:border-white/40 text-slate-900 dark:text-white px-6 sm:px-12 xl:px-16 2xl:px-20 py-3 sm:py-6 xl:py-8 2xl:py-10 font-black text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-500 dark:hover:border-green-100 hover:bg-gradient-to-r hover:from-purple-800/40 hover:via-green-500/40 hover:to-green-300/90 hover:text-white backdrop-blur-xl"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {t('common.viewWork')}
</motion.button>


<motion.a
  href="mailto:jordanasseff@gmail.com"
  className="group border-2 border-slate-400 dark:border-white/40 text-slate-900 dark:text-white px-6 sm:px-12 xl:px-16 2xl:px-20 py-3 sm:py-6 xl:py-8 2xl:py-10 font-black text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-500 dark:hover:border-green-100 hover:bg-gradient-to-r hover:from-purple-800/40 hover:via-green-500/40 hover:to-green-300/90 hover:text-white backdrop-blur-xl inline-block"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {t('common.contact')}
</motion.a>


          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
