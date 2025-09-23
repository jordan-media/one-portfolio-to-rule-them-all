
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, User, ArrowLeft, ArrowRight, Home, Briefcase, Mail, MapPin, Code, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectModal = ({ project, isOpen, onClose, allProjects = [], onNavigateToProject }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      window.dispatchEvent(new CustomEvent('project-view', {
        detail: project
      }));
      document.body.style.overflow = 'hidden';
    } else {
      window.dispatchEvent(new CustomEvent('project-close'));
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { detail: { progress: 0 } }));
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { detail: { progress: 0 } }));
    };
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollableDiv = document.querySelector('.project-modal-scrollable');
    if (!scrollableDiv) return;

    const handleScroll = () => {
      const scrollTop = scrollableDiv.scrollTop;
      const scrollHeight = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { 
        detail: { progress } 
      }));
    };

    const initialScrollTimeout = setTimeout(() => {
      handleScroll();
    }, 100);

    scrollableDiv.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(initialScrollTimeout);
      scrollableDiv.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const handleNavigateToProject = (targetProject) => {
    if (onNavigateToProject) {
      setScrollProgress(0);
      setShowFullDescription(false);
      window.dispatchEvent(new CustomEvent('scroll-progress-update', { detail: { progress: 0 } }));
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
          <div className="hidden lg:block w-80 xl:w-96 2xl:w-[26rem] flex-shrink-0"></div>
          
          <div className="flex-1 flex flex-col h-screen max-w-none overflow-hidden">
            {/* Header - Enhanced for ultra-wide */}
            <div className="flex-shrink-0 bg-black/95 backdrop-blur-xl border-b border-white/10 z-20">
              <div className="flex items-center justify-between p-4 sm:p-6 2xl:p-8 max-w-none">
                <div className="flex items-center gap-3 sm:gap-4 2xl:gap-6 min-w-0">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:block text-sm 2xl:text-base">Close</span>
                  </button>
                  
                  <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm 2xl:text-base text-white/50 min-w-0">
                    <Link to="/" className="hover:text-white/80 transition-colors flex-shrink-0">
                      <Home className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                    </Link>
                    <span className="flex-shrink-0">/</span>
                    <Link to="/Projects" className="hover:text-white/80 transition-colors flex-shrink-0">
                      Projects
                    </Link>
                    <span className="flex-shrink-0">/</span>
                    <span className="text-white/80 truncate">{project.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to="/Projects"
                    className="flex items-center gap-2 px-2 sm:px-3 2xl:px-4 py-2 2xl:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-xs sm:text-sm 2xl:text-base"
                  >
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                    <span className="hidden sm:block">All Projects</span>
                  </Link>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-y-auto project-modal-scrollable"
            >
              {/* Hero Section - Enhanced for ultra-wide */}
              <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-contain opacity-20"
                  />
                )}
                
                <div className="relative z-10 text-center max-w-5xl 2xl:max-w-[120rem] mx-auto w-full">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-white/60 mb-6 sm:mb-8 2xl:mb-12 uppercase"
                  >
                    {project.category?.replace('_', ' ')}
                  </motion.p>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-black tracking-tighter mb-6 sm:mb-8 2xl:mb-16 leading-tight"
                  >
                    {project.title}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg sm:text-xl xl:text-2xl 2xl:text-4xl text-white/80 max-w-3xl 2xl:max-w-8xl mx-auto mb-8 sm:mb-12 2xl:mb-20"
                  >
                    {project.short_description || project.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 2xl:gap-6"
                  >
                    {prevProject && (
                      <button
                        onClick={() => handleNavigateToProject(prevProject)}
                        className="flex items-center gap-2 px-4 sm:px-6 2xl:px-8 py-2 sm:py-3 2xl:py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 text-xs sm:text-sm 2xl:text-base group backdrop-blur-sm w-full sm:w-auto"
                        title={`Previous: ${prevProject.title}`}
                      >
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="truncate">Previous Project</span>
                      </button>
                    )}
                    
                    <div className="px-3 sm:px-4 2xl:px-6 py-2 sm:py-3 2xl:py-4 bg-white/5 border border-white/10 rounded-lg text-xs 2xl:text-sm text-white/60 backdrop-blur-sm">
                      {currentIndex + 1} of {allProjects.length}
                    </div>
                    
                    {nextProject && (
                      <button
                        onClick={() => handleNavigateToProject(nextProject)}
                        className="flex items-center gap-2 px-4 sm:px-6 2xl:px-8 py-2 sm:py-3 2xl:py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 text-xs sm:text-sm 2xl:text-base group backdrop-blur-sm w-full sm:w-auto"
                        title={`Next: ${nextProject.title}`}
                      >
                        <span className="truncate">Next Project</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Development Process - Full Width Section - Moved above content */}
              {(project.developmentProcess || project.development_process) && (project.developmentProcess || project.development_process).length > 0 && (
                <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 py-16 sm:py-24 2xl:py-32 bg-gradient-to-b from-black/50 to-transparent max-w-none">
                  <div className="max-w-7xl 2xl:max-w-[120rem] mx-auto w-full">
                    <h3 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-5xl font-black tracking-tight mb-6 sm:mb-8 2xl:mb-12 text-center">
                      DEVELOPMENT PROCESS
                    </h3>
                    
                    {/* Mobile/Tablet: Vertical Stack */}
                    <div className="block lg:hidden space-y-6">
                      {(project.developmentProcess || project.development_process).map((phase, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-400 text-black rounded-full flex items-center justify-center font-black text-sm">
                              {index + 1}
                            </div>
                            <h4 className="font-bold text-white text-sm">{phase.title}</h4>
                          </div>
                          <p className="text-white/70 text-xs leading-relaxed">{phase.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: 4-Column Horizontal Timeline */}
                    <div className="hidden lg:block">
                      <div className="relative">
                        {/* Timeline Line - Fixed to prevent horizontal overflow */}
                        <div className="absolute top-6 2xl:top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-green-400/30 via-green-400 via-green-400 to-green-400/30 z-0"></div>
                        
                        {/* 4-Column Grid - One Row - Fixed overflow */}
                        <div className="grid grid-cols-4 gap-4 xl:gap-6 2xl:gap-8 relative z-10">
                          {(project.developmentProcess || project.development_process).map((phase, index) => (
                            <div key={index} className="relative flex flex-col min-w-0">
                              {/* Timeline Node - Removed numbering, just a dot */}
                              <div className="flex justify-center mb-6 xl:mb-8 2xl:mb-12">
                                <div className="relative z-20 w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 bg-green-400 rounded-full border-2 2xl:border-3 border-black shadow-lg"></div>
                              </div>
                              
                              {/* Content Card - Auto height to accommodate text, uniform across all cards */}
                              <div className="bg-white/5 border border-white/10 rounded-xl 2xl:rounded-2xl p-4 xl:p-5 2xl:p-6 hover:bg-white/10 transition-colors duration-300 text-center flex flex-col justify-between min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px]">
                                <h4 className="font-bold text-white text-sm xl:text-base 2xl:text-lg leading-tight mb-3 xl:mb-4 2xl:mb-5">
                                  {phase.title}
                                </h4>
                                <p className="text-white/70 text-xs xl:text-sm 2xl:text-base leading-relaxed">
                                  {phase.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Section - Enhanced for ultra-wide */}
              <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 py-16 sm:py-32 2xl:py-48 max-w-none">
                <div className="max-w-7xl 2xl:max-w-[120rem] mx-auto w-full">
                  <div className="grid lg:grid-cols-3 gap-12 sm:gap-20 2xl:gap-32">
                    <div className="lg:col-span-2 min-w-0">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-7xl font-black tracking-tight mb-6 sm:mb-8 2xl:mb-16">
                        PROJECT OVERVIEW
                      </h2>
                      
                      <div className="text-base sm:text-lg xl:text-xl 2xl:text-3xl text-white/80 leading-relaxed space-y-4 sm:space-y-6 2xl:space-y-12 mb-8 sm:mb-12 2xl:mb-20">
                        <p>
                          {showFullDescription ? 
                            (project.longDescription || project.detailed_description || project.description) :
                            (project.shortDescription || project.short_description || project.description)
                          }
                        </p>
                        
                        {(project.longDescription || project.detailed_description) && (project.longDescription !== project.shortDescription || project.detailed_description !== project.short_description) && (
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm xl:text-base 2xl:text-lg font-bold tracking-wider uppercase"
                          >
                            {showFullDescription ? (
                              <>
                                <span>READ LESS</span>
                                <ChevronUp className="w-4 h-4 2xl:w-5 2xl:h-5" />
                              </>
                            ) : (
                              <>
                                <span>READ MORE</span>
                                <ChevronDown className="w-4 h-4 2xl:w-5 2xl:h-5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {(project.summaryPoints || project.summary_points) && (project.summaryPoints || project.summary_points).length > 0 && (
                        <div className="mb-12 sm:mb-16 2xl:mb-24">
                          <h3 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-5xl font-black tracking-tight mb-6 sm:mb-8 2xl:mb-12">
                            KEY HIGHLIGHTS
                          </h3>
                          <div className="space-y-4 2xl:space-y-8">
                            {(project.summaryPoints || project.summary_points).map((point, index) => (
                              <div key={index} className="flex items-start gap-4 2xl:gap-6">
                                <div className="w-2 h-2 2xl:w-3 2xl:h-3 bg-green-400 rounded-full mt-3 2xl:mt-4 flex-shrink-0"></div>
                                <p className="text-white/80 text-base sm:text-lg xl:text-xl 2xl:text-3xl">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(project.gallery_images || (project.images && project.images.length > 0)) && (
                        <div className="mb-12 sm:mb-16 2xl:mb-24">
                          <h3 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-5xl font-black tracking-tight mb-6 sm:mb-8 2xl:mb-12">
                            PROJECT GALLERY
                          </h3>
                          <div className="space-y-6 sm:space-y-8 2xl:space-y-12">
                            {(project.gallery_images || project.images || []).map((image, index) => (
                              <div key={index} className="aspect-video bg-white/5 rounded-xl 2xl:rounded-2xl overflow-hidden">
                                <img
                                  src={typeof image === 'string' ? image : image.src}
                                  alt={typeof image === 'string' ? `${project.title} screenshot ${index + 1}` : image.alt}
                                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar - Enhanced for ultra-wide */}
                    <div className="min-w-0">
                      <div className="mb-8 sm:mb-12 2xl:mb-20">
                        <h4 className="font-black tracking-widest uppercase text-xs sm:text-sm 2xl:text-base mb-4 sm:mb-6 2xl:mb-10 text-white/60">
                          PROJECT DETAILS
                        </h4>
                        <div className="space-y-4 sm:space-y-6 2xl:space-y-10">
                          <div>
                            <p className="text-white/60 text-xs sm:text-sm 2xl:text-base mb-1 2xl:mb-2 tracking-widest uppercase">
                              ROLE
                            </p>
                            <p className="font-bold text-sm sm:text-base xl:text-lg 2xl:text-2xl">{project.role || project.rolePlayed}</p>
                          </div>
                          {project.category && (
                            <div>
                              <p className="text-white/60 text-xs sm:text-sm 2xl:text-base mb-1 2xl:mb-2 tracking-widest uppercase">
                                CATEGORY
                              </p>
                              <p className="font-bold text-sm sm:text-base xl:text-lg 2xl:text-2xl">
                                {project.category?.replace('_', ' ')}
                              </p>
                            </div>
                          )}
                          {project.completion_date && (
                            <div>
                              <p className="text-white/60 text-xs sm:text-sm 2xl:text-base mb-1 2xl:mb-2 tracking-widest uppercase">
                                COMPLETED
                              </p>
                              <p className="font-bold text-sm sm:text-base xl:text-lg 2xl:text-2xl">
                                {new Date(project.completion_date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                          {project.outcome && (
                            <div>
                              <p className="text-white/60 text-xs sm:text-sm 2xl:text-base mb-1 2xl:mb-2 tracking-widest uppercase">
                                OUTCOME
                              </p>
                              <p className="font-bold text-sm sm:text-base xl:text-lg 2xl:text-2xl text-green-400">{project.outcome}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {(project.technologies || project.technologiesUsed) && (project.technologies || project.technologiesUsed).length > 0 && (
                        <div className="mb-8 sm:mb-12 2xl:mb-20">
                          <h4 className="font-black tracking-widest uppercase text-xs sm:text-sm 2xl:text-base mb-4 sm:mb-6 2xl:mb-10 text-white/60">
                            TECHNOLOGIES
                          </h4>
                          <div className="space-y-2 2xl:space-y-4">
                            {(project.technologies || project.technologiesUsed).map((tech, index) => (
                              <div key={index} className="border-b border-white/10 pb-2 2xl:pb-3">
                                <span className="font-medium text-sm sm:text-base xl:text-lg 2xl:text-xl">{tech}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(project.tools_used || project.toolsUsed) && (project.tools_used || project.toolsUsed).length > 0 && (
                        <div className="mb-8 sm:mb-12 2xl:mb-20">
                          <h4 className="font-black tracking-widest uppercase text-xs sm:text-sm 2xl:text-base mb-4 sm:mb-6 2xl:mb-10 text-white/60">
                            TOOLS USED
                          </h4>
                          <div className="space-y-2 2xl:space-y-4">
                            {(project.tools_used || project.toolsUsed).map((tool, index) => (
                              <div key={index} className="border-b border-white/10 pb-2 2xl:pb-3">
                                <span className="font-medium text-sm sm:text-base xl:text-lg 2xl:text-xl">{tool}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.challenges && project.challenges.length > 0 && (
                        <div className="mb-8 sm:mb-12 2xl:mb-20">
                          <h4 className="font-black tracking-widest uppercase text-xs sm:text-sm 2xl:text-base mb-4 sm:mb-6 2xl:mb-10 text-white/60">
                            CHALLENGES & SOLUTIONS
                          </h4>
                          <div className="space-y-4 2xl:space-y-6">
                            {project.challenges.map((challenge, index) => (
                              <div key={index} className="bg-white/5 border border-white/10 rounded-lg 2xl:rounded-xl p-3 sm:p-4 2xl:p-6">
                                <p className="text-white/80 text-sm xl:text-base 2xl:text-lg mb-2 2xl:mb-3 font-medium">{challenge.description}</p>
                                {challenge.solution && (
                                  <p className="text-green-400 text-xs sm:text-sm xl:text-base 2xl:text-lg">{challenge.solution}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons - Enhanced for ultra-wide */}
                      <div className="space-y-3 sm:space-y-4 2xl:space-y-6">
                        {(project.project_url || project.liveUrl) && (
                          <a
                            href={project.project_url || project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-white text-black py-3 sm:py-4 2xl:py-6 px-4 sm:px-6 2xl:px-8 font-black text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase text-center hover:bg-white/90 transition-colors"
                          >
                            VIEW LIVE SITE
                          </a>
                        )}
                        {(project.github_url || project.githubUrl) && (
                          <a
                            href={project.github_url || project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full border-2 border-white text-white py-3 sm:py-4 2xl:py-6 px-4 sm:px-6 2xl:px-8 font-black text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase text-center hover:bg-white hover:text-black transition-colors rounded-lg 2xl:rounded-xl"
                          >
                            VIEW CODE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Navigation - Above main footer */}
              <div className="border-t border-white/10 bg-gradient-to-t from-black via-slate-900/50 to-black px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 py-6 sm:py-8 2xl:py-12 max-w-none">
                <div className="max-w-7xl 2xl:max-w-[120rem] mx-auto w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 2xl:gap-8">
                    <div className="w-full sm:w-1/3 order-2 sm:order-1">
                      {prevProject ? (
                        <button
                          onClick={() => handleNavigateToProject(prevProject)}
                          className="group text-left p-3 xl:p-4 2xl:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20  transition-all duration-300 w-full max-w-sm"
                        >
                          <div className="flex items-center gap-2 xl:gap-3 mb-1 xl:mb-2">
                            <ArrowLeft className="w-3 h-3 xl:w-4 xl:h-4 text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                            <span className="text-xs xl:text-sm text-white/60 tracking-wider uppercase">Previous</span>
                          </div>
                          <p className="font-bold text-white group-hover:text-green-400 transition-colors text-xs xl:text-sm 2xl:text-base truncate">
                            {prevProject.title}
                          </p>
                        </button>
                      ) : (
                        <div className="hidden sm:block"></div>
                      )}
                    </div>

                    <div className="flex-shrink-0 order-1 sm:order-2">
                      <Link
                        to="/Projects"
                        className="flex items-center gap-2 xl:gap-3 bg-white text-black px-6 xl:px-8 2xl:px-10 py-3 xl:py-4 2xl:py-5 font-black text-xs xl:text-sm 2xl:text-base tracking-widest uppercase transition-all duration-300 hover:bg-green-500 hover:text-white"
                      >
                        <Briefcase className="w-3 h-3 xl:w-4 xl:h-4" />
                        <span className="hidden sm:inline">VIEW ALL PROJECTS</span>
                        <span className="sm:hidden">ALL PROJECTS</span>
                      </Link>
                    </div>

                    <div className="w-full sm:w-1/3 sm:flex justify-end order-3">
                      {nextProject ? (
                        <button
                          onClick={() => handleNavigateToProject(nextProject)}
                          className="group text-left sm:text-right p-3 xl:p-4 2xl:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20  transition-all duration-300 w-full max-w-sm"
                        >
                          <div className="flex items-center justify-start sm:justify-end gap-2 xl:gap-3 mb-1 xl:mb-2">
                            <span className="text-xs xl:text-sm text-white/60 tracking-wider uppercase">Next</span>
                            <ArrowRight className="w-3 h-3 xl:w-4 xl:h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="font-bold text-white group-hover:text-green-400 transition-colors text-xs xl:text-sm 2xl:text-base truncate">
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

              {/* Enhanced Interactive Footer - Exact copy from Layout.js */}
              <footer className="bg-gradient-to-t from-black via-slate-900/90 to-black border-t border-white/10 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-green-400/20 via-transparent to-transparent animate-pulse"></div>
                  <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-blue-400/20 via-transparent to-transparent animate-pulse delay-1000"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                </div>

                <div className="relative z-10 py-8 px-4 sm:py-16 sm:px-6">
                  {/* Terminal Header */}
                  <div className="flex items-center gap-4 mb-8 sm:mb-12">
                    <span className="text-green-400 font-mono text-xs sm:text-sm animate-pulse cursor-default">$ footer --initialize</span>
                    <div className="h-px bg-gradient-to-r from-green-400/50 via-blue-400/30 to-purple-500/20 flex-1"></div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse delay-400"></div>
                    </div>
                  </div>

                  <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 mb-8 sm:mb-16">
                      {/* Left Column - CTA */}
                      <div className="space-y-6 sm:space-y-8">
                        <div>
                          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 tracking-wider cursor-default">
                            <span className="cursor-default">LET'S BUILD</span>
                            <br />
                            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse cursor-default">
                              THE FUTURE
                            </span>
                          </h3>
                          <p className="text-white/70 text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 cursor-default">
                            Ready to create something extraordinary? I'm passionate about turning ideas into reality
                            and would love to hear about your next project.
                          </p>
                        </div>

                        {/* Interactive Contact Button */}
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                          <a
                            href="mailto:jordanasseff@gmail.com"
                            className="relative flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/10 text-white px-4 sm:px-8 py-4 sm:py-6 font-bold text-sm sm:text-lg tracking-wider transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer">

                            <div className="flex items-center gap-3">
                              <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="cursor-default text-base lg:text-sm xl:text-base">START A CONVERSATION</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-400 cursor-default">Available</span>
                            </div>
                          </a>
                        </div>

                        {/* Live Status Indicators */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 cursor-default">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs sm:text-sm font-bold cursor-default">RESPONSE TIME</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-black">
                              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent cursor-default">
                                &lt; 24h
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 cursor-default">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs sm:text-sm font-bold cursor-default">ENERGY LEVEL</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-black">
                              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-default">
                                92%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Info & Social */}
                      <div className="space-y-6 sm:space-y-8">
                        {/* Current Status */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                          <h4 className="font-bold mb-4 sm:mb-6 tracking-wider text-base sm:text-lg flex items-center gap-2 cursor-default">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="cursor-default">CURRENT STATUS</span>
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-default">
                              <span className="text-white/80 text-sm sm:text-base cursor-default">🚀 Open for new projects</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-default">
                              <span className="text-white/80 text-sm sm:text-base cursor-default">🌍 Remote collaboration</span>
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
                              { icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>, href: "https://www.linkedin.com/in/jor11/", label: "LinkedIn" },
                              { icon: Instagram, href: "https://www.instagram.com/jordanmediacreations/#", label: "Instagram" },
                              { icon: Mail, href: "mailto:jordanasseff@gmail.com", label: "Email" }].
                              map((social, index) =>
                                <div key={social.label} className="group relative">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                  <a
                                    href={social.href}
                                    className="relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                                    target={social.href?.startsWith('http') ? '_blank' : undefined}
                                    rel={social.href?.startsWith('http') ? 'noopener noreferrer' : undefined}>

                                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white transition-all duration-300 relative z-10" />
                                    <span className="font-medium relative z-10 text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-300">{social.label}</span>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                                      <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </div>
                                  </a>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Fun Fact / Easter Egg */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-4 sm:p-6 cursor-default">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xl sm:text-2xl animate-bounce">🎯</span>
                            <span className="font-bold text-purple-300 text-sm sm:text-base cursor-default">FUN FACT</span>
                          </div>
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed cursor-default">
                            This portfolio was built with love, lots of late nights, and approximately 100 moments of thinking "finally finished!" immediately followed by more refactoring and additional work. ✨
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-6 sm:pt-8">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                        {/* Copyright with typing effect */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                          <span className="text-white/40 font-mono text-xs sm:text-sm cursor-default">
                            © 2024 Portfolio —
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 font-mono text-xs sm:text-sm cursor-default">Made with</span>
                            <span className="text-red-500 animate-pulse">❤️</span>
                            <span className="text-white/60 font-mono text-xs sm:text-sm cursor-default">and</span>
                            <span className="text-yellow-600 text-xl sm:text-xl">☕</span>
                          </div>
                        </div>

                        {/* Live coding status */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-green-400 cursor-default">LIVE</span>
                          </div>
                          <span className="text-xs font-mono text-white/60 cursor-default">
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
                          className="group flex items-center gap-2 text-white/60 hover:text-white font-mono text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer">

                          <span>Back to top</span>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border border-current border-t-transparent rounded-full animate-spin group-hover:animate-pulse"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) =>
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }} />

                  )}
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
