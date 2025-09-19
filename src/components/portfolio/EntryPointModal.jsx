
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Pen, Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const entryPoints = [
  {
    id: 'developer',
    title: 'Developer',
    icon: Code,
    description: 'Explore my technical projects and code craftsmanship',
    gradient: 'from-blue-500 to-cyan-400',
    color: 'text-blue-300'
  },
  {
    id: 'storyteller',
    title: 'Storyteller',
    icon: Pen,
    description: 'Discover narratives that captivate and inspire',
    gradient: 'from-purple-500 to-pink-400',
    color: 'text-purple-300'
  },
  {
    id: 'ux_designer',
    title: 'UX Designer',
    icon: Palette,
    description: 'Experience user-centered design solutions',
    gradient: 'from-orange-500 to-yellow-400',
    color: 'text-orange-300'
  }
];

export default function EntryPointModal({ isOpen, onSelect, onClose }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleSelect = (entryId) => {
    setSelectedEntry(entryId);
    setTimeout(() => {
      onSelect(entryId);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Enhanced Backdrop with extra blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-xl bg-black/60"
            onClick={onClose}
          />

          {/* Modal with enhanced glass effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl mx-auto"
          >
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Subtle light leak in modal */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-pink-400/20 to-purple-500/15 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-cyan-400/15 to-blue-500/10 rounded-full blur-2xl"></div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-12 relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  Welcome to My Portfolio
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-white/80 max-w-2xl mx-auto"
                >
                  Choose your path to explore my work through different lenses
                </motion.p>
              </div>

              {/* Entry Points */}
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                {entryPoints.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`cursor-pointer transform transition-all duration-300 ${
                      selectedEntry === entry.id ? 'scale-105' : 'hover:scale-105'
                    }`}
                    onClick={() => handleSelect(entry.id)}
                  >
                    <div className={`backdrop-blur-lg bg-white/5 border border-white/15 rounded-2xl p-8 h-full text-center transition-all duration-500 hover:bg-white/10 hover:border-white/25 hover:shadow-xl relative overflow-hidden ${
                      selectedEntry === entry.id ? 'bg-white/15 border-white/30 shadow-2xl' : ''
                    }`}>
                      {/* Card light leak */}
                      <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-bl ${entry.gradient}/20 rounded-full blur-2xl transition-opacity duration-500 ${
                        selectedEntry === entry.id ? 'opacity-100' : 'opacity-0 hover:opacity-60'
                      }`}></div>
                      
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${entry.gradient} p-4 shadow-xl relative z-10`}>
                        <entry.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{entry.title}</h3>
                      <p className="text-white/70 leading-relaxed relative z-10">{entry.description}</p>
                      
                      {selectedEntry === entry.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-6 relative z-10"
                        >
                          <div className="w-8 h-1 bg-gradient-to-r from-white/50 to-white/20 rounded-full mx-auto" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-8 relative z-10"
              >
                <p className="text-white/50 text-sm">Click on any option above to personalize your experience</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
