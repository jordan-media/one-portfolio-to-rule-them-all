import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, User, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md bg-black/70"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Hero Image/Video */}
              <div className="relative h-64 md:h-80 rounded-t-3xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Code className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50">Project Preview</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.category === 'development' ? 'bg-blue-500/20 text-blue-300' :
                        project.category === 'storytelling' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-orange-500/20 text-orange-300'
                      }`}>
                        {project.category?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {project.title}
                    </h2>
                    <p className="text-xl text-white/70">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    {project.project_url && (
                      <Button
                        size="lg"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white"
                        asChild
                      >
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/20 hover:bg-white/10 backdrop-blur-lg text-white"
                        asChild
                      >
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="md:col-span-2">
                    <div className="space-y-8">
                      {/* Detailed Description */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Project Overview</h3>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                          <p className="text-white/80 leading-relaxed">
                            {project.detailed_description || project.description}
                          </p>
                        </div>
                      </div>

                      {/* Gallery */}
                      {project.gallery_images && project.gallery_images.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4">Project Gallery</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {project.gallery_images.map((image, index) => (
                              <div key={index} className="aspect-video rounded-xl overflow-hidden bg-white/5">
                                <img
                                  src={image}
                                  alt={`${project.title} screenshot ${index + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Video */}
                      {project.video_url && (
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4">Demo Video</h3>
                          <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
                            <video
                              src={project.video_url}
                              controls
                              className="w-full h-full"
                              poster={project.image_url}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Project Details */}
                    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Project Details</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-white/80">
                          <User className="w-4 h-4 text-white/50" />
                          <div>
                            <p className="text-sm text-white/50">Role</p>
                            <p className="font-medium">{project.role}</p>
                          </div>
                        </div>
                        {project.completion_date && (
                          <div className="flex items-center gap-3 text-white/80">
                            <Calendar className="w-4 h-4 text-white/50" />
                            <div>
                              <p className="text-sm text-white/50">Completed</p>
                              <p className="font-medium">
                                {new Date(project.completion_date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-white mb-4">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm text-white/80 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}