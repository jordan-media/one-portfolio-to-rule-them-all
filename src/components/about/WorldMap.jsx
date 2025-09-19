
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const locations = [
  { 
    name: 'Germany', 
    x: 52, 
    y: 35,
    description: 'Creative development & innovation',
    years: '2018-2020'
  },
  { 
    name: 'Halifax', 
    x: 22, 
    y: 28,
    description: 'Roots & early inspiration',
    years: 'Born & raised'
  },
  { 
    name: 'Vancouver', 
    x: 12, 
    y: 25,
    description: 'Design & user experience focus',
    years: '2020-2022'
  },
  { 
    name: 'Japan', 
    x: 85, 
    y: 40,
    description: 'Cultural immersion & perspective',
    years: '2019'
  }
];

export default function WorldMap() {
  const mapRef = useRef(null);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* World Map Container - Responsive */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-white/5 to-white/10 rounded-3xl overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        {/* Your uploaded world map - Properly scaled and responsive */}
        <div className="absolute inset-0 p-4 sm:p-6 md:p-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68a0d4d0bc543c79d8cbfd4e/b11d4b8bb_image-from-rawpixel-id-6285610-png.png"
            alt="World Map"
            className="w-full h-full object-contain opacity-40 hover:opacity-50 transition-opacity duration-500"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </div>

        {/* Connection lines between locations - Responsive SVG */}
        <svg 
          viewBox="0 0 100 60" 
          className="w-full h-full absolute inset-0 pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <g stroke="rgba(34, 197, 94, 0.4)" strokeWidth="0.2" fill="none">
            <motion.path
              d={`M${locations[1].x} ${locations[1].y} Q${(locations[1].x + locations[2].x)/2} ${locations[1].y - 5} ${locations[2].x} ${locations[2].y}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="animate-pulse"
            />
            <motion.path
              d={`M${locations[2].x} ${locations[2].y} Q${(locations[2].x + locations[0].x)/2} ${locations[2].y - 8} ${locations[0].x} ${locations[0].y}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
              className="animate-pulse"
            />
            <motion.path
              d={`M${locations[0].x} ${locations[0].y} Q${(locations[0].x + locations[3].x)/2} ${locations[0].y - 10} ${locations[3].x} ${locations[3].y}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 2 }}
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* Responsive Location Markers */}
        {locations.map((location, index) => (
          <motion.div
            key={location.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.3,
              type: "spring",
              stiffness: 300
            }}
            whileHover={{ scale: 1.2 }}
          >
            {/* Enhanced glowing orb - Responsive sizing */}
            <div className="relative">
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-xl relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-white rounded-full opacity-40 animate-pulse"></div>
                {/* Pulse rings */}
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-green-400/30 to-blue-500/30 rounded-full animate-pulse delay-500"></div>
                <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full animate-pulse delay-1000"></div>
              </div>
              
              {/* Compact hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-black/95 backdrop-blur-xl border border-white/30 rounded-lg p-3 min-w-32 max-w-48 text-center shadow-xl">
                  <h4 className="font-bold text-white text-sm mb-1">{location.name}</h4>
                  <p className="text-green-400 text-xs font-mono mb-2 px-2 py-0.5 bg-green-400/10 rounded-full border border-green-400/20">
                    {location.years}
                  </p>
                  <p className="text-white/80 text-xs leading-tight">{location.description}</p>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/95 rotate-45 -mt-1 border-r border-b border-white/30"></div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Enhanced floating particles - Responsive count */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: window.innerWidth > 768 ? 20 : 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gradient-to-r from-green-400/40 to-blue-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        {/* Corner decorations - Responsive text */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white/10 font-mono text-xs">
          <div className="hidden sm:block">Global Experience</div>
          <div className="text-green-400/40 text-xs">4 Countries • 6+ Years</div>
        </div>
      </div>

      {/* Location Grid with enhanced cards - Responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        {locations.map((location, index) => (
          <motion.div
            key={location.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform"></div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1 group-hover:text-green-400 transition-colors">{location.name}</h4>
              <p className="text-green-400 text-xs font-mono mb-1 sm:mb-2 px-2 py-1 bg-green-400/10 rounded-full border border-green-400/20">{location.years}</p>
              <p className="text-white/70 text-xs leading-relaxed">{location.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
