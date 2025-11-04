
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';

import { gsap } from "gsap";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

// import SimpleFloatingDemo from '../components/locomotive/SimpleFloatingDemo.jsx';

// Move elementSize outside component to avoid dependency issues
const ELEMENT_SIZE = { width: 120, height: 32 };

// FloatingText component for animated skill tags
const FloatingText = ({ children, delay = 0, containerBounds, allPositions, index, onPositionUpdate }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  const isMobile = useIsMobile();

  // Collision detection helper, wrapped in useCallback for referential stability
  const checkCollision = useCallback((pos1, positions, currentIndex) => {
    return positions.some((pos2, i) => {
      // Only check against positions that have been initialized and are not self
      // and ensure pos2 is not null or undefined
      if (i === currentIndex || !pos2 || pos2.x === undefined || pos2.y === undefined) return false;

      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Use 80% of width as collision radius to provide some buffer
      return distance < (ELEMENT_SIZE.width * 0.8);
    });
  }, []); // Dependencies for useCallback are empty as ELEMENT_SIZE is constant and `positions` and `currentIndex` are arguments.

  // Initial position setup with better distribution
  useEffect(() => {
    if (containerBounds.width === 0 || containerBounds.height === 0) return;

    let attempts = 0;
    let newPosition;
    const minTopOffset = 60; // Space below the title

    // Create a grid-based initial distribution to reduce clustering
    const gridCols = 3;
    const gridRows = 2;
    const cellWidth = (containerBounds.width - ELEMENT_SIZE.width) / gridCols;
    const cellHeight = (containerBounds.height - ELEMENT_SIZE.height - minTopOffset) / gridRows;

    const gridIndex = index % (gridCols * gridRows);
    const gridCol = Math.floor(gridIndex / gridRows); // Corrected: gridCol by index, not remainder
    const gridRow = gridIndex % gridRows; // Corrected: gridRow by remainder, not floor

    // Start with grid position but add randomness
    do {
      const baseX = gridCol * cellWidth + (cellWidth / 4);
      const baseY = gridRow * cellHeight + minTopOffset + (cellHeight / 4);

      newPosition = {
        x: baseX + Math.random() * (cellWidth / 2),
        y: baseY + Math.random() * (cellHeight / 2)
      };

      // Ensure within bounds
      newPosition.x = Math.max(0, Math.min(newPosition.x, containerBounds.width - ELEMENT_SIZE.width));
      newPosition.y = Math.max(minTopOffset, Math.min(newPosition.y, containerBounds.height - ELEMENT_SIZE.height));

      attempts++;
    } while (attempts < 50 && checkCollision(newPosition, allPositions, index));

    setPosition(newPosition);
    setVelocity({
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5
    });

    onPositionUpdate(index, newPosition);
  }, [containerBounds, index, checkCollision, allPositions, onPositionUpdate]);

  // Animation loop with improved physics - disabled on mobile for performance
  useEffect(() => {
    // Skip complex physics animation on mobile devices
    if (isMobile) return;
    
    // Only start animating once component's position is set and container bounds are available
    if (position.x === 0 && position.y === 0 && velocity.x === 0 && velocity.y === 0) return;
    if (containerBounds.width === 0 || containerBounds.height === 0) return;

    const minTopOffset = 60; // Space below the title
    const boundaryBounceFactor = 0.8;
    const friction = 0.99;
    const gentleForce = 0.02;

    const animate = () => {
      setPosition(prevPos => {
        let newPos = {
          x: prevPos.x,
          y: prevPos.y
        };

        setVelocity(prevVel => {
          let newVel = { ...prevVel };
          
          // Update position based on velocity
          newPos.x = prevPos.x + newVel.x;
          newPos.y = prevPos.y + newVel.y;

          // 1. Boundary collision (bouncing off walls)
          if (newPos.x <= 0) {
            newVel.x *= -boundaryBounceFactor;
          } else if (newPos.x + ELEMENT_SIZE.width >= containerBounds.width) {
            newVel.x *= -boundaryBounceFactor;
          }
          newPos.x = Math.max(0, Math.min(newPos.x, containerBounds.width - ELEMENT_SIZE.width));

          if (newPos.y <= minTopOffset) {
            newVel.y *= -boundaryBounceFactor;
          } else if (newPos.y + ELEMENT_SIZE.height >= containerBounds.height) {
            newVel.y *= -boundaryBounceFactor;
          }
          newPos.y = Math.max(minTopOffset, Math.min(newPos.y, containerBounds.height - ELEMENT_SIZE.height));

          // 2. Collision with other elements (improved marble physics)
          allPositions.forEach((otherPos, i) => {
            if (i !== index && otherPos && otherPos.x !== undefined && otherPos.y !== undefined) {
              const dx = newPos.x - otherPos.x;
              const dy = newPos.y - otherPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = ELEMENT_SIZE.width * 0.9; // Collision detection radius

              if (distance < minDistance && distance > 0) {
                // Strong bounce away from collision
                const angle = Math.atan2(dy, dx);
                const overlap = minDistance - distance;
                const pushForce = overlap * 0.2; // Stronger push force
                
                newVel.x += Math.cos(angle) * pushForce;
                newVel.y += Math.sin(angle) * pushForce;
                
                // Also move position immediately to prevent sticking
                const immediateMove = overlap * 0.1;
                newPos.x += Math.cos(angle) * immediateMove;
                newPos.y += Math.sin(angle) * immediateMove;
              }
            }
          });

          // 3. Add random gentle movement (like floating on water)
          newVel.x += (Math.random() - 0.5) * gentleForce;
          newVel.y += (Math.random() - 0.5) * gentleForce;

          // 4. Apply friction/damping
          newVel.x *= friction;
          newVel.y *= friction;

          return newVel;
        });

        onPositionUpdate(index, newPos);
        return newPos;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = setTimeout(() => { // Renamed from startAnimationTimeout
      animate();
    }, delay * 1000); // Start animation after a delay

    return () => {
      clearTimeout(startAnimation); // Clear the timeout
      if (animationRef.current) { // Check if animationRef.current exists
        cancelAnimationFrame(animationRef.current); // Cancel the animation frame
      }
    };
  }, [position, velocity, allPositions, index, delay, containerBounds, onPositionUpdate, isMobile]);


  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isMobile ? undefined : position.x, // Disable position animation on mobile
        y: isMobile ? undefined : position.y
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        x: { duration: 0 }, // Position updates are continuous via RAF, no motion transition
        y: { duration: 0 }
      }}
      className={`${isMobile ? 'relative inline-block m-2 motion-div-fallback' : 'absolute'} bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-xs 2xl:text-sm font-medium text-white/80 hover:bg-white/10 hover:scale-110 transition-all duration-300 select-none pointer-events-none`}
      whileHover={{ scale: 1.1 }}
      style={isMobile ? { opacity: 1 } : { position: 'absolute' }} // Ensure visibility on mobile
    >
      {children}
    </motion.div>
  );
};


// Individual section components for better organization
const HeroSection = () => {
  const containerRef = useRef(null);
  const [showScrollCursor, setShowScrollCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const textRef = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Hide scroll cursor after user starts scrolling, show again if scrolled back to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && showScrollCursor) {
        setShowScrollCursor(false);
      } else if (window.scrollY <= 50 && !showScrollCursor) {
        setShowScrollCursor(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollCursor]);

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    if (showScrollCursor) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showScrollCursor]);

  // Wiggle animation for RollerCoaster Tycoon - disabled on mobile for performance
  useEffect(() => {
    if (textRef.current && !isMobile) {
      const letters = textRef.current.querySelectorAll(".wiggle-letter");
      const wave = gsap.to(letters, {
        y: 10,                      // wave amplitude
        duration: 0.8,              // each letter's cycle speed
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,                 // infinite internally
        stagger: {
          each: 0.15,
          from: "start",
          repeat: -1,
          yoyo: true
        }
      });

      // Kill after ~5 seconds (about 3 waves)
      gsap.delayedCall(5, () => {
        wave.kill();  // stop the tween
        gsap.to(letters, { y: 0, duration: 0.5, ease: "sine.out" }); // settle clean
      });
    }
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 overflow-hidden"
      style={{ cursor: showScrollCursor ? 'none' : 'default' }}
    >
      {/* Custom Scroll Cursor */}
      {showScrollCursor && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-white text-black px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full shadow-lg">
            SCROLL
          </div>
        </div>
      )}

      {/* Background Elements */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
      >
        <div className="absolute top-1/4 right-1/4 w-1 h-96 bg-white transform rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/4 w-0.5 h-64 bg-white transform -rotate-45"></div>
      </motion.div>

      {/* Muted background suggestion - abstract lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-400/30 to-transparent"></div>
        <div className="absolute top-0 right-2/5 w-px h-full bg-gradient-to-b from-blue-400/20 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-white/60 mb-6 sm:mb-8 2xl:mb-12 uppercase cursor-default ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}
        >
          FROM STEEL TO CODE
        </motion.p>

        {/* Code snippet with typing effect */}
        <motion.p
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ delay: 0.4, duration: 1 }}
          className={`text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg mb-8 sm:mb-12 2xl:mb-16 overflow-hidden whitespace-nowrap mx-auto cursor-default ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { width: "fit-content", opacity: 1 } : { width: "fit-content" }}
        >
          $ build.foundation().withGrit().andCollaboration() ⚡
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className={`leading-tight tracking-tighter cursor-default ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}
        >
          {/* Main Title - Largest with ultra-wide scaling */}
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-black mb-4 sm:mb-6 2xl:mb-10">
            a BUILDER at HEART.
          </span>

          {/* Secondary Line - Medium, distinct color */}
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white/80 mb-4 sm:mb-6 2xl:mb-8">
            Quality - Authenticity
          </span>

          {/* Tertiary Line - Smaller, accent color */}
          <span
            ref={textRef}
            className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-semibold text-green-400 mb-4 sm:mb-6 2xl:mb-8"
          >
            {"UxD instincts since "}
            {"RollerCoaster Tycoon '99".split("").map((char, i) => (
              <span key={i} className="wiggle-letter inline-block">
                {char}
              </span>
            ))}
          </span>

          {/* Description Line - Smallest, muted */}
          <span className="block text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-normal text-white/60 leading-relaxed">
            Dev roots sprouted in science summer camps, back when AOL CDs came with breakfast.
          </span>
        </motion.h1>
      </div>
    </section>
  );
};


const CollaborationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-gradient-to-b from-black to-slate-900 cursor-default overflow-hidden">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Opening Quote - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 sm:mb-24 2xl:mb-32 ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-[8rem] font-black tracking-tight leading-tight">
            <span className="text-green-300">"100 feet in the air</span>
            <br />
            <span className="text-white">taught me more about</span>
            <br />
            <span className="text-white/60">collaboration</span>
            <br />
            <span className="text-white">than any classroom."</span>
          </h2>
        </motion.div>

{/* Story Content - Image Left, Text Right */}
<div className="grid lg:grid-cols-5 gap-12 lg:gap-16 2xl:gap-24 items-center mb-16 sm:mb-24 2xl:mb-32">
  {/* Image (Left) */}
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
    transition={{ duration: 0.8 }}
    className={`lg:col-span-2 ${isMobile ? 'motion-div-fallback' : ''}`}
    style={isMobile ? { opacity: 1 } : {}}
  >
    <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-[-4px_4px_10px_rgba(255,255,255,0.25)] relative">
  <img
    src="/assets/images/jordan/about-1.jpg"
    alt="Profile Picture"
    className="w-full h-full object-cover object-center"
  />
    </div>

  </motion.div>

  {/* Text (Right) */}
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className={`lg:col-span-3 ${isMobile ? 'motion-div-fallback' : ''}`}
    style={isMobile ? { opacity: 1 } : {}}
  >
    <div className="space-y-6 2xl:space-y-10">
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
       I like to think I'm clever, but I'm just a normal guy who likes to be creative. I enjoy bringing my energy when I walk into a room and<span className="font-bold text-cyan-400"> I enjoy all of the small moments that we tend to overlook each day.</span>
      </p>
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        <span className="font-bold text-cyan-400"> Experience</span> is one of my biggest assets, but the willingness to always be learning and staying curious is what will keep me growing.
      </p>
    </div>
  </motion.div>
</div>


{/* Communication Focus - Text Left, Image Right */}
<div className="grid lg:grid-cols-5 gap-12 lg:gap-16 2xl:gap-24 items-center mb-16 sm:mb-24 2xl:mb-32">
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className={`lg:col-span-3 ${isMobile ? 'motion-div-fallback' : ''}`}
    style={isMobile ? { opacity: 1 } : {}}
  >
    <div className="space-y-6 2xl:space-y-10">
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        <span className="font-bold text-cyan-400">Learning new coding languages</span> can be challenging. When my car needed to be repaired at the cost of $2400, I decided to do it myself.
      </p>
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        Tearing apart half of the engine isn’t difficult when you follow all the small steps. It takes confidence and hard work — the same principles I apply when working with a large codebase. < br/>Breaking large unmanageable tasks into small bite-size pieces.
      </p>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
    transition={{ duration: 0.8, delay: 0.6 }}
    className={`lg:col-span-2 ${isMobile ? 'motion-div-fallback' : ''}`}
    style={isMobile ? { opacity: 1 } : {}}
  >
    <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-[4px_4px_10px_rgba(255,255,255,0.25)] backdrop-blur-xl">
      <img
        src="assets/images/jordan/about-2.jpg"
        alt="Jordan working or learning"
        className="w-full h-full object-cover"
      />
    </div>
  </motion.div>
</div>


        {/* Closing Quote - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={`text-center mb-16 sm:mb-24 2xl:mb-32 ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-8xl font-black tracking-tight leading-tight mb-8 2xl:mb-12">
            <span className="text-green-300">Patience</span>
            <br />
            <span className="text-white">Perseverance</span>
            <br />
            <span className="text-white/60">Strength</span>
          </h3>
        </motion.div>

        {/* Lessons Learned - Full Width */}
        <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
  transition={{ duration: 0.8, delay: 1 }}
  className={`max-w-4xl 2xl:max-w-6xl mx-auto text-center ${isMobile ? 'motion-div-fallback' : ''}`}
  style={isMobile ? { opacity: 1 } : {}}
>
  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed mb-8 2xl:mb-12">
    <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">Estimator, Project Manager,</span> and <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">Foreman</span> are some career titles I've reached. The journey to get there has been challenging but deeply rewarding. Throughout my career, I’ve had to navigate many obstacles and follow new paths as local economies changed.
  </p>
  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
    Like many professionals can attest, being flexible and open to change is needed. I do my best to absorb my surroundings and learn by observing how other skilled professionals move through their workflow.
  </p>
</motion.div>

      </div>
    </section>
  );
};


// ________________________________________________________________________________


const TechSkillsSection = () => {
  const ref = useRef(null);
  const skillsRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Skip GSAP ScrambleText animation on mobile for compatibility
    if (isMobile) {
      // Simple fallback: just show the skills without scramble animation
      const skills = [
        "React",
        "Node.js",
        "JavaScript",
        "Figma",
        "React Native",
        "TypeScript",
        "HTML5",
        "CSS3",
        "CMS",
        "Terminal",
        "GitHub",
        "GitHub Actions",
        "AI Integration",
        "Adobe Creative Cloud",
        "Premiere Pro",
        "After Effects",
        "Blender",
        "3D Modeling",
        "Illustrator",
        "Photoshop",
        "AutoCAD",
        "Technical Drawing",
        "UI/UX Research",
      ];

      // Simple text reveal animation as fallback
      skills.forEach((skill, i) => {
        const el = skillsRef.current?.querySelector(`#skill-${i}`);
        if (el) {
          // Set text content immediately and add a simple fade-in
          el.textContent = skill;
          gsap.fromTo(el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.1,
              ease: "power2.out"
            }
          );
        }
      });
      return;
    }

    // Desktop: Use ScrambleTextPlugin with error handling
    try {
      const tl = gsap.timeline({ repeat: -1, delay: 1 });

      const skills = [
        "React",
        "Node.js",
        "JavaScript",
        "Figma",
        "React Native",
        "TypeScript",
        "HTML5",
        "CSS3",
        "CMS",
        "Terminal",
        "GitHub",
        "GitHub Actions",
        "AI Integration",
        "Adobe Creative Cloud",
        "Premiere Pro",
        "After Effects",
        "Blender",
        "3D Modeling",
        "Illustrator",
        "Photoshop",
        "AutoCAD",
        "Technical Drawing",
        "UI/UX Research",
      ];

      skills.forEach((skill, i) => {
        const el = skillsRef.current?.querySelector(`#skill-${i}`);
        if (el) {
          tl.to(
            el,
            {
              duration: 1.5,
              scrambleText: { text: skill, chars: "XO0123456789", speed: 0.3 },
            },
            i * 0.15
          );
        }
      });

      return () => tl.kill();
    } catch (error) {
      console.warn('ScrambleTextPlugin failed, falling back to simple text display:', error);
      
      // Fallback if ScrambleTextPlugin fails
      const skills = [
        "React",
        "Node.js",
        "JavaScript",
        "Figma",
        "React Native",
        "TypeScript",
        "HTML5",
        "CSS3",
        "CMS",
        "Terminal",
        "GitHub",
        "GitHub Actions",
        "AI Integration",
        "Adobe Creative Cloud",
        "Premiere Pro",
        "After Effects",
        "Blender",
        "3D Modeling",
        "Illustrator",
        "Photoshop",
        "AutoCAD",
        "Technical Drawing",
        "UI/UX Research",
      ];

      skills.forEach((skill, i) => {
        const el = skillsRef.current?.querySelector(`#skill-${i}`);
        if (el) {
          el.textContent = skill;
          gsap.fromTo(el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              delay: i * 0.1
            }
          );
        }
      });
    }
  }, [isMobile]);

  const pickColor = (word) => {
    if (word === "Adobe Creative Cloud") {
      return "bg-gradient-to-r from-pink-400 via-red-400 to-purple-400 bg-clip-text text-transparent";
    }
    const colorMap = {
      React: "text-green-400",
      "React Native": "text-blue-400",
      JavaScript: "text-yellow-400",
      TypeScript: "text-cyan-400",
      Figma: "text-pink-400",
      Blender: "text-purple-400",
      GitHub: "text-gray-300",
      "AI Integration": "text-indigo-400",
      "UI/UX Research": "text-teal-300",
    };
    return (
      colorMap[word] ||
      [
        "text-orange-400",
        "text-lime-400",
        "text-indigo-400",
        "text-teal-400",
        "text-white/80",
      ][Math.floor(Math.random() * 5)]
    );
  };

  const pickSize = (word) => {
    const large = [
      "React",
      "React Native",
      "JavaScript",
      "Figma",
      "Blender",
      "Adobe Creative Cloud",
    ];
    const medium = [
      "TypeScript",
      "Node.js",
      "Illustrator",
      "Photoshop",
      "GitHub",
      "AI Integration",
      "UI/UX Research",
    ];
    if (large.includes(word))
      return "text-4xl sm:text-6xl font-black leading-none";
    if (medium.includes(word))
      return "text-2xl sm:text-4xl font-bold leading-tight";
    return "text-lg sm:text-2xl font-medium leading-snug";
  };

  const skills = [
    "React",
    "Node.js",
    "JavaScript",
    "Figma",
    "React Native",
    "TypeScript",
    "HTML5",
    "CSS3",
    "CMS",
    "Terminal",
    "GitHub",
    "GitHub Actions",
    "AI Integration",
    "Adobe Creative Cloud",
    "Premiere Pro",
    "After Effects",
    "Blender",
    "3D Modeling",
    "Illustrator",
    "Photoshop",
    "AutoCAD",
    "Technical Drawing",
    "UI/UX Research",
  ];

  return (
    <section
      ref={ref}
      className="py-20 sm:py-32 2xl:py-48 px-6 sm:px-12 bg-slate-900 cursor-default"
    >
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          ref={skillsRef}
          className={`font-mono tracking-tight flex flex-wrap justify-center gap-x-4 gap-y-3 ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}
        >
          {skills.map((skill, i) => (
            <span
              key={i}
              id={`skill-${i}`}
              className={`${pickColor(skill)} ${pickSize(
                skill
              )} inline-block whitespace-nowrap`}
            >
              {skill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};



const CurrentFocusSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const isMobile = useIsMobile();

  return (
    <section
      ref={ref}
      className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-gradient-to-b from-slate-900 to-black cursor-default"
    >
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Opening Quote */}
        <motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
  transition={{ duration: 0.8 }}
  className={`text-center mb-16 sm:mb-24 2xl:mb-32 ${isMobile ? 'motion-div-fallback' : ''}`}
  style={isMobile ? { opacity: 1 } : {}}
>
  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-[9rem] font-black leading-relaxed tracking-tight">
    <span className="text-green-300">Curiosity</span>{" "}
    <span className="text-white">keeps me</span>
    <br />
    <span
      className="text-white italic 
                 text-6xl sm:text-5xl md:text-8xl lg:text-6xl xl:text-8xl 2xl:text-[9rem]"
    >
      - moving
    </span>{" "}
    <span
      className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 
                 bg-clip-text text-transparent 
                 text-6xl sm:text-5xl md:text-8xl lg:text-6xl xl:text-8xl 2xl:text-[9rem]"
    >
      ---
    </span>
    <br />
    <span className="text-white/60">Quality</span>
    <br />
    <span className="text-white">keeps me</span>{" "}
    <span className="text-green-300">grounded.</span>
  </h2>
</motion.div>


        {/* Current Learning - Image Right, Text Left */}
<div className="grid lg:grid-cols-5 gap-12 lg:gap-16 2xl:gap-24 items-center mb-16 sm:mb-24 2xl:mb-32">
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
    transition={{ duration: 0.8 }}
    className={`lg:col-span-3 ${isMobile ? 'motion-div-fallback' : ''}`}
    style={isMobile ? { opacity: 1 } : {}}
  >
    <div className="space-y-6 2xl:space-y-10">
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        Now, I'm finishing my Web & App Development Diploma at BCIT,
        where I've discovered a new passion: building with{" "}
        <span className="font-bold text-cyan-400">React</span>,{" "}
        <span className="font-bold text-cyan-400">TypeScript</span>,{" "}
        <span className="font-bold text-cyan-400">Vite</span>, and{" "}
        <span className="font-bold text-cyan-400">React Native</span>.
      </p>
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        Passionate about the use of
        <span className="font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"> color </span>
        and delivering digital products that incorporate storytelling and ease of use. 
      </p>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className={`lg:col-span-2 ${isMobile ? 'motion-div-fallback' : ''}`}
    style={isMobile ? { opacity: 1 } : {}}
  >
    <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-[4px_4px_10px_rgba(255,255,255,0.25)] backdrop-blur-xl">
      <img
        src="assets/images/jordan/about-3.jpg"
        alt="Jordan studying web development"
        className="w-full h-full object-cover"
      />
    </div>
  </motion.div>
</div>


        {/* Creative Side - Text Right, Image Left */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 2xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`lg:col-span-2 ${isMobile ? 'motion-div-fallback' : ''}`}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-[-4px_4px_10px_rgba(255,255,255,0.25)] backdrop-blur-xl">
              <img
                src="assets/images/jordan/about-5.jpg"
                alt="Jordan working creatively with Adobe, Figma, and Blender"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`lg:col-span-3 ${isMobile ? 'motion-div-fallback' : ''}`}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="space-y-6 2xl:space-y-10">
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                On the creative side, I've worked with the{" "}
                <span className="font-bold text-cyan-400">
                  Adobe Creative Suite
                </span>
                , <span className="font-bold text-cyan-400">Figma</span>, and{" "}
                <span className="font-bold text-cyan-400">Blender</span>, which
                gives me empathy for designers and a deeper appreciation for how
                creativity and development connect.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                This combination allows me to bridge the gap between technical
                implementation and user experience, creating solutions that are
                both functional and beautiful.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

  );
};



const PersonalSideSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const isMobile = useIsMobile();

  return (
    <section
      ref={ref}
      className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-black cursor-default"
    >
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Opening Quote */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 sm:mb-24 2xl:mb-32 ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}
        >
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl 2xl:text-[8rem] font-black tracking-tight leading-tight">
            <span className="text-green-400">i am</span>
            <br />
            <span className="text-white">a father</span>
            <br />
            <span className="text-white/50">a role model</span>
            <br />
            <span className="text-cyan-400">a storyteller</span>
            <br />
            <span className="text-white">and keeper of balance</span>
          </h2>
        </motion.div>

        {/* Life Balance - Text and Image */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 2xl:gap-32 mb-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className={isMobile ? 'motion-div-fallback' : ''}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="space-y-6 2xl:space-y-10">
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                Outside of work I{" "}
                <span className="font-bold text-cyan-400">
                  love staying busy
                </span>{" "}
                as much as I love relaxing. Getting my hands dirty in the
                garden, feeling the sand between my toes at the beach, or the
                rush of cold water from the North Shore rivers.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                I'm also a{" "}
                <span className="font-bold text-cyan-400">proud father</span> of
                two grown children, raising them to be happy and healthy has
                continued to shine light on personal strength and growth.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={isMobile ? 'motion-div-fallback' : ''}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-[4px_4px_15px_rgba(255,255,255,0.35)] backdrop-blur-xl">
              <img
                src="assets/images/jordan/about-4.jpg"
                alt="Jordan enjoying outdoor activities with family"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 2xl:gap-32 items-start">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={isMobile ? 'motion-div-fallback' : ''}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-[4px_4px_15px_rgba(255,255,255,0.35)] backdrop-blur-xl">
              <img
                src="assets/images/jordan/about-6.jpg"
                alt="Jordan enjoying outdoor activities with family"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className={isMobile ? 'motion-div-fallback' : ''}
            style={isMobile ? { opacity: 1 } : {}}
          >
            <div className="space-y-6 2xl:space-y-10">
              
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                Regardless of the situation, the world we live in requires
                adaptability and grit.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                Our family joke when going out to eat is:
                <br />
                <span className="font-bold text-cyan-400">
                  "Table for three?"
                </span>
              </p>
            </div>
          </motion.div>

          
        </div>
      </div>
    </section>
  );
};



const ClosingCTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-gradient-to-b from-black to-slate-900 cursor-default">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[10rem] font-black tracking-tight leading-tight mb-8 2xl:mb-16 ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}>

          <span className="text-green-400">Outdoors or online,</span>
          <br />
          <span className="text-white/80">always looking forward into the horizon</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-xl sm:text-2xl xl:text-3xl 2xl:text-5xl text-white/80 max-w-5xl 2xl:max-w-8xl mx-auto mb-12 2xl:mb-20 leading-relaxed ${isMobile ? 'motion-div-fallback' : ''}`}
          style={isMobile ? { opacity: 1 } : {}}>

          I believe in <span className="font-bold text-cyan-400">staying curious</span>, working hard, and building things that actually have purpose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={isMobile ? 'motion-div-fallback' : ''}
          style={isMobile ? { opacity: 1 } : {}}>

          <a
  href="mailto:jordanasseff@gmail.com"
  className="group bg-gradient-to-r from-purple-800/40 via-green-500/40 to-green-300/90 backdrop-blur-xl border-2 border-green-100 text-white px-12 py-6 2xl:px-20 2xl:py-10 font-black text-lg 2xl:text-2xl tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-100 hover:bg-gradient-to-r hover:from-purple-800/40 hover:via-green-500/40 hover:to-green-300/90 inline-block"
>
  LET'S CONNECT
</a>

        </motion.div>
      </div>
    </section>
  );
};

export default function About() {
  const isMobile = useIsMobile();

  // Performance monitoring for mobile devices
  useEffect(() => {
    if (isMobile && typeof window !== 'undefined') {
      console.log('About page loaded on mobile device - complex animations disabled for performance');
      
      // Monitor performance if needed
      if ('performance' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'measure' && entry.duration > 100) {
              console.warn(`Performance warning: ${entry.name} took ${entry.duration}ms`);
            }
          });
        });
        
        try {
          observer.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
          // PerformanceObserver not supported, ignore
        }
        
        return () => {
          try {
            observer.disconnect();
          } catch (e) {
            // Observer already disconnected, ignore
          }
        };
      }
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white cursor-default overflow-x-hidden">
      {/* Add mobile-specific optimizations */}
      {isMobile && (
        <style jsx>{`
          /* Disable performance-heavy animations on mobile while preserving essential visibility */
          
          /* Allow essential opacity and basic transform animations for content visibility */
          [data-framer-motion-initial] {
            opacity: 1 !important;
          }
          
          /* Disable complex physics animations but allow basic transforms */
          .floating-text-physics,
          .complex-animation,
          .wiggle-letter {
            animation: none !important;
            transform: none !important;
          }
          
          /* Disable continuous/infinite animations - EXCLUDE ALL menu-related elements */
          *[style*="animation-iteration-count: infinite"]:not(nav):not(nav *):not([class*="menu"]):not([class*="menu"] *):not(button):not(.fixed):not(.fixed *),
          *[style*="repeat: -1"]:not(nav):not(nav *):not([class*="menu"]):not([class*="menu"] *):not(button):not(.fixed):not(.fixed *) {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
          
          /* CRITICAL: Preserve ALL menu transitions and animations */
          nav,
          nav *,
          [class*="menu"],
          [class*="menu"] *,
          .fixed.inset-y-0,
          .fixed.inset-y-0 *,
          .fixed.inset-0,
          .fixed.inset-0 *,
          button,
          button *,
          .transition-transform,
          .transition-all,
          .duration-300,
          [class*="translate-x"],
          [class*="lg:translate-x"] {
            animation-duration: 0.3s !important;
            transition-duration: 0.3s !important;
            transition-property: all !important;
            transform: initial !important;
            pointer-events: auto !important;
            cursor: pointer !important;
          }
          
          /* Allow essential UI animations to work */
          .motion-safe\\:animate-pulse,
          .motion-safe\\:animate-bounce,
          .hover\\:scale-105:hover,
          .hover\\:scale-110:hover,
          [data-motion-opacity],
          [data-motion-scale] {
            animation-duration: 0.3s !important;
            transition-duration: 0.3s !important;
          }
          
          /* Ensure motion.div elements with opacity animations work */
          div[style*="opacity"] {
            transition: opacity 0.6s ease !important;
          }
          
          /* Fallback: ensure all content is visible - EXCLUDE ALL interactive elements */
          .motion-div-fallback:not(button):not(a):not(nav):not(nav *):not([class*="menu"]):not([class*="menu"] *):not(.fixed):not(.fixed *) {
            opacity: 1 !important;
            transform: none !important;
          }
          
          /* OVERRIDE: Force menu transitions to work properly */
          .fixed.inset-y-0.left-0 {
            transition: transform 0.3s ease !important;
          }
          
          /* Ensure translate transforms work for menu slide animations */
          .-translate-x-full,
          .translate-x-0,
          .lg\\:translate-x-0 {
            transition: transform 0.3s ease !important;
          }
        `}</style>
      )}
      
      <HeroSection />
      <CollaborationSection />
      <TechSkillsSection />
      <CurrentFocusSection />
      <PersonalSideSection />
      <ClosingCTASection />
    </div>
  );
}
