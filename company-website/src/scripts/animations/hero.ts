// src/scripts/animations/hero.ts
// Hero section animations - text reveal, parallax, stats counter

import { gsap } from 'gsap';
import { prefersReducedMotion, isMobile, splitTextIntoWords } from './utils';

export function initHeroAnimations(): void {
  if (prefersReducedMotion()) return;

  const hero = document.querySelector('.ma-hero');
  if (!hero) {
    console.warn('❌ Hero section not found');
    return;
  }

  console.log('🎯 Initializing hero animations');

  // 1. Text Reveal Animation
  initTextReveal();

  // 2. Mesh Parallax
  initMeshParallax();

  // 3. Stats Counter Enhancement
  initStatsCounter();
}

/**
 * Text reveal animation for headline and subheadline
 */
function initTextReveal(): void {
  const headline = document.querySelector('.ma-hero h1') as HTMLElement;
  const subheadline = document.querySelector('.ma-hero-sub') as HTMLElement;
  const actions = document.querySelector('.ma-hero-actions') as HTMLElement;

  if (!headline) return;

  // Skip if HeroTypewriter component is present (it handles its own animation)
  if (headline.querySelector('.typewriter-headline') || document.querySelector('.typewriter-tag')) {
    console.log('ℹ️ HeroTypewriter detected, skipping GSAP text reveal');
    // Still animate subheadline and actions
    if (subheadline) {
      gsap.fromTo(subheadline, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.5 }
      );
    }
    if (actions) {
      const buttons = actions.querySelectorAll('.ma-btn');
      gsap.fromTo(buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 1.8 }
      );
    }
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Split headline into words for stagger
  const words = splitTextIntoWords(headline);
  
  // Animate words in with stagger
  tl.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
  });

  // Animate subheadline
  if (subheadline) {
    gsap.set(subheadline, { opacity: 0, y: 30 });
    tl.to(subheadline, {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, '-=0.3');
  }

  // Animate buttons
  if (actions) {
    const buttons = actions.querySelectorAll('.ma-btn');
    gsap.set(buttons, { opacity: 0, y: 20 });
    tl.to(buttons, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
    }, '-=0.2');
  }

  console.log('✅ Text reveal initialized');
}

/**
 * Mesh background parallax effect
 */
function initMeshParallax(): void {
  if (isMobile()) return; // Skip on mobile

  const meshBg = document.querySelector('.mesh-hero-bg') as HTMLElement;
  if (!meshBg) return;

  // Parallax - background moves slower than scroll
  gsap.to(meshBg, {
    yPercent: 30, // Move 30% of scroll speed
    ease: 'none',
    scrollTrigger: {
      trigger: '.ma-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  console.log('✅ Mesh parallax initialized');
}

/**
 * Enhanced stats counter animation
 */
function initStatsCounter(): void {
  const statsSection = document.getElementById('hero-stats');
  if (!statsSection) return;

  const statValues = Array.from(statsSection.querySelectorAll('.ma-stat-val'));
  if (statValues.length === 0) return;

  // Store original values
  const stats = statValues.map((el) => {
    const element = el as HTMLElement;
    const start = parseInt(element.dataset['start'] || '0');
    const target = parseInt(element.dataset['target'] || '0');
    const suffix = element.dataset['suffix'] || '';
    return { element, start, target, suffix };
  });

  // Create intersection observer for triggering
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate all stats simultaneously with GSAP
          stats.forEach(({ element, start, target, suffix }) => {
            const obj = { value: start };
            
            gsap.to(obj, {
              value: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                const current = Math.round(obj.value);
                element.textContent = current + suffix;
              },
            });
          });

          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(statsSection);

  console.log('✅ Stats counter initialized');
}
