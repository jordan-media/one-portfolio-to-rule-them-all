import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Play } from 'lucide-react';

export default function ProjectGrid({ projects, onProjectClick, entryPoint }) {
  const filteredProjects = projects.filter(project => 
    entryPoint === 'all' || project.category === entryPoint
  );

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Projects</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A curated selection of my most impactful work
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => onProjectClick(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-white/70 text-lg">No projects found for this category yet.</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white/50" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="backdrop-blur-sm bg-white/20 rounded-full p-3">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.category === 'development' ? 'bg-blue-500/20 text-blue-300' :
              project.category === 'storytelling' ? 'bg-purple-500/20 text-purple-300' :
              'bg-orange-500/20 text-orange-300'
            }`}>
              {project.category?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {project.technologies?.slice(0, 2).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80"
                >
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 2 && (
                <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">
                  +{project.technologies.length - 2}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {project.github_url && (
                <Github className="w-4 h-4 text-white/50" />
              )}
              {project.project_url && (
                <ExternalLink className="w-4 h-4 text-white/50" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}