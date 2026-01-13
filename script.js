// Main JavaScript file for Tea House Foe Foe website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Tea House Foe Foe website loaded and enhanced!');

    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { // Lowered threshold slightly
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true }); // Added passive for performance

    // ===== Smooth Scroll for Navigation Links & Hero CTA =====
    // Combined these into one clearer function
    const smoothScrollLinks = document.querySelectorAll('.nav-link, .hero-cta, .scroll-indicator');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle hash links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Adjust offset based on navbar height
                    const navbarHeight = navbar.offsetHeight;
                    const offsetTop = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // ===== Scroll Reveal Animation (Intersection Observer) =====
    const observerOptions = {
        threshold: 0.2, // Increased threshold slightly so elements don't appear too early
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before they enter viewport
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            // Added logic to unobserve once visible for performance
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-scroll attribute (includes new section items)
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(element => {
        observer.observe(element);
    });

    // ===== Parallax Effect for Hero Background =====
    const heroBackground = document.querySelector('.hero-background');
    // Only run on larger screens where background attachment is fixed
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            // Slow down parallax speed slightly
            const parallaxSpeed = 0.4;
            
            if (heroBackground && scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, { passive: true });
    }


    // ===== Add Loading Fade-in =====
    // Removed the artificial delay and opacity 0 on body, it can feel jerky.
    // Instead, let's just ensure the hero content fades in nicely via CSS animation.


    // ===== Image Lazy Loading Enhancement =====
    // Modern browsers support loading="lazy" natively. 
    // The JS solution is okay, but native is better.
    // For this example, I'll stick to the provided JS but optimize it slightly.
    const images = document.querySelectorAll('img[data-src]'); // Only target specific images if we used data-src
    
    // Since the current HTML uses src directly, let's just ensure they fade in smoothly
    const imgFadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.8s ease';
                img.style.opacity = 1;
                observer.unobserve(img);
            }
        })
    }, {rootMargin: "0px 0px 200px 0px"}); // Start loading before they are on screen

    document.querySelectorAll('img').forEach(img => {
        // Initialize opacity for fade in
        img.style.opacity = 0;
        // If image is already loaded from cache
        if(img.complete) {
             img.style.transition = 'opacity 0.8s ease';
             img.style.opacity = 1;
        } else {
             imgFadeObserver.observe(img);
             // Fallback load event just in case observer misses it
             img.addEventListener('load', () => {
                 img.style.opacity = 1;
             });
        }
    });

    // ===== Social Links Hover Effect (JS removed) =====
    // This is better handled by CSS hover states for performance. 
    // The CSS has been updated to handle the transform.


    console.log('All interactive features initialized successfully!');
});