// Enhanced JavaScript for MEDEA Bar-Restaurant website with smooth animations

document.addEventListener("DOMContentLoaded", function () {
  const gsapRef = window.gsap;
  const scrollToRef = window.ScrollToPlugin;
  const scrollTriggerRef = window.ScrollTrigger;
  const LenisCtor = window.Lenis;

  const hasGsapScroll =
    typeof gsapRef !== "undefined" &&
    typeof scrollToRef !== "undefined";
  const hasGsapTrigger =
    typeof gsapRef !== "undefined" &&
    typeof scrollTriggerRef !== "undefined";

  if (hasGsapScroll) {
    gsapRef.registerPlugin(scrollToRef);
  }
  if (hasGsapTrigger) {
    gsapRef.registerPlugin(scrollTriggerRef);
  }

  let lenis = null;
  if (typeof LenisCtor !== "undefined") {
    lenis = new LenisCtor({
      duration: 1.05,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      normalizeWheel: true,
    });

    if (hasGsapTrigger) {
      lenis.on("scroll", () => {
        scrollTriggerRef.update();
      });
    }

    if (typeof gsapRef !== "undefined") {
      gsapRef.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsapRef.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        window.requestAnimationFrame(raf);
      };
      window.requestAnimationFrame(raf);
    }
  }

  function getHeaderOffset() {
    const header = document.querySelector(".navbar");
    return header ? header.offsetHeight : 100;
  }

  function smoothScrollToTarget(target, duration = 1.05) {
    if (lenis) {
      const options = {
        duration: Math.max(0.7, duration),
        easing: (t) => 1 - Math.pow(1 - t, 3),
      };

      if (typeof target === "number") {
        lenis.scrollTo(Math.max(0, target), options);
      } else {
        lenis.scrollTo(target, { ...options, offset: -getHeaderOffset() });
      }
      return;
    }

    const y =
      typeof target === "number"
        ? target
        : target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    if (hasGsapScroll) {
      gsapRef.killTweensOf(window);
      gsapRef.to(window, {
        duration,
        scrollTo: { y: Math.max(0, y), autoKill: true },
        ease: "power2.out",
      });
      return;
    }

    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // ===== Enhanced Menu Tab Logic with Smooth Transitions =====
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".menu-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => {
        c.classList.remove("active");
        c.style.display = "none";
      });

      // Add active class to clicked button with animation
      btn.classList.add("active");

      // Show corresponding content with fade-in
      const tabId = btn.getAttribute("data-tab");
      const targetContent = document.getElementById(tabId);
      
      if (targetContent) {
        setTimeout(() => {
          targetContent.style.display = "block";
          targetContent.classList.add("active");
          if (hasGsapTrigger) {
            scrollTriggerRef.refresh();
          }
        }, 50);
      } else {
        console.error(`Tab content with id "${tabId}" not found.`);
      }
    });
  });

  console.log("MEDEA website loaded with enhanced animations.");

  // ===== Enhanced Navbar Scroll Effect with Smooth Transition =====
  const navbar = document.getElementById("navbar");
  const updateNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.pageYOffset > 50);
  };

  if (navbar) {
    if (hasGsapTrigger) {
      scrollTriggerRef.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: updateNavbarState,
      });
      updateNavbarState();
    } else {
      window.addEventListener("scroll", updateNavbarState, { passive: true });
      updateNavbarState();
    }
  }

  // ===== Enhanced Mobile Menu Toggle with Smooth Animation =====
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking on a link with smooth transition
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ===== Enhanced Scroll Reveal Animation with GSAP ScrollTrigger =====
  const scrollElements = document.querySelectorAll("[data-scroll]");

  if (hasGsapTrigger) {
    scrollElements.forEach((element, index) => {
      scrollTriggerRef.create({
        trigger: element,
        start: "top 85%",
        once: true,
        onEnter: () => {
          setTimeout(() => {
            element.classList.add("visible");
          }, index * 100);
        },
      });
    });
  } else {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -80px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // ===== Enhanced Parallax Effect for Hero Background =====
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground) {
    if (hasGsapTrigger && window.innerWidth > 768) {
      gsapRef.to(heroBackground, {
        yPercent: 16,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else if (window.innerWidth > 768) {
      let ticking = false;

      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            window.requestAnimationFrame(function () {
              const scrolled = window.pageYOffset;
              const parallaxSpeed = 0.5;

              if (scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(1.1)`;
              }
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    }
  }

  // ===== Enhanced Image Lazy Loading with Smooth Fade In =====
  const imgFadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.transition = "opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
          img.style.opacity = 1;
          img.style.transform = "scale(1)";
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "0px 0px 200px 0px" }
  );

  document.querySelectorAll("img").forEach((img) => {
    if (!img.style.opacity) {
      img.style.opacity = 0;
      img.style.transform = "scale(0.95)";
    }
    
    if (img.complete) {
      img.style.transition = "opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
      img.style.opacity = 1;
      img.style.transform = "scale(1)";
    } else {
      imgFadeObserver.observe(img);
      img.addEventListener("load", () => {
        img.style.opacity = 1;
        img.style.transform = "scale(1)";
      });
    }
  });

  // ===== Enhanced Form Validation with Smooth Error Display =====
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Clear previous errors with fade out
      document.querySelectorAll(".form-error").forEach((error) => {
        error.style.opacity = 0;
        setTimeout(() => {
          error.textContent = "";
          error.style.opacity = 1;
        }, 300);
      });

      let isValid = true;

      // Validate name
      const name = document.getElementById("guestName");
      if (!name.value.trim()) {
        const nameError = document.getElementById("nameError");
        nameError.textContent = "Please enter your name";
        nameError.style.animation = "shake 0.5s ease";
        isValid = false;
      }

      // Validate date
      const date = document.getElementById("reservationDate");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!date.value) {
        const dateError = document.getElementById("dateError");
        dateError.textContent = "Please select a date";
        dateError.style.animation = "shake 0.5s ease";
        isValid = false;
      } else {
        const selectedDate = new Date(date.value);
        if (selectedDate < today) {
          const dateError = document.getElementById("dateError");
          dateError.textContent = "Please select a future date";
          dateError.style.animation = "shake 0.5s ease";
          isValid = false;
        }
      }

      // Validate time
      const time = document.getElementById("reservationTime");
      if (!time.value) {
        const timeError = document.getElementById("timeError");
        timeError.textContent = "Please select a time";
        timeError.style.animation = "shake 0.5s ease";
        isValid = false;
      }

      // Validate guests
      const guests = document.getElementById("guestCount");
      if (!guests.value) {
        const guestsError = document.getElementById("guestsError");
        guestsError.textContent = "Please select number of guests";
        guestsError.style.animation = "shake 0.5s ease";
        isValid = false;
      }

      if (isValid) {
        // Show success message with smooth animation
        const successMsg = document.getElementById("formSuccess");
        if (successMsg) {
          successMsg.classList.add("show");
          successMsg.style.animation = "slideIn 0.5s ease";
          
          // Hide success message after 5 seconds with fade out
          setTimeout(() => {
            successMsg.style.opacity = 0;
            setTimeout(() => {
              successMsg.classList.remove("show");
              successMsg.style.opacity = 1;
            }, 500);
          }, 5000);
        }
        
        // Reset form with smooth transition
        setTimeout(() => {
          bookingForm.reset();
        }, 300);
      }
    });

    // Set minimum date to today
    const dateInput = document.getElementById("reservationDate");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }
  }

  // ===== Enhanced Scroll to Top Button with Smooth Animation =====
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (scrollToTopBtn) {
    const updateScrollToTopState = () => {
      scrollToTopBtn.classList.toggle("visible", window.pageYOffset > 500);
    };

    if (hasGsapTrigger) {
      scrollTriggerRef.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: updateScrollToTopState,
      });
      updateScrollToTopState();
    } else {
      window.addEventListener("scroll", updateScrollToTopState, {
        passive: true,
      });
      updateScrollToTopState();
    }

    scrollToTopBtn.addEventListener("click", function () {
      smoothScrollToTarget(0, 0.9);
    });
  }

  // ===== Enhanced Gallery Item Click Animation =====
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Add a smooth pulse animation
      this.style.animation = "pulse 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        this.style.animation = "";
      }, 600);
    });
  });

  // ===== Smooth Scroll for Navigation Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      
      // Skip if href is just "#"
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      
      if (target) {
        smoothScrollToTarget(target);
      }
    });
  });

  // ===== Enhanced Scroll Indicator Click =====
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", function() {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        smoothScrollToTarget(aboutSection);
      }
    });
  }

  // ===== Add Enhanced Animation Keyframes =====
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1); 
      }
      50% { 
        transform: scale(0.97); 
      }
    }
    
    @keyframes shake {
      0%, 100% { 
        transform: translateX(0); 
      }
      10%, 30%, 50%, 70%, 90% { 
        transform: translateX(-5px); 
      }
      20%, 40%, 60%, 80% { 
        transform: translateX(5px); 
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // ===== Enhanced Menu Item Hover Sound Effect (Optional) =====
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => {
    item.addEventListener("mouseenter", function() {
      this.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // ===== Enhanced Card Hover Effects =====
  const cards = document.querySelectorAll(".highlight-card, .review-card, .event-card");
  cards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // ===== Smooth Page Load Animation =====
  window.addEventListener("load", function() {
    document.body.style.opacity = 0;
    document.body.style.transition = "opacity 0.5s ease";
    
    setTimeout(() => {
      document.body.style.opacity = 1;
    }, 100);
  });

  // ===== Enhanced Performance: Debounce Scroll Events =====
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

  // ===== Intersection Observer for Performance =====
  const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = "transform, opacity";
      } else {
        entry.target.style.willChange = "auto";
      }
    });
  });

  document.querySelectorAll("[data-scroll]").forEach(el => {
    performanceObserver.observe(el);
  });
});

