import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { projectsData } from '../data/ProjectsData';

export const useProjects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay and translate project data
    const timer = setTimeout(() => {
      const translatedProjects = projectsData.map(project => ({
        ...project,
        title: t(`projectsData.${project.id}.title`),
        description: t(`projectsData.${project.id}.description`),
        short_description: t(`projectsData.${project.id}.description`),
        detailed_description: t(`projectsData.${project.id}.detailedDescription`),
        summary_points: t(`projectsData.${project.id}.summaryPoints`, { returnObjects: true }),
        role: t(`projectsData.${project.id}.role`),
        outcome: t(`projectsData.${project.id}.outcome`),
        // Translate challenges
        challenges: project.challenges ? t(`projectsData.${project.id}.challenges`, { returnObjects: true }) : [],
        // Translate development process
        development_process: project.development_process ? t(`projectsData.${project.id}.developmentProcess`, { returnObjects: true }) : [],
        // Translate gallery images
        gallery_images: project.gallery_images ? project.gallery_images.map((img, idx) => {
          const translatedImg = t(`projectsData.${project.id}.galleryImages.${idx}`, { returnObjects: true });
          return {
            ...img,
            title: translatedImg.title || img.title,
            description: translatedImg.description || img.description
          };
        }) : [],
        // Translate category display name
        categoryDisplay: project.category ? t(`categories.${project.category}`) : project.category,
        // Translate tools used
        tools_used: project.tools_used ? project.tools_used.map(toolKey => t(`tools.${toolKey}`)) : []
      }));
      setProjects(translatedProjects);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [t]);

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