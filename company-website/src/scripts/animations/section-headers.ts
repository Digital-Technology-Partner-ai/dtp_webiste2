// src/scripts/animations/section-headers.ts
// Section headers - tag and title reveal animations

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils';

export function initSectionHeadersAnimations(): void {
  if (prefersReducedMotion()) return;

  console.log('🎯 Initializing section headers animations');

  // Target both standard section headers and left-content areas (process section)
  const headers = document.querySelectorAll('.ma-section-header, .left-content');
  
  headers.forEach((header) => {
    const tag = header.querySelector('.ma-section-tag') as HTMLElement;
    const title = header.querySelector('h2') as HTMLElement;

    if (!tag) return; // Skip if no tag found

    // Store original tag text and clear it for typewriter effect
    const tagText = tag.textContent || '';
    gsap.set(tag, { opacity: 1, x: 0 });
    tag.textContent = '';
    
    if (title) gsap.set(title, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: header,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Typewriter animation for tag
        typeWriter(tag, tagText, 30, () => {
          // Animate title after tag completes
          if (title) {
            gsap.to(title, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            });
          }
        });
      },
    });
  });

  console.log('✅ Section headers animations initialized');
}

/**
 * Typewriter function - reveals text character by character
 * Matching the HeroTypewriter component animation style
 */
function typeWriter(
  element: HTMLElement,
  text: string,
  speed: number,
  callback?: () => void
): void {
  let index = 0;
  let lastTime = performance.now();
  
  function type(currentTime: number): void {
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= speed) {
      if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        index++;
        lastTime = currentTime;
      } else {
        // Animation complete
        if (callback) callback();
        return;
      }
    }
    
    requestAnimationFrame(type);
  }
  
  requestAnimationFrame(type);
}
