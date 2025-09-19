import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useProjects } from '../components/hooks/useProjects';
import ProjectModal from '../components/locomotive/ProjectModal';

const filterOptions = [
  { id: 'all', label: 'ALL' },
  { id: 'development', label: 'DEVELOPMENT' },
  { id: 'storytelling', label: 'STORYTELLING' },
  { id: 'ux_design', label: 'UX DESIGN' }
];

const ProjectCard = ({ project, index, onClick }) => {
  const cardRef = React.useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-[4/3] bg-white/5 overflow-hidden mb-8">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-black text-white/10">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <p className="text-white font-black tracking-widest uppercase text-sm">
            VIEW PROJECT
          </p>
        </div>
        
        <div className="absolute top-6 left-6">
          <span className="bg-white text-black px-3 py-1 text-xs font-black tracking-widest uppercase">
            {project.category?.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <h3 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight mb-4 group-hover:text-white/80 transition-colors">
        {project.title}
      </h3>
      
      <p className="text-white/60 leading-relaxed mb-6 text-base xl:text-lg 2xl:text-xl">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {project.technologies?.slice(0, 3).map((tech, i) => (
          <span 
            key={i}
            className="text-xs font-bold tracking-widest uppercase border border-white/20 px-3 py-1 text-white/60"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScrollCursor, setShowScrollCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const { projects, loading, getProjectsByCategory } = useProjects();
  const filteredProjects = getProjectsByCategory(activeFilter);

  // Hide scroll cursor after user starts scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollCursor(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    if (showScrollCursor) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showScrollCursor]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center pt-20">
        <div className="text-white font-mono">Loading projects...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-20 sm:pt-32 cursor-default"
      style={{ cursor: showScrollCursor ? 'none' : 'default' }}
    >
      {/* Custom Scroll Cursor */}
      {showScrollCursor && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: cursorPosition.x - 50,
            top: cursorPosition.y - 15,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-white text-black px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full shadow-lg">
            SCROLL
          </div>
        </div>
      )}

      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-20 2xl:mb-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-white/60 mb-4 2xl:mb-8 uppercase cursor-default"
          >
            PORTFOLIO SHOWCASE
          </motion.p>

          <h1 className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl 2xl:text-[12rem] font-black tracking-tighter mb-6 sm:mb-8 2xl:mb-16">
            ALL<br />WORK
          </h1>
          <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-white/60 max-w-4xl 2xl:max-w-6xl">
            A comprehensive collection of projects showcasing creativity, 
            technical excellence, and innovative problem-solving.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 sm:gap-4 xl:gap-6 2xl:gap-8 mb-12 sm:mb-16 2xl:mb-24 pb-6 sm:pb-8 2xl:pb-12 border-b border-white/10"
        >
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`font-black tracking-widest uppercase text-xs sm:text-sm xl:text-base 2xl:text-lg px-4 sm:px-6 xl:px-8 2xl:px-10 py-2 sm:py-3 xl:py-4 2xl:py-5 transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-white text-black'
                  : 'border border-white/20 text-white/60 hover:text-white hover:border-white/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 xl:gap-12 2xl:gap-16 mb-12 sm:mb-20 2xl:mb-32"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-7xl font-black mb-2 2xl:mb-4">{projects.length}</div>
            <div className="text-white/60 text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase">TOTAL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-7xl font-black mb-2 2xl:mb-4">
              {projects.filter(p => p.category === 'development').length}
            </div>
            <div className="text-white/60 text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase">DEV</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-7xl font-black mb-2 2xl:mb-4">
              {projects.filter(p => p.category === 'storytelling').length}
            </div>
            <div className="text-white/60 text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase">STORY</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-7xl font-black mb-2 2xl:mb-4">
              {projects.filter(p => p.category === 'ux_design').length}
            </div>
            <div className="text-white/60 text-xs sm:text-sm xl:text-base 2xl:text-lg tracking-widest uppercase">UX</div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 xl:gap-16 2xl:gap-20 mb-12 sm:mb-20 2xl:mb-32">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={handleProjectClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-20 2xl:py-32"
          >
            <h3 className="text-2xl sm:text-4xl xl:text-6xl 2xl:text-8xl font-black mb-6 sm:mb-8 2xl:mb-12">NO PROJECTS FOUND</h3>
            <p className="text-white/60 text-base sm:text-lg xl:text-xl 2xl:text-2xl mb-6 sm:mb-8 2xl:mb-12">
              No projects match the current filter.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="bg-white text-black px-6 sm:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 xl:py-6 2xl:py-8 font-black tracking-widest uppercase transition-all duration-300 hover:bg-green-500 hover:text-white text-sm xl:text-base 2xl:text-lg"
            >
              SHOW ALL
            </button>
          </motion.div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={showProjectModal}
        allProjects={projects}
        onNavigateToProject={handleProjectClick}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}