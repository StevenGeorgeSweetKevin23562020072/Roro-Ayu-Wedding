// ========== OPTIMIZED PRELOADER - FAST LOADING ==========
window.addEventListener("load", function () {
  setTimeout(function () {
    document.querySelector(".preloader").classList.add("fade-out");
    // Remove from DOM after animation
    setTimeout(() => {
      document.querySelector(".preloader").style.display = "none";
    }, 300);
  }, 500); // Reduced from 1000ms to 500ms
});

// ========== INITIALIZE AOS WITH MOBILE OPTIMIZATION ==========
const isMobile = window.innerWidth < 768;
AOS.init({
  duration: isMobile ? 400 : 800, // Faster on mobile
  once: true,
  offset: isMobile ? 50 : 80,
  disable: function() {
    // Disable on very slow connections
    return /bot|crawler|spider/i.test(navigator.userAgent);
  }
});

// ========== COUNTER ANIMATION - OPTIMIZED ==========
const counters = document.querySelectorAll(".counter");
let counterAnimated = false;

const runCounter = () => {
  if (counterAnimated) return;
  counterAnimated = true;
  
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
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

// Use Intersection Observer for better performance
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
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

// ========== SMOOTH SCROLLING - OPTIMIZED ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const navHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });
});

// ========== NAVBAR SCROLL EFFECT - THROTTLED ==========
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

window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(updateNavbar);
    ticking = true;
  }
});

// ========== SCROLL TO TOP ==========
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========== PORTFOLIO FILTER - OPTIMIZED ==========
const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Update active state
    filterBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    
    const filter = this.getAttribute("data-filter");
    
    // Use batch DOM updates
    requestAnimationFrame(() => {
      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        
        if (filter === "all" || category === filter) {
          item.style.display = "block";
          // Trigger reflow
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

// ========== INSTAGRAM ITEMS CLICK ==========
document.querySelectorAll(".instagram-item").forEach((item) => {
  item.addEventListener("click", function () {
    window.open(
      "https://www.instagram.com/roroayu_wedding?igsh=MW11YWNoOHVjaHJ2bQ==",
      "_blank"
    );
  });
});

// ========== LAZY LOADING IMAGES - NATIVE ==========
// Modern browsers support native lazy loading
// Already implemented with loading="lazy" in HTML

// ========== PERFORMANCE OPTIMIZATION ==========
// Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.documentElement.classList.add('reduced-motion');
}

// ========== PREVENT LAYOUT SHIFT ==========
// Add min-height to sections during load
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.style.minHeight) {
      section.style.minHeight = '100vh';
    }
  });
});

// ========== TOUCH DEVICE DETECTION ==========
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
}

// ========== DEBOUNCE FUNCTION FOR RESIZE ==========
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

// Handle resize events
const handleResize = debounce(() => {
  // Reinitialize AOS if needed
  AOS.refresh();
}, 250);

window.addEventListener('resize', handleResize);

// ========== PREFETCH IMPORTANT PAGES ==========
// Prefetch images in viewport
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========== SERVICE WORKER FOR PWA (OPTIONAL) ==========
// Uncomment if you want PWA capabilities
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed'));
  });
}
*/

// ========== CONSOLE LOG - REMOVE IN PRODUCTION ==========
console.log('%c🎨 Roro Ayu Wedding', 'color: #d4a574; font-size: 20px; font-weight: bold;');
console.log('%cWebsite loaded successfully!', 'color: #8b7355; font-size: 12px;');


// WhatsApp Booking
const whatsappBtn = document.querySelector(".whatsapp-btn");

if (whatsappBtn) {
  whatsappBtn.addEventListener("click", function () {
    const message = `Halo Roro Ayu Wedding 👋

Saya tertarik menggunakan jasa make up dari Roro Ayu Wedding.

Detail acara saya:
📅 Tanggal Acara:
💄 Jenis Make Up:
📍 Lokasi Acara:
👥 Jumlah Orang:

Mohon info ketersediaan dan paket harga ya.
Terima kasih 😊`;

    const phoneNumber = "6281252480477"; // WA Roro Ayu Wedding
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  });
}
