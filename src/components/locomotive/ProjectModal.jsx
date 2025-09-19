
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, User, ArrowLeft, ArrowRight, Home, Briefcase, Mail, MapPin, Code, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
// The createPageUrl import was removed as it is not used within this file,
// aligning with the instruction that its usage would be removed and promoting cleaner code.

const ProjectModal = ({ project, isOpen, onClose, allProjects = [], onNavigateToProject }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isOpen && project) {
      // Notify the layout about current project
      window.dispatchEvent(new CustomEvent('project-view', {
        detail: project
      }));
      document.body.style.overflow = 'hidden';
    } else {
      // Notify the layout that project view closed and reset scroll progress
      window.dispatchEvent(new CustomEvent('project-close'));
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { detail: { progress: 0 } }));
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { detail: { progress: 0 } }));
    };
  }, [isOpen, project]);

  // Handle scroll progress tracking for project modal
  useEffect(() => {
    if (!isOpen) return;

    const scrollableDiv = document.querySelector('.project-modal-scrollable');
    if (!scrollableDiv) return;

    const handleScroll = () => {
      const scrollTop = scrollableDiv.scrollTop;
      const scrollHeight = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      
      // Dispatch scroll progress to layout
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { 
        detail: { progress } 
      }));
    };

    // Set initial scroll progress when modal opens and scrollableDiv is available
    // This helps if content is already scrolled from a previous open, or just to get an initial 0%.
    // Timeout ensures it runs after layout renders and scrollHeight is accurate.
    const initialScrollTimeout = setTimeout(() => {
      handleScroll(); // Call once to set initial progress
    }, 100);

    scrollableDiv.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(initialScrollTimeout);
      scrollableDiv.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]); // Depend on isOpen to attach/detach listener

  if (!project) return null;

  // Find current project index for navigation
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const handleNavigateToProject = (targetProject) => {
    if (onNavigateToProject) {
      // Reset scroll progress when navigating to new project
      setScrollProgress(0);
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { detail: { progress: 0 } }));
      // Scroll to top of the modal content
      const scrollableDiv = document.querySelector('.project-modal-scrollable');
      if (scrollableDiv) {
        scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
      }
      onNavigateToProject(targetProject);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex"
        >
          {/* Sidebar Spacer - Updated for compact sidebar */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0"></div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen">
            {/* Header */}
            <div className="flex-shrink-0 bg-black/95 backdrop-blur-xl border-b border-white/10 z-20">
              <div className="flex items-center justify-between p-4 sm:p-6">
                {/* Left - Close & Breadcrumb */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:block text-sm">Close</span>
                  </button>
                  
                  <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-white/50">
                    <Link to="/" className="hover:text-white/80 transition-colors">
                      <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                    <span>/</span>
                    <Link to="/Projects" className="hover:text-white/80 transition-colors">
                      Projects
                    </Link>
                    <span>/</span>
                    <span className="text-white/80 truncate max-w-24 sm:max-w-none">{project.title}</span>
                  </div>
                </div>

                {/* Right - Quick Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to="/Projects"
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  >
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:block">All Projects</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-y-auto project-modal-scrollable"
            >
              {/* Hero Section */}
              <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                )}
                
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs sm:text-sm font-bold tracking-[0.3em] text-white/60 mb-6 sm:mb-8 uppercase"
                  >
                    {project.category?.replace('_', ' ')}
                  </motion.p>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8"
                  >
                    {project.title}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-12"
                  >
                    {project.description}
                  </motion.p>

                  {/* Project Navigation Buttons in Hero */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  >
                    {prevProject && (
                      <button
                        onClick={() => handleNavigateToProject(prevProject)}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-xs sm:text-sm group backdrop-blur-sm w-full sm:w-auto"
                        title={`Previous: ${prevProject.title}`}
                      >
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="truncate">Previous Project</span>
                      </button>
                    )}
                    
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 backdrop-blur-sm">
                      {currentIndex + 1} of {allProjects.length}
                    </div>
                    
                    {nextProject && (
                      <button
                        onClick={() => handleNavigateToProject(nextProject)}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-xs sm:text-sm group backdrop-blur-sm w-full sm:w-auto"
                        title={`Next: ${nextProject.title}`}
                      >
                        <span className="truncate">Next Project</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Project Details */}
              <div className="px-4 sm:px-6 py-16 sm:py-32">
                <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto">
                  <div className="grid lg:grid-cols-3 gap-12 sm:gap-20">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-6 sm:mb-8">
                        PROJECT OVERVIEW
                      </h2>
                      <div className="text-base sm:text-lg text-white/80 leading-relaxed space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                        <p>
                          {project.detailed_description || project.description}
                        </p>
                        <p>
                          This project showcases the intersection of technical expertise and creative problem-solving, 
                          demonstrating how thoughtful design and robust development can create meaningful user experiences.
                        </p>
                        <p>
                          The development process involved careful consideration of user needs, technical constraints, 
                          and business objectives to deliver a solution that exceeds expectations.
                        </p>
                      </div>

                      {/* Gallery */}
                      {project.gallery_images && project.gallery_images.length > 0 && (
                        <div className="mb-12 sm:mb-16">
                          <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-6 sm:mb-8">
                            PROJECT GALLERY
                          </h3>
                          <div className="space-y-6 sm:space-y-8">
                            {project.gallery_images.map((image, index) => (
                              <div key={index} className="aspect-video bg-white/5 rounded-xl overflow-hidden">
                                <img
                                  src={image}
                                  alt={`${project.title} screenshot ${index + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Development Process */}
                      <div className="mb-12 sm:mb-16">
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-6 sm:mb-8">
                          DEVELOPMENT PROCESS
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                            <h4 className="font-bold text-white mb-2 sm:mb-3 text-sm sm:text-base">Planning & Design</h4>
                            <p className="text-white/70 text-xs sm:text-sm">
                              Initial research, wireframing, and technical architecture planning.
                            </p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                            <h4 className="font-bold text-white mb-2 sm:mb-3 text-sm sm:text-base">Development</h4>
                            <p className="text-white/70 text-xs sm:text-sm">
                              Iterative development with continuous testing and refinement.
                            </p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                            <h4 className="font-bold text-white mb-2 sm:mb-3 text-sm sm:text-base">Launch & Optimize</h4>
                            <p className="text-white/70 text-xs sm:text-sm">
                              Deployment, monitoring, and post-launch optimization.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                      {/* Project Info */}
                      <div className="mb-8 sm:mb-12">
                        <h4 className="font-black tracking-widest uppercase text-xs sm:text-sm mb-4 sm:mb-6 text-white/60">
                          PROJECT DETAILS
                        </h4>
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <p className="text-white/60 text-xs sm:text-sm mb-1 tracking-widest uppercase">
                              ROLE
                            </p>
                            <p className="font-bold text-sm sm:text-base">{project.role}</p>
                          </div>
                          {project.completion_date && (
                            <div>
                              <p className="text-white/60 text-xs sm:text-sm mb-1 tracking-widest uppercase">
                                COMPLETED
                              </p>
                              <p className="font-bold text-sm sm:text-base">
                                {new Date(project.completion_date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-8 sm:mb-12">
                          <h4 className="font-black tracking-widest uppercase text-xs sm:text-sm mb-4 sm:mb-6 text-white/60">
                            TECHNOLOGIES
                          </h4>
                          <div className="space-y-2">
                            {project.technologies.map((tech, index) => (
                              <div key={index} className="border-b border-white/10 pb-2">
                                <span className="font-medium text-sm sm:text-base">{tech}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="space-y-3 sm:space-y-4">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-white text-black py-3 sm:py-4 px-4 sm:px-6 font-black text-xs sm:text-sm tracking-widest uppercase text-center hover:bg-white/90 transition-colors rounded-lg"
                          >
                            VIEW LIVE SITE
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full border-2 border-white text-white py-3 sm:py-4 px-4 sm:px-6 font-black text-xs sm:text-sm tracking-widest uppercase text-center hover:bg-white hover:text-black transition-colors rounded-lg"
                          >
                            VIEW CODE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Navigation Bar */}
              <div className="border-t border-white/10 bg-gradient-to-t from-black via-slate-900/50 to-black px-4 sm:px-6 py-6 sm:py-8">
                <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    {/* Previous Project */}
                    <div className="w-full sm:flex-1 order-2 sm:order-1">
                      {prevProject ? (
                        <button
                          onClick={() => handleNavigateToProject(prevProject)}
                          className="group text-left p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 w-full sm:max-w-xs"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                            <span className="text-xs text-white/60 tracking-widest uppercase">Previous</span>
                          </div>
                          <p className="font-bold text-white group-hover:text-green-400 transition-colors text-xs sm:text-sm truncate">
                            {prevProject.title}
                          </p>
                        </button>
                      ) : (
                        <div className="hidden sm:block"></div>
                      )}
                    </div>

                    {/* Center - Back to Projects */}
                    <div className="flex-shrink-0 order-1 sm:order-2 sm:mx-8">
                      <Link
                        to="/Projects"
                        className="flex items-center gap-2 bg-white text-black px-4 sm:px-8 py-3 sm:py-4 font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:bg-green-500 hover:text-white rounded-lg"
                      >
                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">VIEW ALL PROJECTS</span>
                        <span className="sm:hidden">ALL PROJECTS</span>
                      </Link>
                    </div>

                    {/* Next Project */}
                    <div className="w-full sm:flex-1 sm:flex justify-end order-3">
                      {nextProject ? (
                        <button
                          onClick={() => handleNavigateToProject(nextProject)}
                          className="group text-left sm:text-right p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 w-full sm:max-w-xs"
                        >
                          <div className="flex items-center justify-start sm:justify-end gap-3 mb-2">
                            <span className="text-xs text-white/60 tracking-widest uppercase">Next</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="font-bold text-white group-hover:text-green-400 transition-colors text-xs sm:text-sm truncate">
                            {nextProject.title}
                          </p>
                        </button>
                      ) : (
                        <div className="hidden sm:block"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="bg-gradient-to-t from-black via-slate-900/90 to-black border-t border-white/10 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-green-400/20 via-transparent to-transparent animate-pulse"></div>
                  <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-blue-400/20 via-transparent to-transparent animate-pulse delay-1000"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                </div>

                <div className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
                  {/* Terminal Header */}
                  <div className="flex items-center gap-4 mb-8 sm:mb-12">
                    <span className="text-green-400 font-mono text-sm animate-pulse">$ footer --initialize</span>
                    <div className="h-px bg-gradient-to-r from-green-400/50 via-blue-400/30 to-purple-500/20 flex-1"></div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-400"></div>
                    </div>
                  </div>

                  <div className="max-w-7xl 2xl:max-w-[100rem] mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 mb-16">
                      {/* Left Column - CTA */}
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 tracking-wider">
                            LET'S BUILD
                            <br />
                            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                              THE FUTURE
                            </span>
                          </h3>
                          <p className="text-white/70 text-base sm:text-lg lg:text-xl leading-relaxed mb-8">
                            Ready to create something extraordinary? I'm passionate about turning ideas into reality 
                            and would love to hear about your next project.
                          </p>
                        </div>

                        {/* Interactive Contact Button */}
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                          <a 
                            href="mailto:jordanasseff@gmail.com"
                            className="relative flex items-center gap-4 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/10 text-white px-6 py-5 sm:px-8 sm:py-6 rounded-2xl font-bold text-base sm:text-lg tracking-wider transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                              <span>START A CONVERSATION</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-400">Available</span>
                            </div>
                          </a>
                        </div>

                        {/* Live Status Indicators */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              <Calendar className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold">RESPONSE TIME</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-black">
                              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                &lt; 24h
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              <Code className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold">ENERGY LEVEL</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-black">
                              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                92%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Info & Social */}
                      <div className="space-y-8">
                        {/* Current Status */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                          <h4 className="font-bold mb-6 tracking-wider text-base sm:text-lg flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            CURRENT STATUS
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors group">
                              <span className="text-white/80">🚀 Open for new projects</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors group">
                              <span className="text-white/80">🌍 Remote collaboration</span>
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Social Links */}
                        <div>
                          <h4 className="font-bold mb-4 sm:mb-6 tracking-wider text-base sm:text-lg">CONNECT & FOLLOW</h4>
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {[
                              { icon: Github, href: "https://github.com/jordan-media", label: "GitHub" },
                              { icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, href: "https://www.linkedin.com/in/jor11/", label: "LinkedIn" },
                              { icon: Instagram, href: "https://www.instagram.com/jordanmediacreations/#", label: "Instagram" },
                              { icon: Mail, href: "mailto:jordanasseff@gmail.com", label: "Email" }
                            ].map((social, index) => (
                              <a
                                key={social.label}
                                href={social.href}
                                className="group relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
                                target={social.href?.startsWith('http') ? '_blank' : undefined}
                                rel={social.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-blue-500/0 to-purple-600/0 group-hover:from-green-400/5 group-hover:via-blue-500/5 group-hover:to-purple-600/5 transition-all duration-500"></div>
                                <social.icon className="w-5 h-5 text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-300 relative z-10" />
                                <span className="font-medium relative z-10 text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300">{social.label}</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                                  <div className="w-1 h-1 bg-white rounded-full"></div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Fun Fact / Easter Egg */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-4 sm:p-6 hover:from-purple-900/30 hover:to-pink-900/30 transition-all duration-500 group cursor-pointer">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl animate-bounce">🎯</span>
                            <span className="font-bold text-purple-300">FUN FACT</span>
                          </div>
                          <p className="text-white/80 text-sm sm:text-base leading-relaxed group-hover:text-white transition-colors">
                            This portfolio was built with love, lots of late nights, and approximately 100 moments of thinking "finally finished!" immediately followed by more refactoring and additional work. ✨
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-8">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright with typing effect */}
                        <div className="flex items-center gap-4">
                          <span className="text-white/40 font-mono text-xs sm:text-sm">
                            © 2024 Portfolio —
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 font-mono text-xs sm:text-sm">Made with</span>
                            <span className="text-red-500 animate-pulse">❤️</span>
                            <span className="text-white/60 font-mono text-xs sm:text-sm">and</span>
                            <span className="text-yellow-600">☕</span>
                          </div>
                        </div>

                        {/* Live coding status */}
                        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-green-400">LIVE</span>
                          </div>
                          <span className="text-xs font-mono text-white/60">
                            Last updated: {new Date().toLocaleDateString()}
                          </span>
                        </div>

                        {/* Back to top with smooth scroll */}
                        <button
                          onClick={() => {
                            const scrollableDiv = document.querySelector('.project-modal-scrollable');
                            if (scrollableDiv) {
                              scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="group flex items-center gap-2 text-white/60 hover:text-white font-mono text-xs sm:text-sm transition-all duration-300 hover:scale-105"
                        >
                          <span>Back to top</span>
                          <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin group-hover:animate-pulse"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>
              </footer>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
