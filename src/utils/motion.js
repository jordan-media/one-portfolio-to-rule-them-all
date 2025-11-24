// Utility for handling reduced motion preferences with Framer Motion

/**
 * Checks if the user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Returns motion variants that respect user's motion preferences
 * @param {object} normalVariants - Normal animation variants
 * @param {object} reducedVariants - Reduced/instant variants (optional)
 * @returns {object} Appropriate variants based on user preference
 */
export const getMotionVariants = (normalVariants, reducedVariants = null) => {
  if (prefersReducedMotion()) {
    if (reducedVariants) return reducedVariants;

    // Convert normal variants to instant transitions
    const instant = {};
    for (const key in normalVariants) {
      instant[key] = {
        ...normalVariants[key],
        transition: { duration: 0.01 }
      };
    }
    return instant;
  }
  return normalVariants;
};

/**
 * Returns transition config that respects user's motion preferences
 * @param {object} transition - Normal transition config
 * @returns {object} Appropriate transition based on user preference
 */
export const getMotionTransition = (transition) => {
  if (prefersReducedMotion()) {
    return { duration: 0.01 };
  }
  return transition;
};
