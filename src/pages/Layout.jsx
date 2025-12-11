import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Home, User, Briefcase, Mail, Github, Linkedin, Instagram, MapPin, Code, Calendar, Menu, X, Sparkles } from "lucide-react";
import { FloatingCursor } from "../components/locomotive/InteractiveElements";
import ProjectLibraryModal from "../components/portfolio/ProjectLibraryModal";
import CookieBanner from "../components/CookieBanner";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const socialLinks = [
  { icon: Github, href: "https://github.com/jordan-media", label: "GitHub" },
  { icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, href: "https://www.linkedin.com/in/jor11/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/jordanmediacreations/#", label: "Instagram" },
  { icon: Mail, href: "mailto:jordanasseff@gmail.com", label: "Email" }
];


export default function Layout({ children, currentPageName }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navigationItems = [
    {
      title: t('navigation.home.title'),
      url: "/",
      icon: Home,
      description: t('navigation.home.description')
    },
    {
      title: t('navigation.work.title'),
      url: "/Projects",
      icon: Briefcase,
      description: t('navigation.work.description')
    },
    {
      title: t('navigation.about.title'),
      url: "/About",
      icon: User,
      description: t('navigation.about.description')
    },
    {
      title: t('navigation.otherStuff.title'),
      action: "openGlobalProject",
      icon: Code,
      description: t('navigation.otherStuff.description')
    }
  ];

  // Get social links with translated labels
  const getSocialLabel = (baseLabel) => {
    const labelMap = {
      'GitHub': t('social.github'),
      'LinkedIn': t('social.linkedin'),
      'Instagram': t('social.instagram'),
      'Email': t('social.email')
    };
    return labelMap[baseLabel] || baseLabel;
  };
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const menuCloseRef = useRef(false);

  // Create a robust close menu function
  const closeMenu = useCallback(() => {
    console.log('closeMenu called, current state:', isMobileMenuOpen);
    menuCloseRef.current = true;
    setIsMobileMenuOpen(false);
    // Force a re-render after a brief delay
    setTimeout(() => {
      if (menuCloseRef.current) {
        console.log('Force closing menu');
        setIsMobileMenuOpen(false);
      }
    }, 100);
  }, [isMobileMenuOpen]);

  // Reset the ref when menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      menuCloseRef.current = false;
    }
  }, [isMobileMenuOpen]);

  // Ensure menu is always closed on initial mobile load
  useEffect(() => {
    // Force menu to be closed on component mount, especially on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
    setIsInitialized(true);
  }, []);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Listen for ProjectModal open/close events
  useEffect(() => {
    const handleProjectView = () => setIsProjectModalOpen(true);
    const handleProjectClose = () => setIsProjectModalOpen(false);

    window.addEventListener('project-view', handleProjectView);
    window.addEventListener('project-close', handleProjectClose);

    return () => {
      window.removeEventListener('project-view', handleProjectView);
      window.removeEventListener('project-close', handleProjectClose);
    };
  }, []);

  // Reset project modal state when navigating to different pages
  useEffect(() => {
    setIsProjectModalOpen(false);
  }, [location.pathname]);

  // Calculate time remaining until Dec 11, 2025 at 4:30 PM
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const targetDate = new Date(2025, 11, 11, 16, 30, 0); // Dec 11, 2025 at 4:30 PM local
      const currentDate = new Date();
      const timeDiff = Math.max(0, targetDate.getTime() - currentDate.getTime());

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

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

  // Close mobile menu when route changes (but only if not manually closed)
  useEffect(() => {
    // Add a small delay to allow manual close handlers to execute first
    const timer = setTimeout(() => {
      console.log('Route change effect closing menu for:', location.pathname);
      setIsMobileMenuOpen(false);
    }, 50);
    
    return () => clearTimeout(timer);
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

  // Update page title based on route
  useEffect(() => {
    const pageTitles = {
      '/': 'Home - Jordan Asseff Portfolio',
      '/Projects': 'Projects - Jordan Asseff Portfolio',
      '/About': 'About - Jordan Asseff Portfolio'
    };

    const title = pageTitles[location.pathname] || 'Jordan Asseff Portfolio';
    document.title = title;
  }, [location.pathname]);

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
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white font-mono transition-colors duration-300">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100] focus:bg-white focus:text-black focus:px-6 focus:py-3 focus:rounded-lg focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-400"
      >
        Skip to main content
      </a>

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
            backgroundSize: "50px 50px",
          }}
        ></div>
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
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-lg p-3 text-slate-900 dark:text-white hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-300 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isInitialized && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 dark:bg-black/50 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMobileMenuOpen(false);
          }}
          aria-label="Close menu overlay"
        />
      )}

      {/* Sidebar - Compact design */}
      <nav
        className={`fixed inset-y-0 left-0 w-64 sm:w-72 lg:w-80 xl:w-96 2xl:w-[26rem] bg-slate-50/95 dark:bg-black/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          !isInitialized
            ? "-translate-x-full lg:translate-x-0" // Force closed during initialization
            : isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          // Force CSS transform to ensure menu visibility is controlled properly
          transform: typeof window !== 'undefined' && window.innerWidth < 1024
            ? (isMobileMenuOpen && isInitialized ? 'translateX(0)' : 'translateX(-100%)')
            : undefined,
          // Additional safety net
          display: typeof window !== 'undefined' && window.innerWidth < 1024 && !isMobileMenuOpen && isInitialized
            ? 'none'
            : undefined
        }}
      >
        {/* Mobile Close Button - Positioned outside menu flow */}
        <button
          onClick={(e) => {
            console.log('Close button clicked');
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
          }}
          onMouseDown={(e) => {
            console.log('Close button mouse down');
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
          }}
          onTouchStart={(e) => {
            console.log('Close button touch start');
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            console.log('Close button touch end');
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
          }}
          className="lg:hidden absolute top-3 right-3 p-3 text-white/70 hover:text-white transition-colors cursor-pointer z-[60] bg-black/50 border-2 border-white rounded-md flex items-center justify-center"
          aria-label="Close menu"
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            minWidth: '44px',
            minHeight: '44px'
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-full p-3 sm:p-4">
          {/* Logo & Status - Compact */}
          <div className="mb-2 sm:mb-5">
            <Link
              to="/" // Changed to direct path
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center gap-2.5 mb-3 sm:mb-4 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <img
                src="/assets/images/wordmark-logo.svg"
                alt="Jordan Media logo"
                className="object-contain"
              />
            </Link>

            {/* Status Information */}
            <div className="ml-2.5 space-y-1 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-500 dark:text-green-400 font-mono">
                  {t('sidebar.status.studentCountdown')} [{timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s]
                </span>
              </div>

              <div className="text-xs text-blue-500 dark:text-blue-400">
                {t('sidebar.status.availableDate')}
              </div>
            </div>
          </div>

          {/* Scroll Progress */}
          <div className="mb-1 sm:mb-5 p-2.5 sm:p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-mono text-slate-500 dark:text-white/40">
                {t('sidebar.progress.label')}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-white/60">
                {Math.round(scrollProgress)}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Navigation Items - Compact */}
          <div className="mb-2 sm:mb-5">
            <div className="text-xs font-bold tracking-wider text-slate-500 dark:text-white/40 mb-2.5">
              {t('navigation.label')}
            </div>
            <div className="space-y-1.5">
              {navigationItems.map((item, index) =>
                item.url ? (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={(e) => {
                      console.log(`Navigation clicked: ${item.title}`);
                      // Allow the Link to navigate first, then close menu
                      setTimeout(() => closeMenu(), 0);
                    }}
                    className={`group relative flex items-center gap-2.5 p-1 sm:p-3 transition-all duration-300 cursor-pointer rounded-lg dark:rounded-none ${
                      location.pathname === item.url
                        ? "bg-white/10 border border-white/20 dark:bg-gradient-to-r dark:from-purple-800/40 dark:via-green-500/40 dark:to-green-300/90 dark:backdrop-blur-xl dark:border-2 dark:border-green-100"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 dark:border-2 dark:border-white/40 dark:hover:border-green-100 dark:hover:bg-gradient-to-r dark:hover:from-purple-800/40 dark:hover:via-green-500/40 dark:hover:to-green-300/90"
                    }`}
                    style={{
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    {/* Background glow effect - light mode only */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg blur transition duration-500 dark:hidden ${
                      location.pathname === item.url ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'
                    }`}></div>

                    <div
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-300 rounded-lg dark:rounded-none ${
                        location.pathname === item.url
                          ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-900 dark:text-black shadow-lg"
                          : "bg-white/10 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-white/15"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <div className="font-bold text-sm truncate text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-white/50 truncate leading-tight">
                        {item.description}
                      </div>
                    </div>

                    {location.pathname === item.url && (
                      <div className="relative w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                    )}
                  </Link>
                ) : (
                  <button
                    key={item.title}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.action === "openGlobalProject") {
                        setShowGlobalModal(true);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.action === "openGlobalProject") {
                        setShowGlobalModal(true);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`group relative flex items-center gap-2 p-2 sm:p-3 transition-all duration-300 cursor-pointer w-full text-left rounded-lg dark:rounded-none ${
                      showGlobalModal
                        ? "bg-white/10 border border-white/20 dark:bg-gradient-to-r dark:from-purple-800/40 dark:via-green-500/40 dark:to-green-300/90 dark:backdrop-blur-xl dark:border-2 dark:border-green-100"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 dark:border-2 dark:border-white/40 dark:hover:border-green-100 dark:hover:bg-gradient-to-r dark:hover:from-purple-800/40 dark:hover:via-green-500/40 dark:hover:to-green-300/90"
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    {/* Background glow effect - light mode only */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg blur transition duration-500 dark:hidden ${
                      showGlobalModal ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'
                    }`}></div>

                    <div
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-300 rounded-lg dark:rounded-none ${
                        showGlobalModal
                          ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-900 dark:text-black shadow-lg"
                          : "bg-white/10 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-white/15"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <div className="font-bold text-sm truncate text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-white/50 truncate leading-tight">
                        {item.description}
                      </div>
                    </div>

                    {showGlobalModal && (
                      <div className="relative w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Theme Toggle & Language Switcher - Above Social Links */}
          <div className="mt-auto mb-3 sm:mb-4">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Social Links - Compact */}
          <div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="group relative flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-gradient-to-br from-yellow-300/5 to-yellow-200/10 hover:from-yellow-300/10 hover:to-yellow-200/15 border border-yellow-400/20 dark:border-yellow-300/20 hover:border-yellow-500/30 dark:hover:border-yellow-300/30 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                  title={getSocialLabel(social.label)}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {/* Sweeping gradient effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent opacity-0 -translate-x-full"
                    style={{
                      animation: `sweep ${
                        4 + index * 0.5
                      }s ease-in-out infinite`,
                      animationDelay: `${index * 1.2}s`,
                      width: "200%",
                    }}
                  ></div>

                  <social.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-700 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white flex-shrink-0 relative z-10 transition-colors duration-300" />
                  <span className="text-xs font-medium truncate text-slate-900 dark:text-white/70 group-hover:text-black dark:group-hover:text-white relative z-10 transition-colors duration-300">
                    {getSocialLabel(social.label)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Updated margins for compact sidebar */}
      <main id="main-content" className="lg:ml-80 xl:ml-96 2xl:ml-[26rem] relative z-10">
        {children}
      </main>

      {/* Enhanced Interactive Footer - Updated margins for compact sidebar */}
      {!isProjectModalOpen && (
      <footer className="lg:ml-80 xl:ml-96 2xl:ml-[26rem] bg-gradient-to-t from-slate-100 via-white to-slate-50 dark:from-black dark:via-slate-900/90 dark:to-black border-t border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-green-400/20 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-blue-400/20 via-transparent to-transparent animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </div>

        <div className="relative z-10 py-8 px-4 sm:py-16 sm:px-6">
          {/* Terminal Header */}
          <div className="flex items-center gap-4 mb-8 sm:mb-12">
            <span className="text-green-400 font-mono text-xs sm:text-sm animate-pulse cursor-default">
              {t('footer.terminalCommand')}
            </span>
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
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 tracking-wider cursor-default text-slate-900 dark:text-white">
                    <span className="cursor-default">{t('footer.cta.title1')}</span>
                    <br />
                    <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse cursor-default">
                      {t('footer.cta.title2')}
                    </span>
                  </h3>
                  <p className="text-slate-700 dark:text-white/70 text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 cursor-default">
                    {t('footer.cta.description')}
                  </p>
                </div>

                {/* Interactive Contact Button */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <a
                    href="mailto:jordanasseff@gmail.com"
                    className="relative flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-4 sm:px-8 py-4 sm:py-6 font-bold text-sm sm:text-lg tracking-wider transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="cursor-default text-sm">
                        {t('footer.cta.button')}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-500 dark:text-green-400 cursor-default">
                        {t('common.available')}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Live Status Indicators */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Left Column - Response Time */}
                  <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 sm:p-4 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 cursor-default">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm font-bold cursor-default text-slate-900 dark:text-white">
                        {t('footer.metrics.responseTime.label')}
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-black">
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent cursor-default">
                        {t('footer.metrics.responseTime.value')}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-white/80 mt-3 leading-relaxed cursor-default">
                      {t('footer.metrics.responseTime.note')}
                    </p>
                  </div>

                  {/* Right Column - Energy Level + Claude Code stacked */}
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 sm:p-4 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 cursor-default">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-bold cursor-default text-slate-900 dark:text-white">
                          {t('footer.metrics.energyLevel.label')}
                        </span>
                      </div>
                      <div className="text-lg sm:text-2xl font-black">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-default">
                          {t('footer.metrics.energyLevel.value')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 sm:p-4 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 cursor-default">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-bold cursor-default text-slate-900 dark:text-white">
                          {t('footer.metrics.claudeCode.label')}
                        </span>
                      </div>
                      <div className="text-lg sm:text-2xl font-black">
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent cursor-default">
                          {t('footer.metrics.claudeCode.value')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Info & Social */}
              <div className="space-y-6 sm:space-y-8">
                {/* Current Status */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-6">
                  <h4 className="font-bold mb-2 sm:mb-6 tracking-wider text-base sm:text-lg flex items-center gap-2 cursor-default text-slate-900 dark:text-white">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="cursor-default">{t('footer.status.title')}</span>
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-200 dark:bg-black/20 rounded-lg hover:bg-slate-300 dark:hover:bg-black/30 transition-colors cursor-default">
                      <span className="text-slate-700 dark:text-white/80 text-sm sm:text-base cursor-default">
                        {t('footer.status.openProjects')}
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-200 dark:bg-black/20 rounded-lg hover:bg-slate-300 dark:hover:bg-black/30 transition-colors cursor-default">
                      <span className="text-slate-700 dark:text-white/80 text-sm sm:text-base cursor-default">
                        {t('footer.status.remoteCollab')}
                      </span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Social Links */}
                <div>
                  <h4 className="font-bold mb-4 sm:mb-6 tracking-wider text-base sm:text-lg text-slate-900 dark:text-white">
                    {t('footer.connectFollow')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[
                      {
                        icon: Github,
                        href: "https://github.com/jordan-media",
                        label: t('social.github'),
                      },
                      {
                        icon: () => (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        ),
                        href: "https://www.linkedin.com/in/jor11/",
                        label: t('social.linkedin'),
                      },
                      {
                        icon: Instagram,
                        href: "https://www.instagram.com/jordanmediacreations/#",
                        label: t('social.instagram'),
                      },
                      {
                        icon: Mail,
                        href: "mailto:jordanasseff@gmail.com",
                        label: t('social.email'),
                      },
                    ].map((social, index) => (
                      <div key={social.label} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <a
                          href={social.href}
                          className="relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                          target={
                            social.href?.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            social.href?.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white transition-all duration-300 relative z-10" />
                          <span className="font-medium relative z-10 text-xs sm:text-sm text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                            {social.label}
                          </span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                            <div className="w-1 h-1 bg-slate-900 dark:bg-white rounded-full"></div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fun Fact / Easter Egg */}
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-4 sm:p-6 cursor-default">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl sm:text-2xl animate-bounce">
                      🎯
                    </span>
                    <span className="font-bold text-purple-700 dark:text-purple-300 text-sm sm:text-base cursor-default">
                      {t('footer.funFact.label')}
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white/80 text-xs sm:text-sm leading-relaxed cursor-default">
                    {t('footer.funFact.text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
                    <div className="border-t border-slate-200 dark:border-white/10 pt-6 sm:pt-8">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                        {/* Copyright with typing effect */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                          <span className="text-slate-500 dark:text-white/40 font-mono text-xs sm:text-sm cursor-default">
                            {t('footer.copyright.year')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 dark:text-white/60 font-mono text-xs sm:text-sm cursor-default">
                              {t('footer.copyright.madeWith')}
                            </span>
                            <span className="text-red-500 animate-pulse">
                              ❤️
                            </span>
                            <span className="text-slate-700 dark:text-white/60 font-mono text-xs sm:text-sm cursor-default">
                              {t('footer.copyright.and')}
                            </span>
                            <span className="text-yellow-600 text-2xl sm:text-2xl">
                              ☕
                            </span>
                          </div>
                        </div>

                        {/* Live coding status */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-slate-200 dark:bg-black/30 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-green-500 dark:text-green-400 cursor-default">
                              {t('footer.live.label')}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-700 dark:text-white/60 cursor-default">
                            {t('footer.live.lastUpdated', { date: new Date().toLocaleDateString() })}
                          </span>
                        </div>

                        {/* Back to top with smooth scroll */}
                        <button
                          onClick={() => {
                            const scrollableDiv = document.querySelector(
                              ".project-modal-scrollable"
                            );
                            if (scrollableDiv) {
                              scrollableDiv.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className="group flex items-center gap-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white font-mono text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          <span>{t('footer.backToTop')}</span>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border border-current border-t-transparent rounded-full animate-spin group-hover:animate-pulse"></div>
                        </button>
                      </div>

                      {/* Full-width footer line */}
                      <div className="mt-6 sm:mt-8 text-center border-t border-slate-200 dark:border-white/10 pt-4">
                        <span className="text-slate-600 dark:text-white/50 font-mono text-xs sm:text-sm tracking-wide cursor-default">
                          {t('footer.techStack.prefix')}{" "}
                          <span className="text-slate-900 dark:text-white font-semibold">
                            {t('footer.techStack.author')}
                          </span>{" "}
                          {t('footer.techStack.using')}{" "}
                          <span className="text-sky-500 dark:text-sky-400 font-semibold">
                            React
                          </span>
                          ,{" "}
                          <span className="text-cyan-500 dark:text-cyan-400 font-semibold">
                            Tailwind CSS
                          </span>
                          , {t('footer.techStack.and')}{" "}
                          <span className="text-pink-500 dark:text-pink-400 font-semibold">
                            Framer Motion
                          </span>
                          .
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </footer>
      )}

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

      <ProjectLibraryModal
        project={{
          title: "Featured Project",
          description: "This modal was opened from the global navigation.",
          category: "development",
          role: "Full Stack Dev",
          completion_date: "2025-01-01",
          technologies: ["React", "Tailwind", "Framer Motion"],
          image_url: "/placeholder.png",
        }}
        isOpen={showGlobalModal}
        onClose={() => setShowGlobalModal(false)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
