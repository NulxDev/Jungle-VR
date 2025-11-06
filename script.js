// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('feature-card') || 
                entry.target.classList.contains('feature-item')) {
                entry.target.style.transitionDelay = '${entry.target.dataset.delay}s';
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.section-container, .feature-card, .feature-item, .download-card, .community-card').forEach((el, index) => {
    el.dataset.delay = (index * 0.1).toString();
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card, .feature-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Dynamic navigation background
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Terms of Service modal behavior
const tosModal = document.getElementById('tos-modal');
const termsLink = document.getElementById('terms-link');
const tosClose = document.getElementById('tos-close');
const tosAccept = document.getElementById('tos-accept');
const tosDecline = document.getElementById('tos-decline');

function openTOS(e) {
    if (e) e.preventDefault();
    tosModal.classList.add('open');
    tosModal.setAttribute('aria-hidden', 'false');
    // focus first focusable element inside modal
    tosClose.focus();
}

function closeTOS() {
    tosModal.classList.remove('open');
    tosModal.setAttribute('aria-hidden', 'true');
}

if (termsLink) termsLink.addEventListener('click', openTOS);
if (tosClose) tosClose.addEventListener('click', closeTOS);
if (tosDecline) tosDecline.addEventListener('click', closeTOS);

if (tosAccept) tosAccept.addEventListener('click', () => {
    try {
        localStorage.setItem('jv_tos_accepted', 'true');
    } catch (e) {
        // localStorage may fail in some environments
    }
    closeTOS();
    // provide a small visible confirmation
    const original = document.querySelector('.hero-text');
    if (original) {
        const note = document.createElement('div');
        note.className = 'tos-accepted-note';
        note.textContent = 'Thanks — you accepted the Terms of Service.';
        note.style.marginTop = '1rem';
        note.style.color = 'var(--text-secondary)';
        original.parentNode.insertBefore(note, original.nextSibling);
        setTimeout(() => note.remove(), 5000);
    }
});

// Close modal with Escape key and clicking overlay
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tosModal && tosModal.classList.contains('open')) {
        closeTOS();
    }
});

if (tosModal) {
    tosModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeTOS();
        }
    });
}

// If already accepted, don't nag — we still allow re-opening via the Terms link
try {
    const accepted = localStorage.getItem('jv_tos_accepted');
    if (accepted === 'true') {
        // optional: we could show a small badge or do nothing
    }
} catch (e) {}
