import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Pen, Palette, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Content } from '@/api/entities';

const defaultServices = {
  developer: [
    {
      title: "Full-Stack Development",
      description: "End-to-end web application development using modern frameworks and technologies",
      icon: "Code"
    },
    {
      title: "API Development",
      description: "RESTful and GraphQL API design and implementation for scalable applications",
      icon: "Code"
    },
    {
      title: "Performance Optimization",
      description: "Speed optimization and performance tuning for web applications",
      icon: "Code"
    }
  ],
  storyteller: [
    {
      title: "Brand Storytelling",
      description: "Crafting compelling narratives that connect your brand with your audience",
      icon: "Pen"
    },
    {
      title: "Content Strategy",
      description: "Strategic content planning and creation for maximum engagement",
      icon: "Pen"
    },
    {
      title: "Video Production",
      description: "Professional video content creation from concept to final edit",
      icon: "Pen"
    }
  ],
  ux_designer: [
    {
      title: "User Research",
      description: "In-depth user research and analysis to inform design decisions",
      icon: "Palette"
    },
    {
      title: "UI/UX Design",
      description: "Beautiful and functional interface design that users love",
      icon: "Palette"
    },
    {
      title: "Design Systems",
      description: "Comprehensive design systems for consistent user experiences",
      icon: "Palette"
    }
  ]
};

const iconMap = {
  Code: Code,
  Pen: Pen,
  Palette: Palette
};

export default function ServicesSection({ entryPoint = 'developer' }) {
  const [services, setServices] = useState(defaultServices[entryPoint] || []);

  useEffect(() => {
    loadDynamicServices();
  }, [entryPoint]);

  const loadDynamicServices = async () => {
    try {
      const servicesContent = await Content.filter({
        section: 'services',
        entry_point: entryPoint,
        active: true
      }, 'order');

      if (servicesContent.length > 0) {
        const dynamicServices = servicesContent.map(service => ({
          title: service.title,
          description: service.description,
          icon: service.metadata?.icon || 'Code',
          cta_text: service.cta_text,
          cta_url: service.cta_url
        }));
        setServices(dynamicServices);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Keep default services as fallback
    }
  };

  const getSectionTitle = () => {
    switch(entryPoint) {
      case 'developer': return 'Development Services';
      case 'storyteller': return 'Storytelling Services';
      case 'ux_designer': return 'Design Services';
      default: return 'Services';
    }
  };

  const getAccentColor = () => {
    switch(entryPoint) {
      case 'developer': return 'from-blue-500 to-cyan-400';
      case 'storyteller': return 'from-purple-500 to-pink-400';
      case 'ux_designer': return 'from-orange-500 to-yellow-400';
      default: return 'from-blue-500 to-cyan-400';
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {getSectionTitle()}
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Specialized services tailored to bring your vision to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getAccentColor()} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      className="text-white/70 hover:text-white hover:bg-white/10 p-0"
                    >
                      {service.cta_text || 'Learn More'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help bring your project to life with my expertise
            </p>
            <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-medium">
              Start a Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}