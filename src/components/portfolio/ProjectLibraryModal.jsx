// ProjectLibraryModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import SplitType from "split-type";

gsap.registerPlugin(Observer);

// Library content descriptions
const libraryContent = {
  levi: {
    title: "The Advertisement",
    description: "This photo wasn't set up to become an advertisement—it was meant to capture a moment. When editing, the blue denim jacket naturally stood out. After some light adjustments, a story formed, and it translated into a marketing idea organically. This is the pure form of advertisement: selling a story, not a product. The text plays on two aspects—your favourite jacket and your favourite person."
  },
  pokedex: {
    title: "The Pokedex",
    description: "Growing up in the 90s, the Pokédex was a universally cool gadget. When diving into CSS and JavaScript, I used it as my learning project. It features buttons to switch between Poké balls and Pokémon, a randomizer scan feature that simulates \"finding items in the wild,\" and an integrated map with geolocation. I styled it with Game Boy-inspired textures and randomly placed Pokémon hospitals and training centres nearby your location. It's rewarding to build something that looks good and functions great."
  },
  photos: {
    title: "The Photos",
    description: "I fell in love with photography as a child. My first camera was an HP point-and-shoot, handpicked from the Sears Wish-book catalogue with a covenant 64MB SD card. Now shooting with a Nikon D800, the weight of the DSLR fits perfectly in my hands, and nothing beats that shutter sound. I love editing photos for their realism, syncing them with what my eyes see. Sunsets and the colours of nature are my favourite shots."
  },
  charcoal: {
    title: "The Charcoal Sketch",
    description: "My grandfather was a quiet man who loved to doodle on napkins and paper at the kitchen table. When I draw, I think of my family and the simple roots from where it was born for me. This is my first real drawing I was proud of, completed in grade 10 using charcoal pencils. I forgot my inspiration photo, ran to the school library, and googled \"cool car photos.\" This BMW wheel shot—found on page 3 in a five-second search—now hangs framed on the wall in my parents' house for a lifetime."
  }
};

export default function ProjectLibraryModal({ isOpen, onClose }) {
  const shellRef = useRef(null); // the modal shell (90vh glass)
  const scopeRef = useRef(null); // inner scope for querying sections only inside the modal
  const previousFocusRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showContextOverlay, setShowContextOverlay] = useState(false);

  // Handle context overlay keyboard events (Escape to close)
  useEffect(() => {
    if (!showContextOverlay) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation(); // Prevent closing the main modal
        setShowContextOverlay(false);
        setSelectedSection(null);
      }
    };

    // Use capture phase to intercept before main modal handler
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [showContextOverlay]);

  // Handle section click to show context
  const handleSectionClick = (sectionKey) => {
    if (libraryContent[sectionKey]) {
      setSelectedSection(sectionKey);
      setShowContextOverlay(true);
    }
  };

  // Handle top-half click to close overlay
  const handleTopHalfClick = () => {
    if (showContextOverlay) {
      setShowContextOverlay(false);
      setSelectedSection(null);
    }
  };

  // Focus management and focus trap
  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    previousFocusRef.current = document.activeElement;

    // Focus the modal after a brief delay to allow animation
    const focusTimeout = setTimeout(() => {
      if (shellRef.current) {
        const closeButton = shellRef.current.querySelector('button[aria-label="Close library showcase"]');
        if (closeButton) {
          closeButton.focus();
        }
      }
    }, 100);

    // Keyboard navigation handler
    const handleKeyDown = (e) => {
      // Escape key to close modal
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap for Tab key
      if (e.key === 'Tab' && shellRef.current) {
        const focusableElements = shellRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to the previously focused element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !scopeRef.current) return;

    const scope = scopeRef.current;

    // Query ONLY inside the modal scope (avoid grabbing other page sections)
    const sections = scope.querySelectorAll(".plm-section");
    const images = scope.querySelectorAll(".bg");
    const outerWrappers = gsap.utils.toArray(scope.querySelectorAll(".outer"));
    const innerWrappers = gsap.utils.toArray(scope.querySelectorAll(".inner"));
    const headings = gsap.utils.toArray(scope.querySelectorAll(".section-heading"));

    // Split headings into chars for nice stagger like the CodePen
    const splitHeadings = headings.map(
      (h) =>
        new SplitType(h, {
          types: "chars,words,lines",
          lineClass: "clip-text",
        })
    );

    let currentIndex = -1;
    const wrap = gsap.utils.wrap(0, sections.length);
    let animating = false;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    function gotoSection(index, direction) {
      if (animating) return; // lock to avoid double-fire on trackpads
      index = wrap(index);
      animating = true;

      // Close context overlay when navigating to a new section
      setShowContextOverlay(false);
      setSelectedSection(null);

      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;

      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => {
          animating = false;
        },
      });

      if (currentIndex >= 0) {
        // hide previous
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(
          sections[currentIndex],
          { autoAlpha: 0 }
        );
      }

      // show next
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      )
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(
          splitHeadings[index].chars,
          { autoAlpha: 0, yPercent: 150 * dFactor },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: { each: 0.02, from: "random" },
          },
          0.2
        );

      currentIndex = index;
    }

    const observer = Observer.create({
      target: shellRef.current, // listen on the modal shell
      type: "wheel,touch",  // Remove "pointer" to allow clicks through
      wheelSpeed: -1,          // trackpad/wheel up goes forward like the demo
      tolerance: 10,
      preventDefault: true,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    });

    // start on first
    gotoSection(0, 1);

    return () => {
      observer.kill();
      // clean up split wrappers
      splitHeadings.forEach((s) => s.revert && s.revert());
    };
  }, [isOpen, setShowContextOverlay, setSelectedSection]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-md bg-black/70"
          onClick={onClose}
        />

        {/* Modal Shell (90vh glass with padding from edges) */}
        <motion.div
          ref={shellRef}
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-6xl h-[90vh] overflow-hidden rounded-3xl bg-white/5 border border-white/20 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="library-modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Close library showcase"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header overlay like your HTML */}
          <header className="plm-header">
            <div id="library-modal-title">The Collection</div>
            <div>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                Showcase of selected works
              </a>
            </div>
          </header>

          {/* Scope wrapper so our selectors stay inside the modal */}
          <div ref={scopeRef} className="plm-scope">
            {/* SECTION 1 — assets.jpg (you said this is first) */}
            <section className="plm-section first">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg one"
                    role="img"
                    aria-label="Portfolio showcase opening screen with swipe navigation instructions"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/assets.jpg')",
                    }}
                  >
                    <h2 className="section-heading" aria-hidden="true">SWIPE | SCROLL | FLICK</h2>
                  </div>
                </div>
              </div>
            </section>

            

            {/* SECTION 2 — levi.jpg */}
            <section className="plm-section second">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg clickable-section"
                    role="button"
                    tabIndex={0}
                    aria-label="Levi's advertisement creative project showcasing storytelling work - Click to learn more"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/levi.jpg')",
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionClick('levi')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSectionClick('levi');
                      }
                    }}
                  >
                    <h2 className="section-heading" aria-hidden="true">The Advertisement</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 — pokedex.jpg */}
            <section className="plm-section third">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg clickable-section"
                    role="button"
                    tabIndex={0}
                    aria-label="Pokedex web application project featuring Pokemon card interface design - Click to learn more"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/pokedex.jpg')",
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionClick('pokedex')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSectionClick('pokedex');
                      }
                    }}
                  >
                    <h2 className="section-heading" aria-hidden="true">The Pokedex</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4 — photos.jpg */}
            <section className="plm-section fourth">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg clickable-section"
                    role="button"
                    tabIndex={0}
                    aria-label="Photography portfolio collection demonstrating visual composition skills - Click to learn more"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/photos.jpg')",
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionClick('photos')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSectionClick('photos');
                      }
                    }}
                  >
                    <h2 className="section-heading" aria-hidden="true">The Photos</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5 — charcoal-sketch.jpg */}
            <section className="plm-section fifth">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg clickable-section"
                    role="button"
                    tabIndex={0}
                    aria-label="Charcoal sketch artwork displaying traditional art capabilities - Click to learn more"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/charcoal-sketch.jpg')",
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionClick('charcoal')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSectionClick('charcoal');
                      }
                    }}
                  >
                    <h2 className="section-heading" aria-hidden="true">The Charcoal Sketch</h2>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Local CSS (ported from your SCSS, scoped with .plm-*) */}
          <style>{`
            .plm-header {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 5%;
              padding-right: 80px; /* Ensure space for close button */
              height: 7em;
              z-index: 25;
              color: #fff;
              text-transform: uppercase;
              letter-spacing: 0.5em;
              font-size: clamp(0.66rem, 2vw, 1rem);
              pointer-events: none;
            }
            .plm-header a { color: #fff; text-decoration: none; pointer-events: auto; }

            @media (min-width: 769px) and (max-width: 1000px) {
              .plm-header {
                padding-right: 90px; /* Extra space for close button at medium sizes */
                font-size: clamp(0.6rem, 1.8vw, 0.9rem); /* Slightly smaller text */
                letter-spacing: 0.3em; /* Tighter letter spacing */
              }
            }

            @media (max-width: 768px) {
              .plm-header {
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                height: auto;
                gap: 0.5rem;
                padding-top: 1.5rem;
                padding-right: 70px; /* Space for close button on mobile */
              }
            }

            .plm-scope {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden; /* keep everything inside the glass shell */
            }

            .plm-section {
              height: 100%;
              width: 100%;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              position: absolute; /* fixed-layer feel inside the modal */
              visibility: hidden; /* GSAP toggles with autoAlpha */
            }
            .plm-section .outer,
            .plm-section .inner {
              width: 100%;
              height: 100%;
              overflow-y: hidden;
              position: relative;
            }
            .plm-section .bg {
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              height: 100%;
              width: 100%;
              top: 0;
              left: 0;
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
            }
            .section-heading {
              z-index: 999;
              color: #fff;
              font-weight: 600;
              text-align: center;
              width: 90%;
              max-width: 1200px;
              margin-right: -0.5em;
              font-size: clamp(1rem, 4vw, 4rem);
              text-transform: none;
            }
            .clip-text { overflow: hidden; }

            .clickable-section {
              position: relative;
              z-index: 10;
            }

            .clickable-section:hover .section-heading {
              opacity: 0.8;
              transition: opacity 0.3s ease;
            }
          `}</style>

          {/* Context Overlay - Covers bottom half when section is clicked */}
          <AnimatePresence>
            {showContextOverlay && selectedSection && libraryContent[selectedSection] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex flex-col"
                style={{ pointerEvents: 'auto' }}
              >
                {/* Top 45% - Click to Close */}
                <div
                  className="cursor-pointer"
                  style={{ height: '45%' }}
                  onClick={handleTopHalfClick}
                  aria-label="Click to close description"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTopHalfClick();
                    }
                  }}
                />

                {/* Bottom 75% - Dark Overlay with Text */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative bg-gradient-to-t from-black/60 via-black/50 to-black/40 backdrop-blur-2xl border-t border-white/30 flex flex-col shadow-2xl"
                  style={{
                    height: '75%',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={handleTopHalfClick}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 text-white/70 hover:text-white transition-colors z-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:border-white/40"
                    aria-label="Close description"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
                    <div className="max-w-4xl mx-auto">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white mb-3 sm:mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                        {libraryContent[selectedSection].title}
                      </h3>
                      <div className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed space-y-3" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                        <p>{libraryContent[selectedSection].description}</p>
                      </div>

                      {/* Hint Text */}
                      <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-xs sm:text-sm text-white/40 font-mono">
                          Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">ESC</kbd> or click the top area to close
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
