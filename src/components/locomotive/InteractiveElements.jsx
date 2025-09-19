import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const FloatingCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  React.useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-white/20 rounded-full pointer-events-none z-50 mix-blend-difference"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
    />
  );
};

export const TechStack = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {technologies?.map((tech, index) => (
        <motion.span
          key={tech}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          }}
          className="px-3 py-1 bg-white/5 border border-white/20 rounded-full text-xs font-mono text-white/80 cursor-pointer transition-all duration-300"
        >
          {tech}
        </motion.span>
      ))}
    </div>
  );
};

export const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = end / (duration * 60); // 60fps
          
          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(counter);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={countRef} className="font-black">
      {count}{suffix}
    </span>
  );
};

export const GlitchText = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover="hover"
    >
      <motion.span
        variants={{
          hover: {
            x: [0, -2, 2, 0],
            transition: { duration: 0.3, times: [0, 0.3, 0.6, 1] }
          }
        }}
        className="relative z-10"
      >
        {children}
      </motion.span>
      
      <motion.span
        variants={{
          hover: {
            opacity: [0, 0.8, 0],
            x: [-2, 2, -2],
            transition: { duration: 0.3, times: [0, 0.5, 1] }
          }
        }}
        className="absolute inset-0 text-red-500 opacity-0"
        style={{ clipPath: 'inset(0 0 50% 0)' }}
      >
        {children}
      </motion.span>
      
      <motion.span
        variants={{
          hover: {
            opacity: [0, 0.8, 0],
            x: [2, -2, 2],
            transition: { duration: 0.3, times: [0, 0.5, 1] }
          }
        }}
        className="absolute inset-0 text-blue-500 opacity-0"
        style={{ clipPath: 'inset(50% 0 0 0)' }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};

export const CodeBlock = ({ code, language, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white/60 ml-2">{language}</span>
          </div>
          <button
            onClick={copyCode}
            className="text-white/40 hover:text-white/80 transition-colors text-xs"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre className="text-white/90 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};