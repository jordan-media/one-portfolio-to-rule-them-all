

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, User, Briefcase, Mail, Github, Linkedin, Instagram, MapPin, ChevronRight, Eye, Code, Calendar, Menu, X } from "lucide-react";
import { FloatingCursor } from "../components/locomotive/InteractiveElements";

const navigationItems = [
  {
    title: "Home",
    url: "/", // Changed to direct path
    icon: Home,
    description: "Welcome & Overview"
  },
  {
    title: "Work",
    url: "/Projects", // Changed to match the actual page file name
    icon: Briefcase,
    description: "Featured Projects"
  },
  {
    title: "About",
    url: "/About", // Changed to match the actual page file name
    icon: User,
    description: "My Story & Skills"
  }
];


const socialLinks = [
  { icon: Github, href: "https://github.com/jordan-media", label: "GitHub" },
  { icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, href: "https://www.linkedin.com/in/jor11/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/jordanmediacreations/#", label: "Instagram" },
  { icon: Mail, href: "mailto:jordanasseff@gmail.com", label: "Email" }
];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Calculate days remaining until Dec 12, 2025
  useEffect(() => {
    const calculateDaysRemaining = () => {
      const targetDate = new Date('2025-12-12');
      const currentDate = new Date();
      const timeDiff = targetDate.getTime() - currentDate.getTime();
      const daysDiff = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
      setDaysRemaining(daysDiff);
    };

    calculateDaysRemaining();
    // Update daily at midnight
    const interval = setInterval(calculateDaysRemaining, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      setScrollProgress(scrolled);

      // Detect current section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let current = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.id;
        }
      });

      setCurrentSection(current);
    };

    // Handle custom scroll progress updates from project modal
    const handleScrollProgressUpdate = (event) => {
      setScrollProgress(event.detail.progress);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll-progress-update', handleScrollProgressUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll-progress-update', handleScrollProgressUpdate);
    };
  }, []);

  // Listen for project modal events
  useEffect(() => {
    const handleProjectView = (event) => {
      setCurrentProject(event.detail);
    };

    const handleProjectClose = () => {
      setCurrentProject(null);
    };

    window.addEventListener('project-view', handleProjectView);
    window.addEventListener('project-close', handleProjectClose);

    return () => {
      window.removeEventListener('project-view', handleProjectView);
      window.removeEventListener('project-close', handleProjectClose);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentPageInfo = () => {
    const path = location.pathname;
    if (path === '/Projects') { // Updated to match the corrected URL
      return {
        page: 'Work',
        description: 'Featured Projects & Case Studies',
        icon: Briefcase
      };
    } else if (path === '/About') { // Updated to match the corrected URL
      return {
        page: 'About',
        description: 'My Story & Skills & Experience',
        icon: User
      };
    } else { // Default to Home for '/' or any other unmatched path
      return {
        page: 'Home',
        description: 'Welcome & Portfolio Overview',
        icon: Home
      };
    }
  };

  const currentPageInfo = getCurrentPageInfo();

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900"></div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}>
        </div>
        <div className="absolute top-1/4 left-1/4 w-px h-96 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-px h-64 bg-gradient-to-t from-transparent via-blue-500/20 to-transparent animate-pulse delay-1000"></div>
      </div>

      {/* Custom Cursor - Hidden on mobile */}
      <div className="hidden lg:block">
        <FloatingCursor />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white hover:bg-black/90 transition-all duration-300 cursor-pointer">

        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen &&
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar - Compact design */}
      <nav className={`fixed inset-y-0 left-0 w-64 sm:w-72 lg:w-80 xl:w-96 2xl:w-[26rem] bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
      }>
        <div className="flex flex-col h-full p-3 sm:p-4">
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden self-end mb-3 p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer">

            <X className="w-4 h-4" />
          </button>

          {/* Logo & Status - Compact */}
          <div className="mb-4 sm:mb-5">
            <Link
              to="/" // Changed to direct path
              className="group flex items-center gap-2.5 mb-3 sm:mb-4 hover:scale-[1.02] transition-transform cursor-pointer">

              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-black font-black text-sm">J</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-wider text-yellow-200">JORDAN MEDIA</h1>
              </div>
            </Link>

            {/* Status Information */}
            <div className="ml-2.5 space-y-1 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-mono">LIVE STATUS</span>
              </div>
              <div className="text-xs text-green-400">
                {daysRemaining} days remaining - STUDENT
              </div>
              <div className="text-xs text-blue-400">Available for work Jan 5th, 2026</div>
            </div>
          </div>

          {/* Live Location Tracking - Compact */}
          <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3 h-3 text-green-400" />
              <span className="text-xs font-bold tracking-wider">LOCATION</span>
            </div>

            {/* Current Page */}
            <div className="flex items-center gap-2 mb-2">
              <currentPageInfo.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
              <div>
                <div className="font-bold text-sm">{currentPageInfo.page}</div>
                <div className="text-xs text-white/60 leading-tight">{currentPageInfo.description}</div>
              </div>
            </div>

            {/* Current Project if viewing one */}
            {currentProject &&
              <div className="mt-2.5 pt-2.5 border-t border-white/10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ChevronRight className="w-2.5 h-2.5 text-white/40" />
                  <Eye className="w-2.5 h-2.5 text-blue-400" />
                  <span className="text-xs font-mono text-white/60">VIEWING</span>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-xs">{currentProject.title}</div>
                  <div className="text-xs text-white/50">{currentProject.category?.replace('_', ' ')}</div>
                  {currentProject.role &&
                    <div className="flex items-center gap-1 mt-0.5">
                      <User className="w-2.5 h-2.5 text-purple-400" />
                      <span className="text-xs text-purple-400">{currentProject.role}</span>
                    </div>
                  }
                </div>
              </div>
            }

            {/* Scroll Progress */}
            <div className="mt-2.5 pt-2.5 border-t border-white/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs font-mono text-white/40">PROGRESS</span>
                <span className="text-xs font-bold text-white/60">{Math.round(scrollProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${scrollProgress}%` }} />

              </div>
            </div>
          </div>

          {/* Navigation Items - Compact */}
          <div className="mb-4 sm:mb-5">
            <div className="text-xs font-bold tracking-wider text-white/40 mb-2.5">NAVIGATION</div>
            <div className="space-y-1.5">
              {navigationItems.map((item, index) =>
                <Link
                  key={item.title}
                  to={item.url}
                  className={`group flex items-center gap-2.5 p-2.5 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    location.pathname === item.url ?
                      'bg-white/10 border border-white/20 shadow-lg' :
                      'hover:bg-white/5 border border-transparent hover:border-white/10'}`
                  }>

                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                    location.pathname === item.url ?
                      'bg-gradient-to-br from-blue-500 to-cyan-400 text-black shadow-lg' :
                      'bg-white/10 text-white/60 group-hover:text-white group-hover:bg-white/15'}`
                  }>
                    <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{item.title}</div>
                    <div className="text-xs text-white/50 truncate leading-tight">{item.description}</div>
                  </div>

                  {location.pathname === item.url &&
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                  }
                </Link>
              )}
            </div>
          </div>

          {/* Social Links - Compact */}
          <div className="mt-auto">
            <div className="text-xs font-bold tracking-wider text-white/40 mb-2.5">CONNECT</div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {socialLinks.map((social, index) =>
                <a
                  key={social.label}
                  href={social.href}
                  className="group relative flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-gradient-to-br from-yellow-300/5 to-yellow-200/10 hover:from-yellow-300/10 hover:to-yellow-200/15 border border-yellow-300/20 hover:border-yellow-300/30 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                  title={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}>

                  {/* Sweeping gradient effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent opacity-0 -translate-x-full"
                    style={{
                      animation: `sweep ${4 + index * 0.5}s ease-in-out infinite`,
                      animationDelay: `${index * 1.2}s`,
                      width: '200%'
                    }}
                  ></div>

                  <social.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 group-hover:text-white flex-shrink-0 relative z-10 transition-colors duration-300" />
                  <span className="text-xs font-medium truncate text-white/70 group-hover:text-white relative z-10 transition-colors duration-300">{social.label}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Updated margins for compact sidebar */}
      <main className="lg:ml-80 xl:ml-96 2xl:ml-[26rem] relative z-10">
        {children}
      </main>

      {/* Enhanced Interactive Footer - Updated margins for compact sidebar */}
      <footer className="lg:ml-80 xl:ml-96 2xl:ml-[26rem] bg-gradient-to-t from-black via-slate-900/90 to-black border-t border-white/10 relative overflow-hidden">
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
                      <span className="cursor-default">START A CONVERSATION</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 cursor-default">Available</span>
                    </div>
                  </a>
                </div>

                {/* Live Status Indicators */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 cursor-default">
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

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 cursor-default">
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
                    <span className="text-yellow-600">☕</span>
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
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes sweep {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 1;
            transform: translateX(0%);
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

