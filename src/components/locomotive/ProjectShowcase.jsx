import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ExternalLink, ArrowRight, Github, Eye } from 'lucide-react';
import { TechStack, AnimatedCounter } from './InteractiveElements';
import CodeSnippets from './CodeSnippets';

const getProjectTheme = (category, index) => {
  const themes = {
    development: {
      background: 'from-blue-900/20 via-indigo-900/15 to-cyan-900/10',
      border: 'border-blue-500/20',
      accent: 'text-blue-400',
      glow: 'shadow-blue-500/10'
    },
    storytelling: {
      background: 'from-purple-900/20 via-pink-900/15 to-rose-900/10',
      border: 'border-purple-500/20',
      accent: 'text-purple-400',
      glow: 'shadow-purple-500/10'
    },
    ux_design: {
      background: 'from-orange-900/20 via-amber-900/15 to-yellow-900/10',
      border: 'border-orange-500/20',
      accent: 'text-orange-400',
      glow: 'shadow-orange-500/10'
    }
  };

  // Fallback themes for variety
  const fallbackThemes = [
    {
      background: 'from-emerald-900/20 via-teal-900/15 to-green-900/10',
      border: 'border-emerald-500/20',
      accent: 'text-emerald-400',
      glow: 'shadow-emerald-500/10'
    },
    {
      background: 'from-violet-900/20 via-indigo-900/15 to-blue-900/10',
      border: 'border-violet-500/20',
      accent: 'text-violet-400',
      glow: 'shadow-violet-500/10'
    },
    {
      background: 'from-red-900/20 via-pink-900/15 to-rose-900/10',
      border: 'border-red-500/20',
      accent: 'text-red-400',
      glow: 'shadow-red-500/10'
    }
  ];

  return themes[category] || fallbackThemes[index % fallbackThemes.length];
};

const ProjectCard = ({ project, index, onProjectClick }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const theme = getProjectTheme(project.category, index);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`relative cursor-pointer group ${
        index % 2 === 0 ? 'md:col-span-2' : 'md:col-span-1'
      }`}
      onClick={() => onProjectClick(project)}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.background} backdrop-blur-sm aspect-[4/3] md:aspect-[3/2] border ${theme.border} rounded-2xl hover:${theme.glow} hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]`}>
        {/* Project Image */}
        <div className="absolute inset-0">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className={`text-6xl lg:text-8xl font-black ${theme.accent} opacity-20`}>
                {project.title.charAt(0)}
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border ${theme.border}`}
              >
                <Eye className="w-6 h-6 text-white" />
              </motion.div>
              {project.github_url && (
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border ${theme.border}`}
                >
                  <Github className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </div>
            <p className="text-white font-black tracking-widest uppercase text-sm backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full">
              VIEW PROJECT
            </p>
          </div>
        </div>
        
        {/* Category tag with theme colors */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[20%]">
          <span className={`bg-gradient-to-r ${theme.background} bg-black/80 border ${theme.border} ${theme.accent} px-4 py-2 text-xs font-black tracking-widest uppercase rounded-full`}>
            {project.category?.replace('_', ' ')}
          </span>
        </div>

        {/* Lines of code indicator */}
        {/* <div className="absolute top-6 right-6">
          <div className={`bg-black/50 backdrop-blur-sm border ${theme.border} rounded-lg px-3 py-1`}>
            <span className={`${theme.accent} font-mono text-xs`}>
              <AnimatedCounter end={Math.floor(Math.random() * 2000) + 500} /> lines
            </span>
          </div>
        </div> */}
      </div>
      
      {/* Enhanced Project Info */}
      <div className="mt-8">
        <motion.h3 
          style={{ y: index % 2 === 0 ? y : 0 }}
          className={`text-2xl md:text-2xl font-black tracking-tight mb-4 group-hover:${theme.accent} transition-colors`}
        >
          {project.title}
        </motion.h3>
        
        <p className="text-white/60 text-lg leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Role indicator with theme colors */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono text-white/40">ROLE:</span>
          <span className={`text-sm font-bold ${theme.accent}`}>{project.role}</span>
        </div>
        
        {/* Tech stack */}
        <TechStack technologies={project.technologies?.slice(0, 4)} />
        
        <motion.button 
          className={`group flex items-center space-x-2  px-4 py-2 text-white font-bold tracking-widest uppercase text-sm hover:${theme.accent} transition-colors mt-6`}
          whileHover={{ x: 10 }}
        >
          <span>VIEW CASE STUDY</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProjectShowcase = ({ projects, onProjectClick }) => {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-slate-900 via-black to-slate-900 relative">
      {/* Code Snippets for this section */}
      <CodeSnippets section="projects" count={3} />
      
      <div className="max-w-8xl 2xl:max-w-[120rem] mx-auto relative z-10 px-4 xl:px-8 2xl:px-16">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 2xl:mb-32"
        >
          <div className="flex items-center gap-4 xl:gap-6 2xl:gap-8 mb-8 2xl:mb-16">
            <span className="text-green-400 font-mono text-sm xl:text-base 2xl:text-lg">
              $ ls -la ./projects
            </span>
            <div className="h-px bg-white/20 flex-1"></div>
          </div>
          
          <h2 className="text-6xl md:text-8xl xl:text-[8rem] 2xl:text-[12rem] font-black tracking-tighter mb-8 2xl:mb-16">
            SELECTED<br />WORK
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 2xl:gap-16">
            <p className="text-xl xl:text-2xl 2xl:text-3xl text-white/60 max-w-3xl 2xl:max-w-5xl">
              A curated selection of projects that I have completed. 
              < br/><span className="text-green-300 text-sm tracking-tight leading-tight">Each project highlights my skills in development, design, and storytelling, showcasing my ability to create impactful digital experiences."</span>
            </p>
            
            <div className="flex items-center gap-6 xl:gap-8 2xl:gap-12">
              <div className="text-center">
                <div className="text-2xl xl:text-3xl 2xl:text-5xl font-black mb-1 2xl:mb-2">
                  <AnimatedCounter end={projects.length} />
                </div>
                <div className="text-white/40 text-xs xl:text-sm 2xl:text-base tracking-widest uppercase">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl xl:text-3xl 2xl:text-5xl font-black mb-1 2xl:mb-2">
                  <AnimatedCounter end={47} suffix="k" />
                </div>
                <div className="text-white/40 text-xs xl:text-sm 2xl:text-base tracking-widest uppercase">Lines</div>
              </div>
              <div className="text-center">
                <div className="text-2xl xl:text-3xl 2xl:text-5xl font-black mb-1 2xl:mb-2">
                  <AnimatedCounter end={156} />
                </div>
                <div className="text-white/40 text-xs xl:text-sm 2xl:text-base tracking-widest uppercase">Commits</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-16 md:gap-20 xl:gap-24 2xl:gap-32">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onProjectClick={onProjectClick}
            />
          ))}
        </div>

        {/* Enhanced View All Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-block">
            <motion.button 
              className="group relative bg-white text-black px-16 py-8 font-black text-lg tracking-widest uppercase overflow-hidden transition-all duration-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">VIEW ALL WORK</span>
              <div className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-black tracking-widest">
                VIEW ALL WORK
              </span>
            </motion.button>
            
            {/* Command line hint */}
            <motion.p
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="text-green-400 font-mono text-xs mt-4"
            >
              $ cd /projects && explore --all
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectShowcase;