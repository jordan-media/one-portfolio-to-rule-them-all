
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
// import SimpleFloatingDemo from '../components/locomotive/SimpleFloatingDemo.jsx';

// Move elementSize outside component to avoid dependency issues
const ELEMENT_SIZE = { width: 120, height: 32 };

// FloatingText component for animated skill tags
const FloatingText = ({ children, delay = 0, containerBounds, allPositions, index, onPositionUpdate }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const animationRef = useRef(null);

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

  // Animation loop with improved physics
  useEffect(() => {
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
  }, [position, velocity, allPositions, index, delay, containerBounds, onPositionUpdate]);


  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        x: { duration: 0 }, // Position updates are continuous via RAF, no motion transition
        y: { duration: 0 }
      }}
      className="absolute bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-xs 2xl:text-sm font-medium text-white/80 hover:bg-white/10 hover:scale-110 transition-all duration-300 select-none pointer-events-none"
      whileHover={{ scale: 1.1 }}
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
          className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-white/60 mb-6 sm:mb-8 2xl:mb-12 uppercase cursor-default"
        >
          FROM STEEL TO CODE
        </motion.p>

        {/* Code snippet with typing effect */}
        <motion.p
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg mb-8 sm:mb-12 2xl:mb-16 overflow-hidden whitespace-nowrap mx-auto cursor-default"
          style={{ width: "fit-content" }}
        >
          $ build.foundation().withGrit().andCollaboration() ⚡
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="leading-tight tracking-tighter cursor-default"
        >
          {/* Main Title - Largest with ultra-wide scaling */}
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-black mb-4 sm:mb-6 2xl:mb-10">
            a BUILDER at HEART.
          </span>

          {/* Secondary Line - Medium, distinct color */}
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-bold text-white/80 mb-4 sm:mb-6 2xl:mb-8">
            Quality - Authenticity
          </span>

          {/* Tertiary Line - Smaller, accent color */}
          <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-semibold text-green-400 mb-4 sm:mb-6 2xl:mb-8">
            UxD instincts since RollerCoaster Tycoon '99
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

  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-gradient-to-b from-black to-slate-900 cursor-default overflow-hidden">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Opening Quote - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24 2xl:mb-32"
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
    className="lg:col-span-2"
  >
    <div className="aspect-[4/5] rounded-2xl 2xl:rounded-3xl overflow-hidden border border-orange-500/20">
      <img
        src="/assets/images/jordan/JAHeadShot.png"
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
    className="lg:col-span-3"
  >
    <div className="space-y-6 2xl:space-y-10">
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        Imagine being 100 feet in the air, balancing on a thin piece of steel. 
        Forty feet across, you see your partner. You both have the same objective. 
        In your hands, you each hold one end of a steel beam.
      </p>
      <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
        <span className="font-bold text-white">Your voice</span> is speaking to a crane operator who is blind to the entire situation—your carefully chosen words literally define what is happening.
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
            className="lg:col-span-3"
          >
            <div className="space-y-6 2xl:space-y-10">
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                <span className="font-bold text-white">Your eyes</span> are tracking four major pinch points while also watching your partner for hand signals on what's happening on their end.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                Together, you guide the beam into place, trying to avoid the hundreds of ways it can go wrong. One wrong decision could mean they lose a limb—or worse, their life.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl 2xl:rounded-3xl relative overflow-hidden border border-blue-500/20">
              {/* Communication visualization */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 2xl:w-3 2xl:h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-2 h-2 2xl:w-3 2xl:h-3 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-1/4 left-1/2 w-2 h-2 2xl:w-3 2xl:h-3 bg-blue-300 rounded-full animate-pulse delay-600"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 2xl:w-32 2xl:h-32 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl 2xl:text-5xl">👁️</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 2xl:top-6 2xl:left-6 text-xs 2xl:text-sm font-mono text-blue-400/80">4 PINCH POINTS</div>
              <div className="absolute bottom-4 right-4 2xl:bottom-6 2xl:right-6 text-xs 2xl:text-sm font-mono text-cyan-400/80">CONSTANT WATCH</div>
            </div>
          </motion.div>
        </div>

        {/* Closing Quote - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16 sm:mb-24 2xl:mb-32"
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-8xl font-black tracking-tight leading-tight mb-8 2xl:mb-12">
            <span className="text-green-300">Every big build —</span>
            <br />
            <span className="text-white">steel or software —</span>
            <br />
            <span className="text-white/80">takes a team.</span>
          </h3>
        </motion.div>

        {/* Lessons Learned - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl 2xl:max-w-6xl mx-auto text-center"
        >
          <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed mb-8 2xl:mb-12">
            That's where I learned what collaboration really means. It's not just about working together. It's about
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"> patience, empathy, trust, awareness </span>
           and <span className="font-bold text-white">accountability</span>.
          </p>
          <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
            Those lessons from ironworking stay with me every time I sit down to code or design. We can never fully know what it's like to stand in someone else's shoes, but I believe every big build takes a team.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const TechSkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  // State to track all floating element positions (only 'position' is stored as per outline)
  const [devPositions, setDevPositions] = useState(Array(6).fill(null));
  const [designPositions, setDesignPositions] = useState(Array(6).fill(null));

  // Outline specifies fixed container dimensions for the floating tags' logic.
  // This means the dynamic `devSkillsContainerRef` and `designSkillsContainerRef` logic is removed for `containerBounds`.
  const containerBounds = { width: 350, height: 300 };

  // Callbacks for FloatingText to update its current position in the parent's state
  // Memoized with useCallback for stability, as they are dependencies in FloatingText's useEffect
  const updateDevPosition = useCallback((index, position) => {
    setDevPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = position;
      return newPositions;
    });
  }, []);

  const updateDesignPosition = useCallback((index, position) => {
    setDesignPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = position;
      return newPositions;
    });
  }, []);


  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-slate-900 cursor-default">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Development and Design Skills - 2 Column Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 2xl:gap-32 items-stretch mb-12 lg:mb-20 2xl:mb-32">
          {/* Development Skills */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="relative h-full"
          >
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-2xl 2xl:rounded-3xl p-8 2xl:p-12 h-full relative overflow-hidden min-h-[400px] 2xl:min-h-[500px]">
              {/* Fixed Title */}
              <div className="relative z-20 mb-6 2xl:mb-10">
                <h3 className="text-xl 2xl:text-3xl font-black text-orange-400">DEVELOPMENT</h3>
              </div>

              {/* Floating Skills Container */}
              <div className="relative w-full h-full">
                {isInView && ( // Only render FloatingText when section is in view
                  <>
                    {[
                      'React & React Native', 'Vite & Node.js', 'TypeScript & JavaScript',
                      'HTML5 & CSS3', 'CMS Deployment', 'Terminal & GitHub Actions'
                    ].map((tech, index) => (
                      <FloatingText
                        key={tech}
                        delay={0.2 + index * 0.2}
                        containerBounds={containerBounds}
                        allPositions={devPositions}
                        index={index}
                        onPositionUpdate={updateDevPosition}
                      >
                        {tech}
                      </FloatingText>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Design Skills */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-green-900/20 border border-blue-500/20 rounded-2xl 2xl:rounded-3xl p-8 2xl:p-12 h-full relative overflow-hidden min-h-[400px] 2xl:min-h-[500px]">
              {/* Fixed Title */}
              <div className="relative z-20 mb-6 2xl:mb-10">
                <h3 className="text-xl 2xl:text-3xl font-black text-blue-400">DESIGN</h3>
              </div>

              {/* Floating Skills Container */}
              <div className="relative w-full h-full">
                {isInView && ( // Only render FloatingText when section is in view
                  <>
                    {[
                      'Figma & Adobe Suite', 'Premiere Pro & After Effects', 'Blender & 3D Modeling',
                      'Illustrator & Photoshop', 'AutoCAD & Technical Drawing', 'UI/UX Prototyping'
                    ].map((skill, index) => (
                      <FloatingText
                        key={skill}
                        delay={0.4 + index * 0.2}
                        containerBounds={containerBounds}
                        allPositions={designPositions}
                        index={index}
                        onPositionUpdate={updateDesignPosition}
                      >
                        {skill}
                      </FloatingText>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* See the Work Button - Styled like footer button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <a
              href="/Projects"
              className="relative flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/10 text-white px-6 sm:px-8 py-4 sm:py-6 font-bold text-sm sm:text-lg tracking-wider transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <span className="cursor-default">SEE All WORK</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 cursor-default">Ready</span>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



const CurrentFocusSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-gradient-to-b from-slate-900 to-black cursor-default">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Opening Quote */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24 2xl:mb-32"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-[9rem] font-black leading-relaxed tracking-tight">
            <span className="text-green-300">Curiosity</span> <span className="text-white">keeps me</span>
            <br />
            <span className="text-white italic">- moving </span> <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"> - - -</span> <br /> <span className="text-white/60">Quality</span>
            <br />
            <span className="text-white">keeps me</span> <span className="text-green-300">grounded.</span>
          </h2>
        </motion.div>

        {/* Current Learning - Image Right, Text Left */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 2xl:gap-24 items-center mb-16 sm:mb-24 2xl:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6 2xl:space-y-10">
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                Now, I'm finishing my Web & App Development diploma at BCIT, where I've discovered a new passion: building with <span className="font-bold text-white">React</span>, <span className="font-bold text-white">TypeScript</span>, <span className="font-bold text-white">Vite</span>, and <span className="font-bold text-white">React Native</span>.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                I've explored deployments, tested workflows, and pushed passion projects live—not just to learn the tools, but to see how ideas come alive in the real world.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-2xl 2xl:rounded-3xl p-6 2xl:p-10 font-mono text-sm 2xl:text-lg overflow-hidden">
              <div className="flex items-center gap-2 mb-4 2xl:mb-8">
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 bg-green-500 rounded-full"></div>
                <span className="text-white/60 ml-2 2xl:text-xl">React App</span>
              </div>
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-green-400 2xl:text-xl 2xl:leading-relaxed">

                {`const LearnAndBuild = () => {
  const [curiosity] = useState(true);
  const [skills] = useSkills('growing');

  return (
    <div className="developer">
      <Learn constantly />
      <Build projects />
      <Share knowledge />
    </div>
  );
};`}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Creative Side - Text Right, Image Left */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 2xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl 2xl:rounded-3xl relative overflow-hidden border border-purple-500/20">
              {/* Creative tools visualization */}
              <div className="absolute inset-0">
                <div className="absolute top-6 left-6 2xl:top-8 2xl:left-8 w-8 h-8 2xl:w-12 2xl:h-12 bg-purple-400/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm 2xl:text-lg">Ps</span>
                </div>
                <div className="absolute top-6 right-6 2xl:top-8 2xl:right-8 w-8 h-8 2xl:w-12 2xl:h-12 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm 2xl:text-lg">Ai</span>
                </div>
                <div className="absolute bottom-6 left-6 2xl:bottom-8 2xl:left-8 w-8 h-8 2xl:w-12 2xl:h-12 bg-pink-400/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm 2xl:text-lg">Pr</span>
                </div>
                <div className="absolute bottom-6 right-6 2xl:bottom-8 2xl:right-8 w-8 h-8 2xl:w-12 2xl:h-12 bg-orange-400/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm 2xl:text-lg">Fg</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 2xl:w-32 2xl:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl 2xl:text-5xl">🎨</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6 2xl:space-y-10">
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                On the creative side, I've worked with the <span className="font-bold text-white">Adobe Creative Suite</span>, <span className="font-bold text-white">Figma</span>, and <span className="font-bold text-white">Blender</span>, which gives me empathy for designers and a deeper appreciation for how creativity and development connect.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                This combination allows me to bridge the gap between technical implementation and user experience, creating solutions that are both functional and beautiful.
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

  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-black cursor-default">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Opening Quote */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24 2xl:mb-32"
        >
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl 2xl:text-[10rem] font-black tracking-tight leading-tight">
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

        {/* Life Balance - Text and Activities */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 2xl:gap-32 items-start">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6 2xl:space-y-10">
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                Outside of work, you'll usually find me in the outdoors: <span className="font-bold text-white">hiking</span>, <span className="font-bold text-white">snowboarding</span>, <span className="font-bold text-white">surfing</span>, <span className="font-bold text-white">camping</span>, or plunging into ice-cold rivers.
              </p>
              <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 leading-relaxed">
                I've also been raising two kids as a single dad for the last seven years, which has given me
                <span className="font-bold text-white"> grit</span>, 
                
                <span className="font-bold text-white"> patience</span>
                , and 
                <span className="font-bold text-white"> adaptability </span>
                 in ways that you may only understand if you've been there yourself.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Activities Grid */}

           
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-3 gap-4 2xl:gap-6">
              {[
                { emoji: '🏂', label: 'Snowboarding', color: 'from-blue-300 to-cyan-300' },
{ emoji: '🥾', label: 'Hiking', color: 'from-green-300 to-emerald-300' },
{ emoji: '🚴‍♂️', label: 'Biking', color: 'from-orange-300 to-red-300' },
{ emoji: '🏄‍♂️', label: 'Surfing', color: 'from-blue-300 to-teal-300' },
{ emoji: '🏕️', label: 'Camping', color: 'from-amber-300 to-orange-300' },
{ emoji: '🏒', label: 'Hockey', color: 'from-indigo-300 to-blue-300' },
{ emoji: '⚽', label: 'Soccer', color: 'from-green-300 to-lime-300' },
{ emoji: '👨‍👧‍👦', label: 'Dad Life', color: 'from-pink-300 to-rose-300' },

              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className={`bg-gradient-to-br ${activity.color} border border-white/10 rounded-xl 2xl:rounded-2xl p-4 sm:p-2 2xl:p-6 text-center hover:scale-105 transition-all duration-300 flex items-center justify-center aspect-square group cursor-pointer`}
                  title={activity.label}
                >
                  <span className="text-2xl sm:text-6xl lg:text-5xl xl:text-7xl 2xl:text-8xl select-none group-hover:scale-110 transition-transform duration-300">
                    {activity.emoji}
                  </span>
                </motion.div>
              ))}
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

  return (
    <section ref={ref} className="py-20 sm:py-32 2xl:py-48 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 bg-gradient-to-b from-black to-slate-900 cursor-default">
      <div className="w-full max-w-8xl 2xl:max-w-[120rem] mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-black tracking-tight leading-tight mb-8 2xl:mb-16">

          <span className="text-green-400">"Outdoors or online,</span>
          <br />
          <span className="text-white/80">I build things to last."</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl xl:text-3xl 2xl:text-5xl text-white/80 max-w-5xl 2xl:max-w-8xl mx-auto mb-12 2xl:mb-20 leading-relaxed">

          I believe in <span className="font-bold text-cyan-400">staying curious</span>, staying strong, and building things that matter—whether that's steel in the sky, <span className="font-bold text-cyan-400">code on the screen</span>, or relationships that make both possible.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}>

          <a
            href="mailto:jordanasseff@gmail.com"
            className="group relative bg-white text-black px-12 py-6 2xl:px-20 2xl:py-10 font-black text-lg 2xl:text-2xl tracking-widest uppercase overflow-hidden transition-all duration-500 hover:scale-105 inline-block cursor-pointer">

            <span className="relative z-10">LET'S CONNECT</span>
            <div className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-black tracking-widest">
              LET'S CONNECT
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white cursor-default overflow-x-hidden">
      <HeroSection />
      <CollaborationSection />
      <TechSkillsSection />
      <CurrentFocusSection />
      <PersonalSideSection />
      <ClosingCTASection />
    </div>
  );
}
