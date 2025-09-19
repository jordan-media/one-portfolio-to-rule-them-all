
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const AboutPreview = ({ entryPoint = 'developer' }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-200px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const getContent = () => {
    switch(entryPoint) {
      case 'developer':
        return {
          title: "CRAFTING\nDIGITAL\nEXPERIENCES",
          description: "Authentic and Honest. Explore around—you might just find something worthy of your time."
        };
      case 'storyteller':
        return {
          title: "WEAVING\nCOMPELLING\nNARRATIVES", 
          description: "Stories have the power to transform. I create content that doesn't just inform—it captivates, resonates, and builds lasting connections between brands and their audiences."
        };
      case 'ux_designer':
        return {
          title: "DESIGNING\nHUMAN\nCONNECTIONS",
          description: "Great design is invisible. I create interfaces that feel natural and intuitive, bridging the gap between complex technology and human needs."
        };
      default:
        return {
          title: "CREATING\nMEANINGFUL\nIMPACT",
          description: "At the intersection of technology, design, and storytelling, I create experiences that matter—solutions that not only work but inspire."
        };
    }
  };

  const content = getContent();

  return (
    <section 
      ref={containerRef}
      className="relative py-32 px-6 bg-black overflow-hidden"
    >
      {/* Background elements */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-10 w-1 h-64 bg-white/10 transform rotate-12"></div>
        <div className="absolute bottom-1/4 left-10 w-0.5 h-32 bg-white/20 transform -rotate-45"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2 
              ref={textRef}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-12"
            >
              {content.title.split('\n').map((line, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="block"
                >
                  {line}
                </motion.div>
              ))}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl text-white/70 leading-relaxed mb-12"
            >
              {content.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <button className="group border-2 border-white text-white px-12 py-6 font-black text-sm tracking-widest uppercase transition-all duration-300 hover:bg-green-500 hover:text-white hover:border-green-500">
                LEARN MORE ABOUT ME
              </button>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] bg-white/5">
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/10 rounded-full mb-8 mx-auto flex items-center justify-center">
                    <span className="text-4xl font-black text-white/60">ME</span>
                  </div>
                  <p className="text-white/40 text-sm tracking-widest uppercase">
                    Your Photo Here
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white"></div>
              <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-white"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
