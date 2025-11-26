
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/use-mobile';
import fullshot5 from '../../assets/images/jordan/fullshot-5.jpg';

const AboutPreview = ({ entryPoint = "developer" }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-200px" });
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const getContent = () => {
    const key = entryPoint === 'developer' || entryPoint === 'storyteller' || entryPoint === 'ux_designer'
      ? entryPoint
      : 'default';

    return {
      title: t(`aboutPreview.${key}.title`),
      description: t(`aboutPreview.${key}.description`)
    };
  };

  const content = getContent();

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6 bg-white dark:bg-black overflow-hidden transition-colors duration-300"
    >
      {/* Background elements */}
      <motion.div
        style={isMobile ? {} : { y, opacity }}
        className={`absolute inset-0 pointer-events-none ${isMobile ? 'motion-div-fallback' : ''}`}
      >
        <div className="absolute top-1/4 right-10 w-1 h-64 bg-white/10 transform rotate-12"></div>
        <div className="absolute bottom-1/4 left-10 w-0.5 h-32 bg-white/20 transform -rotate-45"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : (isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 })}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={isMobile ? 'motion-div-fallback' : ''}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <motion.h2
              ref={textRef}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-12 text-slate-900 dark:text-white"
            >
              {content.title.split("\n").map((line, i) => (
                <motion.div
                  key={i}
                  initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : (isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 })
                  }
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className={`block ${isMobile ? 'motion-div-fallback' : ''}`}
                  style={isMobile ? { opacity: 1 } : {}}
                >
                  {line}
                </motion.div>
              ))}
            </motion.h2>

            <motion.p
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : (isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 })}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`text-xl text-slate-700 dark:text-white/70 leading-relaxed mb-12 ${isMobile ? 'motion-div-fallback' : ''}`}
              style={isMobile ? { opacity: 1 } : {}}
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : (isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 })}
              transition={{ duration: 0.6, delay: 1 }}
              className={isMobile ? 'motion-div-fallback' : ''}
              style={isMobile ? { opacity: 1 } : {}}
            >
              <Link to="/About" className="group border-2 border-slate-400 dark:border-white/40 text-slate-900 dark:text-white px-12 py-6 font-black text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer backdrop-blur-xl hover:scale-105 hover:border-green-500 dark:hover:border-green-100 hover:bg-gradient-to-r hover:from-purple-800/40 hover:via-green-500/40 hover:to-green-300/90 hover:text-white inline-block">
                {t('aboutPreview.button')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          {/* Image/Visual */}
          <motion.div
            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : (isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 })}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`relative ${isMobile ? 'motion-div-fallback' : ''}`}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="relative aspect-[4/5] overflow-hidden z-50">
              <img
                src={fullshot5}
                alt="Full-body professional portrait of Jordan Asseff, self-photographed with custom lighting setup to showcase his photography skills"
                className="absolute inset-0 w-full h-full object-contain object-center"
              />

              {/* Gradient overlay on top */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" /> */}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-1 -right-1 w-12 h-12 bg-white"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
