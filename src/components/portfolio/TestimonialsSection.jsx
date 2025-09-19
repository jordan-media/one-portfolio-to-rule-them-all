import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/api/entities';

export default function TestimonialsSection({ entryPoint = 'developer' }) {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, [entryPoint]);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      // Load testimonials for this entry point or general ones
      const data = await Testimonial.list('-created_date');
      const filtered = data.filter(t => 
        t.project_category === entryPoint || t.project_category === 'all'
      );
      setTestimonials(filtered);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-white/10 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 animate-pulse">
                <div className="h-20 bg-white/10 rounded-lg mb-4" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded mb-1" />
                    <div className="h-3 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Clients Say
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Don't just take my word for it - here's what people I've worked with have to say
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105"
    >
      {/* Quote Icon */}
      <div className="mb-6">
        <Quote className="w-8 h-8 text-white/30" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array(testimonial.rating || 5).fill(0).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-white/80 leading-relaxed mb-6 italic">
        "{testimonial.testimonial_text}"
      </p>

      {/* Client Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center">
          {testimonial.client_image_url ? (
            <img
              src={testimonial.client_image_url}
              alt={testimonial.client_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold">
              {testimonial.client_name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-white">{testimonial.client_name}</p>
          <p className="text-white/60 text-sm">
            {testimonial.client_title}
            {testimonial.client_company && (
              <span> at {testimonial.client_company}</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}