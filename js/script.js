(function() {
  'use strict';
  
  // ========== VIEWPORT FIX ==========
  const fixViewport = () => {
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.width = '100%';
    document.documentElement.style.maxWidth = '100vw';
    
    document.body.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    document.body.style.position = 'relative';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(s => {
      s.style.width = '100%';
      s.style.maxWidth = '100vw';
      s.style.overflowX = 'hidden';
    });
    
    const containers = document.querySelectorAll('.container, .row');
    containers.forEach(c => {
      c.style.maxWidth = '100%';
      c.style.overflowX = 'hidden';
    });
    
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.width = '100%';
      hero.style.maxWidth = '100vw';
      hero.style.overflowX = 'hidden';
    }
  };

  fixViewport();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixViewport);
  }
  
  window.addEventListener('load', () => {
    fixViewport();
    
    setTimeout(() => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.scrollWidth > window.innerWidth) {
          el.style.maxWidth = '100%';
          el.style.overflowX = 'hidden';
        }
      });
    }, 300);
  });
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fixViewport, 100);
  });
  
  window.addEventListener('orientationchange', () => {
    setTimeout(fixViewport, 100);
  });
})();

// ========== PRELOADER ==========
window.addEventListener("load", function() {
  setTimeout(function() {
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() => {
      document.querySelector(".preloader").style.display = "none";
    }, 300);
  }, 500);
});

// ========== AOS INITIALIZATION ==========
const isMobile = window.innerWidth < 768;
AOS.init({
  duration: isMobile ? 400 : 800,
  once: true,
  offset: isMobile ? 50 : 80,
  disable: function() {
    return /bot|crawler|spider/i.test(navigator.userAgent);
  }
});

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll(".counter");
let counterAnimated = false;

const runCounter = () => {
  if (counterAnimated) return;
  counterAnimated = true;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target + "+";
      }
    };
    updateCounter();
  });
};

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterAnimated) {
        runCounter();
      }
    });
  },
  { threshold: 0.3 }
);

if (counters.length > 0) {
  counterObserver.observe(counters[0].parentElement);
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const navHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });
});

// ========== NAVBAR SCROLL EFFECT ==========
let lastScroll = 0;
let ticking = false;

const updateNavbar = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const navbar = document.querySelector(".navbar");
  const scrollTopBtn = document.getElementById("scrollTop");
  
  if (scrollTop > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  
  if (scrollTop > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
  
  lastScroll = scrollTop;
  ticking = false;
};

window.addEventListener("scroll", function() {
  if (!ticking) {
    window.requestAnimationFrame(updateNavbar);
    ticking = true;
  }
}, { passive: true });

// ========== SCROLL TO TOP ==========
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ========== PORTFOLIO FILTER ==========
const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    filterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    
    const filter = this.getAttribute("data-filter");
    
    requestAnimationFrame(() => {
      portfolioItems.forEach(item => {
        const category = item.getAttribute("data-category");
        
        if (filter === "all" || category === filter) {
          item.style.display = "block";
          void item.offsetWidth;
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.9)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
});

// ========== LIGHTBOX FUNCTIONALITY ==========
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
const portfolioImages = Array.from(document.querySelectorAll('.portfolio-item img'));

portfolioItems.forEach((item, index) => {
  item.addEventListener('click', function() {
    const img = this.querySelector('img');
    const title = this.querySelector('h4').textContent;
    const category = this.querySelector('.portfolio-category').textContent;
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = `${title} - ${category}`;
    currentImageIndex = index;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxPrev.addEventListener('click', function(e) {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
  updateLightboxImage();
});

lightboxNext.addEventListener('click', function(e) {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
  updateLightboxImage();
});

function updateLightboxImage() {
  const item = portfolioItems[currentImageIndex];
  const img = item.querySelector('img');
  const title = item.querySelector('h4').textContent;
  const category = item.querySelector('.portfolio-category').textContent;
  
  lightboxImg.src = img.src;
  lightboxCaption.textContent = `${title} - ${category}`;
}

document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// ========== BEFORE/AFTER SLIDER ==========
const beforeAfterSlider = document.getElementById('beforeAfterSlider');
if (beforeAfterSlider) {
  const afterImage = document.querySelector('.before-after-image.after');
  const sliderButton = document.querySelector('.slider-button');
  
  beforeAfterSlider.addEventListener('input', function() {
    const value = this.value;
    if (afterImage) {
      afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
    }
    if (sliderButton) {
      sliderButton.style.left = `${value}%`;
    }
  });
  
  let isDragging = false;
  const container = document.querySelector('.before-after-container');
  
  if (container) {
    container.addEventListener('mousedown', () => isDragging = true);
    container.addEventListener('mouseup', () => isDragging = false);
    container.addEventListener('mouseleave', () => isDragging = false);
    
    container.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      updateSliderPosition(e.clientX, this);
    });
    
    container.addEventListener('touchmove', function(e) {
      updateSliderPosition(e.touches[0].clientX, this);
    });
  }
  
  function updateSliderPosition(clientX, container) {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    beforeAfterSlider.value = clampedPercentage;
    if (afterImage) {
      afterImage.style.clipPath = `inset(0 0 0 ${clampedPercentage}%)`;
    }
    if (sliderButton) {
      sliderButton.style.left = `${clampedPercentage}%`;
    }
  }
}

// ========== BOOKING MODAL ==========
const bookingModal = document.getElementById('bookingModal');
const bookingBtns = document.querySelectorAll('.booking-btn');
const bookingClose = document.querySelector('.booking-modal-close');
const bookingForm = document.getElementById('bookingForm');
const selectedPackageInput = document.getElementById('selectedPackage');

bookingBtns.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const packageName = this.getAttribute('data-package');
    selectedPackageInput.value = packageName;
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

bookingClose.addEventListener('click', closeBookingModal);
bookingModal.addEventListener('click', function(e) {
  if (e.target === bookingModal) {
    closeBookingModal();
  }
});

function closeBookingModal() {
  bookingModal.classList.remove('active');
  document.body.style.overflow = '';
}

bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  const message = `Halo Roro Ayu Wedding 👋

Saya ingin booking jasa make up:

👤 Nama: ${data.name}
📱 WhatsApp: ${data.phone}
📅 Tanggal Acara: ${data.date}
💄 Jenis Layanan: ${data.service}
📦 Paket: ${data.package}
📍 Lokasi: ${data.location}
👥 Jumlah Orang: ${data.people}

${data.notes ? `📝 Catatan: ${data.notes}` : ''}

Mohon konfirmasi ketersediaan dan info lebih lanjut.
Terima kasih! 😊`;
  
  const phoneNumber = "6281252480477";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  window.location.href = url;
  closeBookingModal();
  bookingForm.reset();
  
  showToast('Success!', 'Redirecting to WhatsApp...', 'success');
});

// ========== FAQ ACCORDION ==========
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', function() {
    const faqItem = this.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// ========== TESTIMONIAL SLIDER ==========
let testimonialIndex = 0;
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.querySelector('.testimonial-nav.prev');
const testimonialNext = document.querySelector('.testimonial-nav.next');

if (testimonialTrack && testimonialCards.length > 0) {
  function updateTestimonialSlider() {
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 24;
    const offset = -(testimonialIndex * (cardWidth + gap));
    testimonialTrack.style.transform = `translateX(${offset}px)`;
  }
  
  if (testimonialPrev) {
    testimonialPrev.addEventListener('click', function() {
      testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
      updateTestimonialSlider();
    });
  }
  
  if (testimonialNext) {
    testimonialNext.addEventListener('click', function() {
      testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
      updateTestimonialSlider();
    });
  }
  
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    updateTestimonialSlider();
  }, 5000);
  
  window.addEventListener('resize', updateTestimonialSlider);
}

// ========== INSTAGRAM ITEMS CLICK ==========
document.querySelectorAll(".instagram-item").forEach(item => {
  item.addEventListener("click", function() {
    window.open(
      "https://www.instagram.com/roroayu_wedding?igsh=MW11YWNoOHVjaHJ2bQ==",
      "_blank"
    );
  });
});

// ========== NEWSLETTER FORM ==========
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    showToast('Success!', 'Thank you for subscribing!', 'success');
    this.reset();
  });
}

// ========== TOAST NOTIFICATION ==========
function showToast(title, message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastTitle = toast.querySelector('.toast-title');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon i');
  
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  
  if (type === 'success') {
    toastIcon.className = 'fas fa-check-circle';
    toastIcon.style.color = '#28a745';
  } else if (type === 'error') {
    toastIcon.className = 'fas fa-exclamation-circle';
    toastIcon.style.color = '#dc3545';
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

window.closeToast = function() {
  document.getElementById('toast').classList.remove('show');
};

// ========== COOKIE CONSENT ==========
window.addEventListener('load', function() {
  const cookieConsent = document.getElementById('cookieConsent');
  const hasAccepted = localStorage.getItem('cookieConsent');
  
  if (!hasAccepted) {
    setTimeout(() => {
      cookieConsent.classList.add('show');
    }, 2000);
  }
});

window.acceptCookies = function() {
  localStorage.setItem('cookieConsent', 'true');
  document.getElementById('cookieConsent').classList.remove('show');
  showToast('Success!', 'Cookie preferences saved', 'success');
};

// ========== WHATSAPP CONTACT BUTTONS ==========
// WhatsApp Float Button sudah ada di HTML dengan href langsung

// WhatsApp di Contact Section
const whatsappContactBtn = document.querySelector('.social-links .social-link[aria-label="WhatsApp"]');
if (whatsappContactBtn) {
  // Sudah ada href di HTML, tidak perlu JS tambahan
  whatsappContactBtn.addEventListener('click', function() {
    console.log('WhatsApp contact clicked');
  });
}

// ========== PERFORMANCE OPTIMIZATION ==========
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.documentElement.classList.add("reduced-motion");
}

if ("ontouchstart" in window) {
  document.body.classList.add("touch-device");
}

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

const handleResize = debounce(() => {
  AOS.refresh();
}, 250);

window.addEventListener("resize", handleResize);

// ========== IMAGE LAZY LOADING ==========
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll("img[data-src]").forEach(img => {
    imageObserver.observe(img);
  });
}

// ========== CONSOLE LOG ==========
console.log(
  "%c🎨 Roro Ayu Wedding",
  "color: #d4a574; font-size: 20px; font-weight: bold;"
);
console.log(
  "%cWebsite loaded successfully! All features active.",
  "color: #8b7355; font-size: 12px;"
);

// ========== PAGE VISIBILITY API ==========
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    document.title = '😊 Come Back! - Roro Ayu Wedding';
  } else {
    document.title = 'Roro Ayu Wedding - Professional MUA Jakarta';
  }
});

// ========== MOBILE SPECIFIC FIXES - TAMBAHKAN DI AKHIR SCRIPT.JS ========== //

// ========== PREVENT HORIZONTAL SCROLL ON MOBILE ==========
(function preventHorizontalScroll() {
  function checkOverflow() {
    const body = document.body;
    const html = document.documentElement;
    
    // Check for elements causing overflow
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth || rect.left < 0) {
        el.style.maxWidth = '100%';
        el.style.overflowX = 'hidden';
      }
    });
    
    // Ensure body doesn't overflow
    body.style.overflowX = 'hidden';
    html.style.overflowX = 'hidden';
  }
  
  // Run on load and resize
  window.addEventListener('load', checkOverflow);
  window.addEventListener('resize', debounce(checkOverflow, 250));
  
  // Run periodically for dynamic content
  setInterval(checkOverflow, 2000);
})();

// ========== MOBILE MENU AUTO CLOSE ==========
(function mobileMenuAutoClose() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navbarCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
})();

// ========== TOUCH SWIPE FOR TESTIMONIALS ==========
(function testimonialSwipe() {
  const slider = document.querySelector('.testimonial-track');
  if (!slider) return;
  
  let startX = 0;
  let isDragging = false;
  
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  
  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  }, { passive: false });
  
  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // Swipe left (next)
    if (diff > 50) {
      document.querySelector('.testimonial-nav.next')?.click();
    }
    // Swipe right (prev)
    else if (diff < -50) {
      document.querySelector('.testimonial-nav.prev')?.click();
    }
  });
})();

// ========== TOUCH SWIPE FOR LIGHTBOX ==========
(function lightboxSwipe() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  
  let startX = 0;
  let isDragging = false;
  
  lightbox.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('lightbox-image')) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }
  });
  
  lightbox.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
  });
  
  lightbox.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // Swipe left (next)
    if (diff > 50) {
      document.querySelector('.lightbox-next')?.click();
    }
    // Swipe right (prev)
    else if (diff < -50) {
      document.querySelector('.lightbox-prev')?.click();
    }
  });
})();

// ========== MOBILE VIEWPORT HEIGHT FIX (100vh issue) ==========
(function fixMobileViewportHeight() {
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVH();
  window.addEventListener('resize', debounce(setVH, 250));
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
  });
})();

// ========== IMPROVE TOUCH TARGET SIZE ==========
(function improveTouchTargets() {
  if (!('ontouchstart' in window)) return;
  
  // Make sure all buttons are at least 44x44px (Apple guideline)
  const buttons = document.querySelectorAll('button, a, .clickable');
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      btn.style.minWidth = '44px';
      btn.style.minHeight = '44px';
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
    }
  });
})();

// ========== LAZY LOAD IMAGES ON MOBILE ==========
(function lazyLoadMobile() {
  if (window.innerWidth > 768) return;
  
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Load images 50px before they enter viewport
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
})();

// ========== PREVENT ZOOM ON INPUT FOCUS (iOS) ==========
(function preventZoomOnFocus() {
  if (!(/iPhone|iPad|iPod/.test(navigator.userAgent))) return;
  
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    // Ensure font-size is at least 16px to prevent zoom
    const fontSize = window.getComputedStyle(input).fontSize;
    if (parseInt(fontSize) < 16) {
      input.style.fontSize = '16px';
    }
  });
})();

// ========== MOBILE SCROLL PERFORMANCE ==========
(function improveScrollPerformance() {
  if (window.innerWidth > 768) return;
  
  let scrollTimer;
  let isScrolling = false;
  
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
      document.body.classList.add('is-scrolling');
    }
    
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling = false;
      document.body.classList.remove('is-scrolling');
    }, 150);
  }, { passive: true });
})();

// ========== FIX MODAL SCROLL LOCK ON MOBILE ==========
(function fixModalScrollLock() {
  const modals = [bookingModal, lightbox];
  
  modals.forEach(modal => {
    if (!modal) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isActive = modal.classList.contains('active');
          
          if (isActive) {
            // Prevent background scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';
          } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        }
      });
    });
    
    observer.observe(modal, { attributes: true });
  });
})();

// ========== SAFE AREA INSETS FOR NOTCH DEVICES ==========
(function handleSafeAreaInsets() {
  // Add padding for devices with notches (iPhone X, etc)
  const root = document.documentElement;
  
  // Check if device has safe area insets
  if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
    
    // Apply to fixed elements
    const navbar = document.querySelector('.navbar');
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const scrollTop = document.querySelector('.scroll-top');
    
    if (navbar) {
      navbar.style.paddingTop = 'var(--safe-area-top, 0)';
    }
    
    if (whatsappFloat) {
      whatsappFloat.style.bottom = 'calc(15px + var(--safe-area-bottom, 0))';
    }
    
    if (scrollTop) {
      scrollTop.style.bottom = 'calc(75px + var(--safe-area-bottom, 0))';
    }
  }
})();

// ========== HANDLE ORIENTATION CHANGE ==========
(function handleOrientationChange() {
  window.addEventListener('orientationchange', () => {
    // Force reflow
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Re-calculate positions
    setTimeout(() => {
      if (typeof updateTestimonialSlider === 'function') {
        updateTestimonialSlider();
      }
      AOS.refresh();
    }, 300);
  });
})();

// ========== MOBILE FORM VALIDATION FEEDBACK ==========
(function mobileFormFeedback() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let firstInvalid = null;
      
      inputs.forEach(input => {
        if (!input.validity.valid && !firstInvalid) {
          firstInvalid = input;
        }
      });
      
      // Scroll to first invalid field on mobile
      if (firstInvalid && window.innerWidth < 768) {
        e.preventDefault();
        firstInvalid.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        firstInvalid.focus();
      }
    });
  });
})();

// ========== IMPROVE TAP DELAY ==========
(function reduceTapDelay() {
  if (!('ontouchstart' in window)) return;
  
  // Add CSS to reduce tap delay
  const style = document.createElement('style');
  style.textContent = `
    a, button, input, select, textarea, [role="button"] {
      touch-action: manipulation;
      -webkit-tap-highlight-color: rgba(212, 165, 116, 0.3);
    }
  `;
  document.head.appendChild(style);
})();

// ========== DETECT SLOW CONNECTION ==========
(function detectSlowConnection() {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      // If slow connection, reduce animations
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
        
        // Disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
          .slow-connection * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
})();

// ========== MOBILE CONSOLE LOG ==========
if (window.innerWidth < 768) {
  console.log(
    "%c📱 Mobile Optimizations Active",
    "color: #d4a574; font-size: 14px; font-weight: bold;"
  );
  console.log(
    "%c✅ Touch gestures enabled\n✅ Viewport fixes applied\n✅ Performance optimized",
    "color: #8b7355; font-size: 11px;"
  );
}

// ========== END OF MOBILE FIXES ========== //

