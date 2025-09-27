// ProjectLibraryModal.jsx
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import SplitType from "split-type";

gsap.registerPlugin(Observer);

export default function ProjectLibraryModal({ isOpen, onClose }) {
  const shellRef = useRef(null); // the modal shell (90vh glass)
  const scopeRef = useRef(null); // inner scope for querying sections only inside the modal

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
      type: "wheel,touch,pointer",
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
  }, [isOpen]);

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
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header overlay like your HTML */}
          <header className="plm-header">
            <div>The Collection</div>
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
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/assets.jpg')",
                    }}
                  >
                    <h2 className="section-heading">SWIPE | SCROLL | FLICK</h2>
                  </div>
                </div>
              </div>
            </section>

            

            {/* SECTION 2 — levi.jpg */}
            <section className="plm-section second">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/levi.jpg')",
                    }}
                  >
                    <h2 className="section-heading">The Levi’s Advertisement</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 — pokedex.jpg */}
            <section className="plm-section third">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/pokedex.jpg')",
                    }}
                  >
                    <h2 className="section-heading">The Pokedex</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4 — photos.jpg */}
            <section className="plm-section fourth">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/photos.jpg')",
                    }}
                  >
                    <h2 className="section-heading">The Photos</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5 — charcoal-sketch.jpg */}
            <section className="plm-section fifth">
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url('/assets/images/library/charcoal-sketch.jpg')",
                    }}
                  >
                    <h2 className="section-heading">The Charcoal Sketch</h2>
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
              height: 7em;
              z-index: 25;
              color: #fff;
              text-transform: uppercase;
              letter-spacing: 0.5em;
              font-size: clamp(0.66rem, 2vw, 1rem);
              pointer-events: none;
            }
            .plm-header a { color: #fff; text-decoration: none; pointer-events: auto; }

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
              background-size: cover;
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
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
