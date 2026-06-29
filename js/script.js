document.addEventListener('DOMContentLoaded', () => {

    // Graceful Anti-Orphan Logic for Project Titles
    const projectTitles = document.querySelectorAll('.overlay h2');
    projectTitles.forEach(title => {
        const text = title.innerHTML.trim();
        const lastSpaceIndex = text.lastIndexOf(' ');
        if (lastSpaceIndex !== -1) {
            title.innerHTML = text.substring(0, lastSpaceIndex) + '&nbsp;' + text.substring(lastSpaceIndex + 1);
        }
    });

    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const isMobile = window.innerWidth <= 768;
    const ctaBtn = document.getElementById('main-cta');
    if (ctaBtn) {
        if (isMobile) {
            ctaBtn.setAttribute('href', '../portfolio/graphic-design.html');
            ctaBtn.textContent = 'View Work';
        } else {
            ctaBtn.setAttribute('href', '../about.html');
            ctaBtn.textContent = 'About Me';
        }
    }

    // Tactile Ripple Effect exclusively for mobile elements and designated liquid buttons
    document.querySelectorAll('.tactile-btn, .tactile-card').forEach(btn => {
        btn.addEventListener('pointerdown', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            let rect = this.getBoundingClientRect();
            let size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const gridHighlight = document.querySelector('.grid-highlight');
    if (gridHighlight && window.matchMedia('(pointer: fine)').matches) {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    gridHighlight.style.setProperty('--mask-x', `${e.clientX}px`);
                    gridHighlight.style.setProperty('--mask-y', `${e.clientY}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    const currentPath = window.location.pathname;
    const navLinksList = document.querySelectorAll('.desktop-nav a');
    navLinksList.forEach(link => {
        if (link.getAttribute('href') !== '#' && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active-page');
        }
    });

    const navLinks = document.querySelectorAll('.desktop-nav a');
    navLinks.forEach((link, index) => {
        setTimeout(() => {
            link.classList.add('nav-enter');
        }, index * 150 + 300);
    });

    // Ensure all variants of the contact button trigger the copy event securely
    const contactBtns = document.querySelectorAll('.contact-btn');
    const email = 'ayaanahmedstudios@gmail.com';
    let copyTimeouts = new Map();

    contactBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(email);

            const label = btn.querySelector('.contact-label');
            const success = btn.querySelector('.contact-success');
            
            if (label && success) {
                label.style.display = 'none';
                success.style.display = 'flex';

                if (copyTimeouts.has(index)) clearTimeout(copyTimeouts.get(index));
                
                const timeout = setTimeout(() => {
                    success.style.display = 'none';
                    label.style.display = 'flex';
                }, 2500);
                
                copyTimeouts.set(index, timeout);
            }
        });
    });

    if (!document.querySelector('.lightbox')) {
        const lightboxMarkup = `
        <div class="lightbox">
            <div class="lightbox-close">&times;</div>
            <div class="lightbox-content">
                <img src="" class="lightbox-img" alt="Enlarged view">
                <div class="lightbox-caption">
                    <h3 id="lb-title"></h3>
                    <div class="lb-meta">
                        <span id="lb-year"></span>
                        <span id="lb-sep"> • </span>
                        <span id="lb-location"></span>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', lightboxMarkup);
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const photoItems = document.querySelectorAll('.photo-item');
    const lbTitle = document.getElementById('lb-title');
    const lbYear = document.getElementById('lb-year');
    const lbLocation = document.getElementById('lb-location');

    photoItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = item.querySelector('img');
            const title = item.dataset.title || "";
            const year = item.dataset.year || "";
            const location = item.dataset.location || "";
            
            if (lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                if(lbTitle) lbTitle.innerText = title;
                if(lbYear) lbYear.innerText = year;
                if(lbLocation) lbLocation.innerText = location;
                lightbox.style.display = 'flex';
                requestAnimationFrame(() => {
                    lightbox.classList.add('active');
                });
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => { 
                lightbox.style.display = 'none';
                if (lightboxImg) lightboxImg.src = ''; 
            }, 400); 
            document.body.style.overflow = '';
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });

    // Inner project page animations only
    const innerPageItems = document.querySelectorAll('.animate-on-load, .project-top-nav');
    if (innerPageItems.length > 0) {
        innerPageItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.08}s`; 
            item.classList.add('animate-in');
        });
    }

    // Trigger animations for index title sequentially (mobile)
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if(heroTitle) heroTitle.classList.add('animate-title');
    }, 100);

    // Watch for header changes to remove menu border securely
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    document.querySelector('.header').style.borderBottom = 'none';
                } else {
                    document.querySelector('.header').style.borderBottom = '';
                }
            });
        });
        observer.observe(menuOverlay, { attributes: true, attributeFilter: ['class'] });
    }

    const typewriters = document.querySelectorAll('.typewriter');
    typewriters.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        el.style.opacity = 1;
        let i = 0;
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'terminal-cursor-blink';
        cursorSpan.innerHTML = '&nbsp;';
        cursorSpan.style.borderRight = '3px solid var(--accent-color)';
        cursorSpan.style.animation = 'cursorBlink 1s step-end infinite';
        function type() {
            if (i < text.length) {
                el.textContent = text.substring(0, i + 1);
                el.appendChild(cursorSpan);
                i++;
                setTimeout(type, 50);
            }
        }
        setTimeout(type, 300);
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes cursorBlink { 0%, 100% { border-color: var(--accent-color); } 50% { border-color: transparent; } }`;
    document.head.appendChild(styleSheet);

    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
});

function toggleMenu() {
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuIcon = document.querySelector('.menu-icon');
    const isVisible = menuOverlay.classList.contains('active');

    if (isVisible) {
        menuOverlay.classList.remove('active'); 
        menuIcon.classList.remove('open');
        document.body.classList.remove('menu-open-active');
        document.body.style.overflow = '';
    } else {
        menuOverlay.classList.add('active');
        menuIcon.classList.add('open');
        document.body.classList.add('menu-open-active');
        document.body.style.overflow = 'hidden';
    }
}
