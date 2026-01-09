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
