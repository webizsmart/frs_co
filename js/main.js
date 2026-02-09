// ============================================
// GRS USA LLC - Main JavaScript
// Navigation, Animations, and Interactions
// ============================================

// ========== Header Scroll Effect ==========
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ========== Mobile Menu Toggle ==========
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========== Number Counter Animation ==========
function animateCounter(element, target) {
  const duration = 2000; // 2 seconds
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

// ========== Intersection Observer for Animations ==========
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      
      // Trigger counter animation for stat numbers
      if (entry.target.classList.contains('stat-number')) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target); // Only animate once
      }
    }
  });
}, observerOptions);

// Observe all stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
  observer.observe(stat);
});

// Observe cards for stagger animation
document.querySelectorAll('.card, .business-card').forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
});

// ========== Active Navigation Link ==========
function setActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current) && current !== '') {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// ========== Form Validation (for contact page) ==========
function validateForm(formId) {
  const form = document.getElementById(formId);
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      const errorElement = input.parentElement.querySelector('.error-message');
      
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        if (errorElement) {
          errorElement.textContent = '이 필드는 필수입니다.';
          errorElement.style.display = 'block';
        }
      } else {
        input.classList.remove('error');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
      
      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          input.classList.add('error');
          if (errorElement) {
            errorElement.textContent = '유효한 이메일 주소를 입력하세요.';
            errorElement.style.display = 'block';
          }
        }
      }
    });
    
    if (isValid) {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = '문의가 성공적으로 전송되었습니다!';
      successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
      `;
      
      document.body.appendChild(successMessage);
      
      // Reset form
      form.reset();
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
          successMessage.remove();
        }, 300);
      }, 3000);
    }
  });
  
  // Remove error on input
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errorElement = input.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    });
  });
}

// Initialize form validation
validateForm('contactForm');
validateForm('partnershipForm');

// ========== Cost Calculator (for contact page) ==========
function initCostCalculator() {
  const calculator = document.getElementById('costCalculator');
  
  if (!calculator) return;
  
  const areaInput = document.getElementById('projectArea');
  const typeSelect = document.getElementById('projectType');
  const resultDiv = document.getElementById('calculatorResult');
  const calculateBtn = document.getElementById('calculateCost');
  
  if (!calculateBtn) return;
  
  calculateBtn.addEventListener('click', () => {
    const area = parseFloat(areaInput.value);
    const type = typeSelect.value;
    
    if (!area || area <= 0) {
      resultDiv.innerHTML = '<p style="color: #ef4444;">유효한 면적을 입력하세요.</p>';
      return;
    }
    
    // Cost calculation logic (example rates per m²)
    const rates = {
      road: 25000,      // 도로
      walkway: 20000,   // 산책로
      warehouse: 30000, // 물류센터
      parking: 22000    // 주차장
    };
    
    const rate = rates[type] || 25000;
    const grsCost = area * rate;
    const traditionalCost = area * rate * 1.67; // 40% more expensive
    const savings = traditionalCost - grsCost;
    const carbonReduction = area * 15; // kg CO2 per m²
    
    resultDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 1.5rem; border-radius: 1rem; margin-top: 1rem;">
        <h4 style="color: #1e40af; margin-bottom: 1rem;">견적 결과</h4>
        <div style="display: grid; gap: 0.75rem;">
          <div>
            <strong>GRS 공사비:</strong> 
            <span style="color: #10b981; font-size: 1.25rem; font-weight: 700;">
              ${grsCost.toLocaleString()}원
            </span>
          </div>
          <div>
            <strong>기존 공법 대비:</strong> 
            <span style="color: #6b7280;">
              ${traditionalCost.toLocaleString()}원
            </span>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #10b981;">
            <strong>💰 절감 비용:</strong> 
            <span style="color: #059669; font-size: 1.25rem; font-weight: 700;">
              ${savings.toLocaleString()}원
            </span>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
            <strong>🌱 탄소 감축:</strong> 
            <span style="color: #2563eb; font-size: 1.25rem; font-weight: 700;">
              ${carbonReduction.toLocaleString()}kg CO₂
            </span>
          </div>
        </div>
        <p style="margin-top: 1rem; color: #6b7280; font-size: 0.875rem;">
          * 상기 금액은 참고용 예상 견적이며, 실제 금액은 현장 조건에 따라 달라질 수 있습니다.
        </p>
      </div>
    `;
  });
}

// Initialize calculator
initCostCalculator();

// ========== Page Load Animation ==========
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ========== Utility: Debounce Function ==========
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

// ========== Lazy Loading Images ==========
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

console.log('🚀 GRS USA LLC Website loaded successfully!');
