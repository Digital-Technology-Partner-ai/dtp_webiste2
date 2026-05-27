// src/scripts/animations/utils.ts
// Shared utilities for animations

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is mobile/touch
 */
export function isMobile(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element, threshold = 0.1): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight * (1 - threshold)) &&
    rect.bottom >= (window.innerHeight * threshold)
  );
}

/**
 * Split text into words for animation
 */
export function splitTextIntoWords(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || '';
  const words = text.split(' ');
  
  element.innerHTML = '';
  
  const wordElements = words.map((word) => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(30px)';
    element.appendChild(span);
    return span;
  });
  
  return wordElements;
}

/**
 * Split text into lines for animation
 */
export function splitTextIntoLines(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || '';
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  element.innerHTML = '';
  
  const lineElements = lines.map((line) => {
    const div = document.createElement('div');
    div.textContent = line;
    div.style.opacity = '0';
    div.style.transform = 'translateY(20px)';
    element.appendChild(div);
    return div;
  });
  
  return lineElements;
}

/**
 * Animate number counter
 */
export function animateCounter(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1.5,
  suffix: string = ''
): gsap.core.Tween {
  const obj = { value: start };
  
  return gsap.to(obj, {
    value: end,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix;
    },
  });
}

/**
 * Stagger animation for multiple elements
 */
export function staggerElements(
  elements: HTMLElement[],
  animation: gsap.TweenVars,
  stagger: number = 0.1
): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  tl.to(elements, {
    ...animation,
    stagger,
  });
  
  return tl;
}

/**
 * Create scroll-triggered animation
 */
export function createScrollTrigger(
  element: Element,
  animation: gsap.TweenVars,
  triggerOptions?: ScrollTrigger.Vars
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    ...triggerOptions,
    onEnter: () => {
      gsap.to(element, animation);
    },
  });
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * RAF throttle for scroll events
 */
export function rafThrottle<T extends (...args: unknown[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let ticking = false;
  
  return (...args: Parameters<T>) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}
