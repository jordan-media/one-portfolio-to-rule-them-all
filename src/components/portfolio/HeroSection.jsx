import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroContent = {
  developer: {
    title: "Building Digital Experiences",
    subtitle: "Full-Stack Developer",
    description: "I craft elegant solutions with clean code, transforming complex problems into intuitive digital experiences that users love.",
    cta: "View My Code",
    accent: "text-blue-400"
  },
  storyteller: {
    title: "Crafting Compelling Narratives",
    subtitle: "Digital Storyteller",
    description: "I weave stories that resonate, using words and visuals to create meaningful connections between brands and their audiences.",
    cta: "Read My Stories",
    accent: "text-purple-400"
  },
  ux_designer: {
    title: "Designing Human-Centered Solutions",
    subtitle: "UX/UI Designer",
    description: "I design with empathy, creating interfaces that feel natural and delightful while solving real user problems.",
    cta: "Explore My Designs",
    accent: "text-orange-400"
  }
};

export default function HeroSection({ entryPoint = 'developer' }) {
  const content = heroContent[entryPoint];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg font-medium ${content.accent} mb-4`}
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
            <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105">
              {content.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105">
              <Download className="mr-2 w-5 h-5" />
              Download Resume
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
                transition={{ delay: 0.7 + index * 0.1 }}
                className="w-12 h-12 backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
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