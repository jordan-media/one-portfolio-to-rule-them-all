
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Content } from '@/api/entities';

const defaultContent = {
  developer: {
    title: "Building Digital Experiences",
    subtitle: "Full-Stack Developer",
    description: "I craft elegant solutions with clean code, transforming complex problems into intuitive digital experiences that users love.",
    cta_text: "View My Code",
    metadata: { accent_color: "text-blue-400" }
  },
  storyteller: {
    title: "Crafting Compelling Narratives",
    subtitle: "Digital Storyteller", 
    description: "I weave stories that resonate, using words and visuals to create meaningful connections between brands and their audiences.",
    cta_text: "Read My Stories",
    metadata: { accent_color: "text-purple-400" }
  },
  ux_designer: {
    title: "Designing Human-Centered Solutions",
    subtitle: "UX/UI Designer",
    description: "I design with empathy, creating interfaces that feel natural and delightful while solving real user problems.",
    cta_text: "Explore My Designs",
    metadata: { accent_color: "text-orange-400" }
  }
};

export default function DynamicHero({ entryPoint = 'developer' }) {
  const [content, setContent] = useState(defaultContent[entryPoint]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadDynamicContent();
  }, [entryPoint]);

  const loadDynamicContent = async () => {
    try {
      // Load hero content for this entry point
      const heroContent = await Content.filter({
        section: 'hero',
        entry_point: entryPoint,
        active: true
      }, 'order', 1);

      if (heroContent.length > 0) {
        setContent(heroContent[0]);
      }

      // Load stats content
      const statsContent = await Content.filter({
        section: 'hero',
        entry_point: entryPoint,
        active: true
      });

      const allStats = statsContent
        .filter(item => item.metadata?.stats)
        .flatMap(item => item.metadata.stats);
      
      setStats(allStats);
    } catch (error) {
      console.error('Error loading dynamic content:', error);
      // Fallback to default content
      setContent(defaultContent[entryPoint]);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Additional hero-specific light effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '13s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-l from-orange-400/8 via-yellow-500/5 to-pink-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '14s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg font-medium ${content.metadata?.accent_color || 'text-blue-400'} mb-4`}
          >
            {content.subtitle}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {content.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {content.cta_text || "Explore My Work"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Download className="mr-2 w-5 h-5" />
              Download Resume
            </Button>
          </motion.div>

          {/* Enhanced Dynamic Stats */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto"
            >
              {stats.slice(0, 4).map((stat, index) => (
                <div key={index} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-6"
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#", label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="w-12 h-12 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
