
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlitchText } from './InteractiveElements';
import CodeSnippets from './CodeSnippets';

const HeroSection = ({ entryPoint = 'developer' }) => {
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
    switch(entryPoint) {
      case 'developer':
        return {
          title: "DIGITAL\nCRAFTSMAN",
          subtitle: "FOCUSED ON FRONT END DEV, UX, STORYTELLING, AND COMMUNICATION",
          description: "Creating digital experiences that push boundaries and challenge conventions.",
          accent: "Building with"
        };
      case 'storyteller':
        return {
          title: "NARRATIVE\nARCHITECT", 
          subtitle: "STORYTELLER",
          description: "Weaving stories that captivate minds and move hearts across digital landscapes.",
          accent: "Writing with"
        };
      case 'ux_designer':
        return {
          title: "EXPERIENCE\nDESIGNER",
          subtitle: "UX/UI DESIGNER", 
          description: "Designing interactions that feel natural and inspire human connection.",
          accent: "Designing with"
        };
      default:
        return {
          title: "CREATIVE\nVISIONARY",
          subtitle: "MULTI-DISCIPLINARY",
          description: "Bridging the gap between technology, design, and human experience.",
          accent: "Creating with"
        };
    }
  };

  const content = getHeroContent();

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-900 px-4 sm:px-6 cursor-default"
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
          <div className="bg-white text-black px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full shadow-lg">
            SCROLL
          </div>
        </div>
      )}

      {/* Code Snippets */}
      <CodeSnippets section="hero" count={6} />

      {/* Animated background elements */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-1/4 w-2 h-96 bg-white transform rotate-45 opacity-5"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-64 bg-white transform -rotate-12 opacity-10"></div>
        
        {/* Matrix-style rain effect */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse delay-1000"></div>
      </motion.div>

      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto text-center relative z-20 px-4 xl:px-8 2xl:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-white/60 mb-4 2xl:mb-8 uppercase cursor-default"
          >
            {content.subtitle}
          </motion.p>
          
          {/* Accent line with typing effect */}
          <motion.p
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg mb-4 2xl:mb-8 overflow-hidden whitespace-nowrap mx-auto cursor-default"
            style={{ width: "fit-content" }}
          >
            $ {content.accent.toLowerCase()}.replace('limits', 'possibilities') ⚡
          </motion.p>
          
          <GlitchText className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[14rem] font-black leading-none tracking-tighter mb-8 sm:mb-12 2xl:mb-20 cursor-default">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {content.title.split('\n').map((line, i) => (
                <div key={i} className="block">
                  {line}
                </div>
              ))}
            </motion.h1>
          </GlitchText>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-white/80 max-w-4xl 2xl:max-w-7xl mx-auto mb-6 sm:mb-8 2xl:mb-16 font-light cursor-default"
          >
            {content.description}
          </motion.p>

          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-2 mb-8 sm:mb-16 2xl:mb-24 cursor-default"
          >
            <div className="w-2 h-2 2xl:w-3 2xl:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg">Available for projects</span>
          </motion.div>

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
  className="group bg-gradient-to-r from-purple-800/40 via-green-500/40 to-green-300/90 backdrop-blur-xl border-2 border-green-100 text-white px-8 sm:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6 xl:py-8 2xl:py-10 font-black text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-100 hover:bg-gradient-to-r hover:from-purple-800/40 hover:via-green-500/40 hover:to-green-300/90"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  VIEW WORK
</motion.button>


<motion.a
  href="mailto:jordanasseff@gmail.com"
  className="group border-2 border-white/40 text-white px-8 sm:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6 xl:py-8 2xl:py-10 font-black text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-100 hover:bg-gradient-to-r hover:from-purple-800/40 hover:via-green-500/40 hover:to-green-300/90 hover:text-white backdrop-blur-xl inline-block"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  CONTACT
</motion.a>


          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
