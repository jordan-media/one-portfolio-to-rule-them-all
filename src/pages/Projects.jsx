import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../components/hooks/useProjects';
import ProjectModal from '../components/locomotive/ProjectModal';

const ProjectCard = ({ project, index, onClick }) => {
  const { t } = useTranslation();
  const cardRef = React.useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group cursor-pointer h-full flex flex-col"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-[4/3] bg-slate-200 dark:bg-white/5 overflow-hidden mb-8 flex-shrink-0">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.image_alt || project.title}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-black text-slate-300 dark:text-white/10">
              {project.title.charAt(0)}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <p className="text-white font-black tracking-widest uppercase text-sm">
            {t('projects.viewProject')}
          </p>
        </div>

        <div className="absolute top-3 left-6">
          <span className="bg-slate-900 dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-black tracking-widest uppercase">
            {project.category?.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-white/80 transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-700 dark:text-white/60 leading-relaxed mb-6 text-base xl:text-lg 2xl:text-xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.technologies?.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-xs font-bold tracking-widest uppercase border border-slate-300 dark:border-white/20 px-3 py-1 text-slate-600 dark:text-white/60"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScrollCursor, setShowScrollCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const { projects, loading, getProjectsByCategory } = useProjects();
  const filteredProjects = getProjectsByCategory(activeFilter);

  const filterOptions = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'development', label: t('projects.filters.development') },
    { id: 'storytelling', label: t('projects.filters.storytelling') },
    { id: 'ux_design', label: t('projects.filters.uxDesign') }
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-black dark:to-slate-900 flex items-center justify-center pt-20 transition-colors duration-300">
        <div className="text-slate-900 dark:text-white font-mono" role="status" aria-live="polite">
          {t('projects.loading')}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-black dark:to-slate-900 pt-20 sm:pt-32 cursor-default transition-colors duration-300"
      style={{ cursor: showScrollCursor ? 'none' : 'default' }}
    >
      {/* Screen reader announcement for filter changes */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {filteredProjects.length === 0
          ? t('projects.screenReader.noProjects', {
              category: activeFilter === 'all' ? t('projects.screenReader.allCategories') : activeFilter.replace('_', ' ')
            })
          : t('projects.screenReader.showingProjects', {
              count: filteredProjects.length,
              projectWord: filteredProjects.length === 1 ? t('projects.screenReader.project') : t('projects.screenReader.projects'),
              filterText: activeFilter === 'all' ? '' : `${t('projects.screenReader.in')} ${activeFilter.replace('_', ' ')}`
            })
        }
      </div>
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
          <div className="bg-slate-900 dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full shadow-lg">
            {t('projects.scroll')}
          </div>
        </div>
      )}

      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-20 2xl:mb-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.3em] text-slate-600 dark:text-white/60 mb-4 2xl:mb-8 uppercase cursor-default"
          >
            {t('projects.subtitle')}
          </motion.p>

          <h1 className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl 2xl:text-[12rem] font-black tracking-tighter mb-6 sm:mb-8 2xl:mb-16 text-slate-900 dark:text-white">
            {t('projects.title').split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}{i === 0 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-slate-700 dark:text-white/60 max-w-4xl 2xl:max-w-6xl">
            {t('projects.description')}
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 sm:gap-4 xl:gap-6 2xl:gap-8 mb-12 sm:mb-16 2xl:mb-24 pb-6 sm:pb-8 2xl:pb-12 border-b border-slate-300 dark:border-white/10"
          role="region"
          aria-label="Project category filters"
        >
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`font-black tracking-widest uppercase text-xs sm:text-sm xl:text-base 2xl:text-lg px-4 sm:px-6 xl:px-8 2xl:px-10 py-2 sm:py-3 xl:py-4 2xl:py-5 transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                  : 'border border-slate-300 dark:border-white/20 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <section
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 xl:gap-16 2xl:gap-20 mb-12 sm:mb-20 2xl:mb-32"
          aria-label="Projects gallery"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={handleProjectClick}
            />
          ))}
        </section>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-20 2xl:py-32"
          >
            <h3 className="text-2xl sm:text-4xl xl:text-6xl 2xl:text-8xl font-black mb-6 sm:mb-8 2xl:mb-12 text-slate-900 dark:text-white">{t('projects.emptyState.title')}</h3>
            <p className="text-slate-700 dark:text-white/60 text-base sm:text-lg xl:text-xl 2xl:text-2xl mb-6 sm:mb-8 2xl:mb-12">
              {t('projects.emptyState.description')}
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 sm:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 xl:py-6 2xl:py-8 font-black tracking-widest uppercase transition-all duration-300 hover:bg-green-500 dark:hover:bg-green-500 hover:text-white text-sm xl:text-base 2xl:text-lg"
            >
              {t('projects.emptyState.button')}
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