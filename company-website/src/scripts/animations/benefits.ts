// src/scripts/animations/benefits.ts
// Benefits section - card stagger entrance and line draw animations

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils';

export function initBenefitsAnimations(): void {
  if (prefersReducedMotion()) return;

  const section = document.getElementById('benefits');
  if (!section) {
    console.warn('❌ Benefits section not found');
    return;
  }

  console.log('🎯 Initializing benefits animations');

  // 1. Card Stagger Entrance
  initCardStagger();

  // 2. Line Draw Animation
  initLineDraw();
}

/**
 * Staggered card entrance animation
 */
function initCardStagger(): void {
  const cards = document.querySelectorAll('.ma-benefit-card');
  if (cards.length === 0) return;

  // Set initial state
  gsap.set(cards, { 
    opacity: 0, 
    y: 40,
  });

  // Create scroll-triggered stagger animation
  ScrollTrigger.create({
    trigger: '#benefits',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1, // 0.1s between each card
      });
    },
  });

  console.log('✅ Card stagger initialized');
}

/**
 * Line draw animation for card borders
 */
function initLineDraw(): void {
  // The cards already have a ::before pseudo-element for the left border
  // We'll animate its opacity for a "draw" effect
  const cards = document.querySelectorAll('.ma-benefit-card');
  
  cards.forEach((card, index) => {
    const cardEl = card as HTMLElement;
    
    // Create individual trigger for each card
    ScrollTrigger.create({
      trigger: cardEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Animate the ::before element via CSS custom property or opacity
        // Since ::before can't be directly targeted, we add a class
        setTimeout(() => {
          cardEl.classList.add('line-drawn');
        }, index * 100 + 300); // Stagger after card appears
      },
    });
  });

  // Add CSS for the line draw effect
  const style = document.createElement('style');
  style.textContent = `
    .ma-benefit-card::before {
      transition: opacity 0.8s ease;
    }
    .ma-benefit-card.line-drawn::before {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Line draw initialized');
}
