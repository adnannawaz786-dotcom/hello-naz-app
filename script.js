// Hello Naz App - Interactive JavaScript Features
// Modern, accessible, and performant implementation

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        animationDuration: 300,
        typewriterSpeed: 100,
        colorCycleInterval: 3000,
        particleCount: 50
    };

    // Color themes for dynamic effects
    const THEMES = [
        { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
        { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b' },
        { primary: '#fa709a', secondary: '#fee140', accent: '#a8edea' },
        { primary: '#ffecd2', secondary: '#fcb69f', accent: '#667eea' },
        { primary: '#a8edea', secondary: '#fed6e3', accent: '#ff9a9e' }
    ];

    let currentThemeIndex = 0;
    let isAnimating = false;

    // DOM Elements
    let elements = {};

    // Initialize app when DOM is loaded
    function init() {
        try {
            cacheElements();
            setupEventListeners();
            initializeAnimations();
            startColorCycle();
            createParticleSystem();
            setupAccessibility();
        } catch (error) {
            console.error('Failed to initialize Hello Naz app:', error);
        }
    }

    // Cache DOM elements for performance
    function cacheElements() {
        elements = {
            container: document.querySelector('.container'),
            title: document.querySelector('h1'),
            subtitle: document.querySelector('.subtitle'),
            interactiveBtn: document.querySelector('.interactive-btn'),
            body: document.body,
            particles: document.querySelector('.particles')
        };

        // Verify essential elements exist
        if (!elements.container || !elements.title) {
            throw new Error('Essential DOM elements not found');
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Interactive button click
        if (elements.interactiveBtn) {
            elements.interactiveBtn.addEventListener('click', handleInteractiveClick);
        }

        // Keyboard interactions
        document.addEventListener('keydown', handleKeydown);

        // Window resize for responsive updates
        window.addEventListener('resize', debounce(handleResize, 250));

        // Mouse movement for parallax effect
        document.addEventListener('mousemove', debounce(handleMouseMove, 16));

        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Initialize entrance animations
    function initializeAnimations() {
        if (!elements.container) return;

        // Fade in container
        elements.container.style.opacity = '0';
        elements.container.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            elements.container.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
            elements.container.style.opacity = '1';
            elements.container.style.transform = 'translateY(0)';
        });

        // Typewriter effect for title
        if (elements.title) {
            setTimeout(() => typewriterEffect(elements.title), 500);
        }

        // Animate subtitle
        if (elements.subtitle) {
            setTimeout(() => animateElement(elements.subtitle, 'fadeInUp'), 1000);
        }

        // Animate button
        if (elements.interactiveBtn) {
            setTimeout(() => animateElement(elements.interactiveBtn, 'fadeInUp'), 1500);
        }
    }

    // Typewriter effect
    function typewriterEffect(element) {
        if (!element) return;

        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';

        let index = 0;
        const timer = setInterval(() => {
            element.textContent += text[index];
            index++;

            if (index >= text.length) {
                clearInterval(timer);
                element.classList.add('typewriter-complete');
            }
        }, CONFIG.typewriterSpeed);
    }

    // Generic element animation
    function animateElement(element, animationClass) {
        if (!element) return;

        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = `all ${CONFIG.animationDuration}ms ease`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add(animationClass);
        });
    }

    // Interactive button click handler
    function handleInteractiveClick(event) {
        event.preventDefault();
        
        if (isAnimating) return;
        isAnimating = true;

        const button = event.currentTarget;
        
        // Button click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Cycle through themes
        cycleTheme();

        // Create ripple effect
        createRippleEffect(event);

        // Show success message
        showNotification('Theme changed! ✨');

        setTimeout(() => {
            isAnimating = false;
        }, CONFIG.animationDuration);
    }

    // Keyboard interaction handler
    function handleKeydown(event) {
        switch(event.key) {
            case ' ':
            case 'Enter':
                if (event.target === elements.interactiveBtn) {
                    event.preventDefault();
                    handleInteractiveClick({ currentTarget: elements.interactiveBtn, preventDefault: () => {} });
                }
                break;
            case 'Escape':
                // Reset to first theme
                currentThemeIndex = 0;
                applyTheme(THEMES[currentThemeIndex]);
                break;
        }
    }

    // Window resize handler
    function handleResize() {
        // Recalculate particle positions if needed
        if (elements.particles) {
            updateParticles();
        }
    }

    // Mouse move handler for parallax effect
    function handleMouseMove(event) {
        if (!elements.container) return;

        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        // Subtle parallax movement
        const translateX = xPercent * 10;
        const translateY = yPercent * 10;

        elements.container.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    // Visibility change handler
    function handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            pauseAnimations();
        } else {
            // Resume animations when tab becomes visible
            resumeAnimations();
        }
    }

    // Color theme cycling
    function startColorCycle() {
        setInterval(() => {
            if (!document.hidden && !isAnimating) {
                cycleTheme();
            }
        }, CONFIG.colorCycleInterval);
    }

    function cycleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
        applyTheme(THEMES[currentThemeIndex]);
    }

    function applyTheme(theme) {
        if (!elements.body) return;

        elements.body.style.setProperty('--primary-color', theme.primary);
        elements.body.style.setProperty('--secondary-color', theme.secondary);
        elements.body.style.setProperty('--accent-color', theme.accent);
    }

    // Particle system
    function createParticleSystem() {
        if (!elements.particles) return;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ${delay}s infinite ease-in-out;
        `;

        elements.particles.appendChild(particle);
    }

    function updateParticles() {
        // Recalculate particle positions on resize
        const particles = elements.particles.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
        });
    }

    // Ripple effect
    function createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.className = 'ripple';
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Animation control
    function pauseAnimations() {
        elements.body.style.animationPlayState = 'paused';
    }

    function resumeAnimations() {
        elements.body.style.animationPlayState = 'running';
    }

    // Accessibility setup
    function setupAccessibility() {
        // Ensure interactive elements are properly labeled
        if (elements.interactiveBtn) {
            elements.interactiveBtn.setAttribute('aria-label', 'Change color theme');
        }

        // Add focus management
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Error handling
    window.addEventListener('error', (event) => {
        console.error('Hello Naz App Error:', event.error);
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API for potential extensions
    window.HelloNazApp = {
        cycleTheme,
        showNotification,
        applyTheme: (theme) => applyTheme(theme)
    };

})();