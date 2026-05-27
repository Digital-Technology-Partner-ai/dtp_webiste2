// src/scripts/animations/use-cases.ts
// Use cases section - number counter and card cascade

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isMobile } from './utils';

export function initUseCasesAnimations(): void {
  if (prefersReducedMotion()) return;

  const section = document.querySelector('.mesh-use-cases');
  if (!section) {
    console.warn('❌ Use cases section not found');
    return;
  }

  console.log('🎯 Initializing use cases animations');

  // 1. Number counter animation
  initNumberCounters();

  // 2. Card cascade entrance
  initCardCascade();

  // 3. Mesh parallax
  initMeshParallax();
}

/**
 * Number counter animation for 01, 02, 03
 */
function initNumberCounters(): void {
  const indices = document.querySelectorAll('.ma-use-idx');
  
  indices.forEach((idx) => {
    const element = idx as HTMLElement;
    const finalNumber = parseInt(element.textContent || '0');
    
    // Set initial opacity low
    gsap.set(element, { opacity: 0.2 });
    
    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { value: 0 };
        
        gsap.to(obj, {
          value: finalNumber,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            const current = Math.round(obj.value);
            element.textContent = current.toString().padStart(2, '0');
          },
        });

        // Fade to full opacity
        gsap.to(element, {
          opacity: 0.2, // Keep at 0.2 as per design
          duration: 0.5,
        });
      },
    });
  });

  console.log('✅ Number counters initialized');
}

/**
 * Card cascade from alternating directions
 */
function initCardCascade(): void {
  const cards = document.querySelectorAll('.ma-use-card');
  if (cards.length === 0) return;

  // Define entrance directions
  const directions = [
    { x: -50, y: 0 },  // From left
    { x: 0, y: 50 },   // From bottom
    { x: 50, y: 0 },   // From right
  ];

  cards.forEach((card, index) => {
    const direction = directions[index % directions.length] ?? directions[0]!;
    
    gsap.set(card, {
      opacity: 0,
      x: direction.x,
      y: direction.y,
    });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: index * 0.15, // Stagger
        });

        // Animate tags after card appears
        const tags = card.querySelectorAll('.ma-tag');
        gsap.fromTo(tags, 
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.05,
            delay: index * 0.15 + 0.3,
          }
        );
      },
    });
  });

  console.log('✅ Card cascade initialized');
}

/**
 * Background mesh parallax
 */
function initMeshParallax(): void {
  if (isMobile()) return;

  const meshBg = document.querySelector('.mesh-use-cases-bg') as HTMLElement;
  if (!meshBg) return;

  gsap.to(meshBg, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.mesh-use-cases',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  console.log('✅ Use cases mesh parallax initialized');
}
