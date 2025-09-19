import React, { useState, useEffect } from 'react';
import { useProjects } from '../components/hooks/useProjects';
import HeroSection from '../components/locomotive/HeroSection';
import ProjectShowcase from '../components/locomotive/ProjectShowcase';
import AboutPreview from '../components/locomotive/AboutPreview';
import ProjectModal from '../components/locomotive/ProjectModal';

export default function Home() {
  const [entryPoint, setEntryPoint] = useState('developer');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { projects, loading, getFeaturedProjects } = useProjects();

  useEffect(() => {
    const savedEntryPoint = localStorage.getItem('portfolio_entry_point') || 'developer';
    setEntryPoint(savedEntryPoint);
  }, []);

  const featuredProjects = getFeaturedProjects();

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="text-white font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <HeroSection entryPoint={entryPoint} />
      <AboutPreview entryPoint={entryPoint} />
      <ProjectShowcase projects={featuredProjects} onProjectClick={handleProjectClick} />
      
      <ProjectModal
        project={selectedProject}
        isOpen={showProjectModal}
        allProjects={featuredProjects}
        onNavigateToProject={handleProjectClick}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}