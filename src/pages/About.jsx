
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

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
  }, [showScrollCursor]); // Re-run effect when showScrollCursor changes to update conditions

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    if (showScrollCursor) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove); // Clean up listener when not needed
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showScrollCursor]); // Re-run effect when showScrollCursor changes to add/remove listener

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden" // Removed cursor-default from section
      style={{ cursor: showScrollCursor ? 'none' : 'default' }} // Apply dynamic cursor style
    >
      {/* Custom Scroll Cursor */}
      {showScrollCursor && (
        <div
          className="fixed z-50 pointer-events-none" // pointer-events-none ensures it doesn't block clicks
          style={{
            left: cursorPosition.x - 50, // These values might need tweaking based on actual cursor size and desired offset
            top: cursorPosition.y - 15,
            transform: 'translate(-50%, -50%)' // Centers the element on the actual (x,y) point
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
        className="absolute inset-0 opacity-5">

        <div className="absolute top-1/4 right-1/4 w-1 h-96 bg-white transform rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/4 w-0.5 h-64 bg-white transform -rotate-45"></div>
      </motion.div>

      {/* Muted background suggestion - abstract lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-400/30 to-transparent"></div>
        <div className="absolute top-0 right-2/5 w-px h-full bg-gradient-to-b from-blue-400/20 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-white/60 mb-4 2xl:mb-8 uppercase cursor-default"
        >
          FROM STEEL TO CODE
        </motion.p>
        
        {/* Code snippet with typing effect */}
        <motion.p
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-green-400 font-mono text-xs sm:text-sm xl:text-base 2xl:text-lg mb-4 2xl:mb-8 overflow-hidden whitespace-nowrap mx-auto cursor-default"
          style={{ width: "fit-content" }}
        >
          $ build.foundation().withGrit().andCollaboration() ⚡
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tighter mb-12 cursor-default" // Explicitly setting cursor-default for text
        >

          BUILDER AT HEART.
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white/80">
            From high steel to high code,
          </span>
          <br />
          <span className="text-green-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            I focus on collaboration, curiosity,
          </span>
          <br />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/70">
            and creating things that last.
          </span>
        </motion.h1>
      </div>
    </section>);

};

const CollaborationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section ref={ref} className="py-20 sm:py-32 px-6 bg-gradient-to-b from-black to-slate-900 cursor-default">
      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Header Quote - Moved here */}
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8"
            >
              <span className="text-green-400">"100 feet in the air</span>
              <br />
              taught me more about
              <br />
              <span className="text-white/80">collaboration</span>
              <br />
              than any classroom."
            </motion.h2>

            {/* Opening paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed"
            >
              <p>
                Imagine being 100 feet in the air, balancing on a thin piece of steel. Forty feet across, you see your partner. You both have the same objective. In your hands, you each hold one end of a steel beam.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed"
            >
              <p>
                <span className="font-bold text-white">Your voice</span> is speaking to a crane operator who is blind to the entire situation—your carefully chosen words literally define what is happening. <span className="font-bold text-white">Your eyes</span> are tracking four major pinch points while also watching your partner for hand signals on what's happening on their end.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed"
            >
              <p>
                Together, you guide the beam into place, trying to avoid the hundreds of ways it can go wrong. One wrong decision could mean they lose a limb—or worse, their life.
              </p>
            </motion.div>

            {/* Quote */}
            <motion.h3
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-center my-8"
            >
              <span className="text-green-400">"Every big build—</span>
              <br />
              steel or software—
              <br />
              <span className="text-white/80">takes a team."</span>
            </motion.h3>

            {/* Closing paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed"
            >
              <p>
                That's where I learned what collaboration really means. It's not just about working together. It's about <span className="font-bold text-white">patience</span>, <span className="font-bold text-white">empathy</span>, <span className="font-bold text-white">trust</span>, <span className="font-bold text-white">awareness</span>, and <span className="font-bold text-white">accountability</span>.
              </p>
              <p className="mt-4">
                Those lessons from ironworking stay with me every time I sit down to code or design. We can never fully know what it's like to stand in someone else's shoes, but I believe every big build takes a team.
              </p>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 100 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-white/5 to-white/10 rounded-2xl relative overflow-hidden">
              {/* Abstract steel beam visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-2 bg-white/20 transform rotate-12 mb-8"></div>
                  <div className="w-40 h-2 bg-white/30 transform -rotate-6 mb-8"></div>
                  <div className="w-28 h-2 bg-white/25 transform rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LessonsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section ref={ref} className="py-20 sm:py-32 px-6 bg-slate-900 cursor-default">
      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto">
        {/* Split Visual Concept */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20 items-stretch">
          {/* Development Side */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-full"
          >
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-2xl p-8 h-full">
              <h3 className="text-xl font-black mb-6 text-orange-400">DEVELOPMENT INSIGHT</h3>
              <div className="text-white/80 text-sm leading-relaxed">
                React • React Native • Vite • Node.js • TypeScript • JavaScript • HTML5 • CSS3 • CMS Deployment • Terminal • Postman • GitHub • GitHub Actions
              </div>
            </div>
          </motion.div>

          {/* Design Side */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative h-full"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-green-900/20 border border-blue-500/20 rounded-2xl p-8 h-full">
              <h3 className="text-xl font-black mb-6 text-blue-400">DESIGN INSIGHT</h3>
              <div className="text-white/80 text-sm leading-relaxed">
                Premiere Pro • After Effects • Adobe Audition • Figma • Blender • Illustrator • Photoshop • Sketch • AutoCAD
              </div>
            </div>
          </motion.div>

          {/* See My Works Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative group h-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <a
              href="/Projects"
              className="relative block bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer h-full flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-xl font-black mb-6 text-green-400">VIEW WORK</h3>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">Explore my portfolio of projects showcasing development and design skills in action.</p>
              <div className="text-green-400 font-black text-sm tracking-widest uppercase">
                VIEW PROJECTS →
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TechShiftSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section ref={ref} className="py-20 sm:py-32 px-6 bg-gradient-to-b from-slate-900 to-black cursor-default">
      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual Element - Code in Motion */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="relative lg:order-2">

            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-2xl p-6 font-mono text-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/60 ml-2">React Component</span>
              </div>
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-green-400">

                {`const BuildSomethingLasting = () => {
  const [curiosity, setCuriosity] = useState(true);
  const [quality, setQuality] = useState('foundation');
  
  return (
    <div className="build-process">
      {curiosity && <Learn />}
      <Create foundation={quality} />
      <Share impact="lasting" />
    </div>
  );
};`}
              </motion.div>
            </div>

            {/* Design mockup overlay */}
            <div className="absolute -bottom-4 -right-4 w-32 h-24 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-lg p-2">
              <div className="w-full h-2 bg-purple-400/40 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-purple-400/30 rounded mb-1"></div>
              <div className="w-1/2 h-2 bg-purple-400/20 rounded"></div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:order-1">

            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8">

              <span className="text-green-400">"Curiosity</span> keeps me
              <br />
              moving. <span className="text-white/80">Quality</span>
              <br />
              keeps me grounded."
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed space-y-6">

              <p>
                Now, I'm finishing my Web & App Development diploma at BCIT, where I've discovered a new passion: building with <span className="font-bold text-white">React</span>, <span className="font-bold text-white">TypeScript</span>, <span className="font-bold text-white">Vite</span>, and <span className="font-bold text-white">React Native</span>. I've explored deployments, tested workflows, and pushed passion projects live—not just to learn the tools, but to see how ideas come alive in the real world.
              </p>
              <p>
                On the creative side, I've worked with the <span className="font-bold text-white">Adobe Creative Suite</span>, <span className="font-bold text-white">Figma</span>, and <span className="font-bold text-white">Blender</span>, which gives me empathy for designers and a deeper appreciation for how creativity and development connect.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>);

};

const HumanSideSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section ref={ref} className="py-20 sm:py-32 px-6 bg-black cursor-default">
      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}>

            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8">

              <span className="text-green-400">"From raising kids solo</span>
              <br />
              to raising beams skyward,
              <br />
              <span className="text-white/80">grit is my foundation."</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed space-y-6">

              <p>
                Outside of work, you'll usually find me in the outdoors: <span className="font-bold text-white">hiking</span>, <span className="font-bold text-white">snowboarding</span>, <span className="font-bold text-white">surfing</span>, <span className="font-bold text-white">camping</span>, or plunging into ice-cold rivers.
              </p>
              <p>
                I've also been raising two kids as a single dad for the last seven years, which has given me <span className="font-bold text-white">grit</span>, <span className="font-bold text-white">patience</span>, and <span className="font-bold text-white">adaptability</span> in ways no classroom ever could.
              </p>
            </motion.div>

            {/* Activities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">

              {['🏂 Snowboarding', '🥾 Hiking', '🏄‍♂️ Surfing', '🏕️ Camping'].map((activity, index) =>
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-sm text-white/80">{activity}</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Visual Element - Nature Abstract */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 100 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative">

            <div className="aspect-[4/5] bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl relative overflow-hidden">
              {/* Abstract nature + steel fusion */}
              <div className="absolute inset-0">
                {/* Mountain/wave shapes */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-400/10 to-transparent"></div>
                <div className="absolute bottom-1/4 left-0 right-0 h-px bg-green-400/30"></div>
                <div className="absolute bottom-1/2 left-0 right-0 h-px bg-blue-400/20"></div>
                
                {/* Steel beam integration */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-1 bg-white/20 transform rotate-12 mb-4"></div>
                  <div className="w-32 h-1 bg-white/30 transform -rotate-6"></div>
                </div>
                
                {/* Central element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚡</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

};

const ClosingCTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section ref={ref} className="py-20 sm:py-32 px-6 bg-gradient-to-b from-black to-slate-900 cursor-default">
      <div className="max-w-5xl 2xl:max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-8">

          <span className="text-green-400">"Outdoors or online,</span>
          <br />
          <span className="text-white/80">I build things to last."</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">

          I believe in staying curious, staying strong, and building things that matter—whether that's steel in the sky, code on a screen, or relationships that make both possible.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}>

          <a
            href="mailto:hello@portfolio.com"
            className="group relative bg-white text-black px-12 py-6 font-black text-lg tracking-widest uppercase overflow-hidden transition-all duration-500 hover:scale-105 rounded-xl inline-block cursor-pointer">

            <span className="relative z-10">LET'S CONNECT</span>
            <div className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-black tracking-widest">
              LET'S CONNECT
            </span>
          </a>
        </motion.div>
      </div>
    </section>);

};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white cursor-default">
      <HeroSection />
      <CollaborationSection />
      <LessonsSection />
      <TechShiftSection />
      <HumanSideSection />
      <ClosingCTASection />
    </div>
  );
}
