import { useState, useEffect } from 'react';
import { projectsData } from '../data/ProjectsData';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setProjects(projectsData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getFeaturedProjects = (limit = 6) => {
    return projects.filter(p => p.featured).slice(0, limit);
  };

  const getProjectsByCategory = (category) => {
    if (category === 'all') return projects;
    return projects.filter(p => p.category === category);
  };

  const getProjectById = (id) => {
    return projects.find(p => p.id === id);
  };

  return {
    projects,
    loading,
    getFeaturedProjects,
    getProjectsByCategory,
    getProjectById
  };
};