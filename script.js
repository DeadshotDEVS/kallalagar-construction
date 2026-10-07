/* =============================================================
   KALLALAGAR CONSTRUCTION — v2 Premium Interactions
   Inspired by Infinity Constructions + Awwwards
   ============================================================= */

(function () {
    'use strict';

    // =========== PRELOADER ===========
    const loader = document.getElementById('loader');
    const loaderCounter = document.getElementById('loaderCounter');
    const loaderBar = document.getElementById('loaderBar');
    let progress = 0;

    function advanceLoader() {
        const increment = Math.random() * 12 + 3;
        progress = Math.min(progress + increment, 100);
        loaderCounter.textContent = Math.round(progress);
        loaderBar.style.width = progress + '%';
        if (progress < 100) {
            setTimeout(advanceLoader, 100 + Math.random() * 120);
        } else {
            setTimeout(() => {
                loader.classList.add('done');
                document.body.style.overflow = '';
                initHeroAnimations();
            }, 400);
        }
    }

    document.body.style.overflow = 'hidden';
    setTimeout(advanceLoader, 300);

    // =========== HEADER SCROLL ===========
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        lastScroll = y;
    }, { passive: true });

    // =========== BURGER ===========
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // =========== SMOOTH SCROLL ===========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const id = anchor.getAttribute('href');
            const el = document.querySelector(id);
            if (!el) return;
            const offset = 80;
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        });
    });

    // =========== HERO SLIDER ===========
    const slides = document.querySelectorAll('.hero-slide');
    const sliderCurrent = document.getElementById('sliderCurrent');
    const sliderName = document.getElementById('sliderName');
    const progressBar = document.getElementById('heroProgressBar');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    const slideNames = ['Modern Tropical Villa', 'Royal Gardens Township', 'Business Hub Complex', 'Premium Night Living'];
    let currentSlide = 0;
    let slideInterval;
    let progressInterval;
    const SLIDE_DURATION = 6000;

    function goToSlide(idx) {
        slides.forEach(s => s.classList.remove('active'));
        slides[idx].classList.add('active');
        currentSlide = idx;
        sliderCurrent.textContent = String(idx + 1).padStart(2, '0');
        sliderName.textContent = slideNames[idx];
        resetProgress();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function resetProgress() {
        clearInterval(progressInterval);
        clearTimeout(slideInterval);
        let p = 0;
        progressBar.style.width = '0%';
        progressInterval = setInterval(() => {
            p += 100 / (SLIDE_DURATION / 50);
            progressBar.style.width = Math.min(p, 100) + '%';
        }, 50);
        slideInterval = setTimeout(nextSlide, SLIDE_DURATION);
    }

    nextBtn.addEventListener('click', () => nextSlide());
    prevBtn.addEventListener('click', () => prevSlide());

    // Touch swipe on hero
    let touchStartX = 0;
    const heroEl = document.getElementById('hero');
    heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) diff > 0 ? prevSlide() : nextSlide();
    }, { passive: true });

    function initHeroAnimations() {
        resetProgress();
    }

    // =========== STAT COUNTERS ===========
    const counters = document.querySelectorAll('.count');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        statsCounted = true;
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2200;
            const start = performance.now();
            function update(now) {
                const elapsed = now - start;
                const pct = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - pct, 4);
                counter.textContent = Math.round(target * eased);
                if (pct < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // =========== PROJECTS CAROUSEL ===========
    const track = document.getElementById('projectsTrack');
    const projCards = track.querySelectorAll('.project-card');
    const projPrev = document.getElementById('projPrev');
    const projNext = document.getElementById('projNext');
    const projDots = document.querySelectorAll('.proj-dot');
    let projIndex = 0;

    function getCardsVisible() {
        const w = window.innerWidth;
        if (w < 520) return 1;
        if (w < 800) return 2;
        if (w < 1100) return 3;
        return 4;
    }

    function updateCarousel() {
        const visible = getCardsVisible();
        const maxIdx = Math.max(0, projCards.length - visible);
        projIndex = Math.min(projIndex, maxIdx);
        const card = projCards[0];
        const gap = parseInt(getComputedStyle(track).gap) || 24;
        const cardW = card.offsetWidth + gap;
        track.style.transform = `translateX(-${projIndex * cardW}px)`;

        projDots.forEach((d, i) => d.classList.toggle('active', i === projIndex));
    }

    projNext.addEventListener('click', () => {
        const visible = getCardsVisible();
        const maxIdx = Math.max(0, projCards.length - visible);
        projIndex = Math.min(projIndex + 1, maxIdx);
        updateCarousel();
    });

    projPrev.addEventListener('click', () => {
        projIndex = Math.max(projIndex - 1, 0);
        updateCarousel();
    });

    projDots.forEach(dot => {
        dot.addEventListener('click', () => {
            projIndex = parseInt(dot.dataset.idx);
            updateCarousel();
        });
    });

    // Touch swipe on carousel
    let carouselTouchX = 0;
    const carouselEl = document.getElementById('projectsCarousel');
    carouselEl.addEventListener('touchstart', e => { carouselTouchX = e.changedTouches[0].screenX; }, { passive: true });
    carouselEl.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].screenX - carouselTouchX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) { projIndex = Math.max(projIndex - 1, 0); }
            else {
                const visible = getCardsVisible();
                const maxIdx = Math.max(0, projCards.length - visible);
                projIndex = Math.min(projIndex + 1, maxIdx);
            }
            updateCarousel();
        }
    }, { passive: true });

    window.addEventListener('resize', () => { updateCarousel(); });

    // =========== TESTIMONIALS ===========
    const testCards = document.querySelectorAll('.test-card');
    const testDots = document.querySelectorAll('.test-dot');
    let testIdx = 0;
    let testTimer;

    function showTest(idx) {
        testCards.forEach(c => c.classList.remove('active'));
        testDots.forEach(d => d.classList.remove('active'));
        testCards[idx].classList.add('active');
        testDots[idx].classList.add('active');
        testIdx = idx;
    }

    function nextTest() {
        showTest((testIdx + 1) % testCards.length);
    }

    testDots.forEach(d => {
        d.addEventListener('click', () => {
            clearInterval(testTimer);
            showTest(parseInt(d.dataset.tdot));
            testTimer = setInterval(nextTest, 5000);
        });
    });

    testTimer = setInterval(nextTest, 5000);

    // =========== SCROLL REVEAL ===========
    const reveals = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // stagger based on sibling index
                const parent = entry.target.parentElement;
                const siblings = parent ? Array.from(parent.querySelectorAll('.reveal-up')) : [];
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    reveals.forEach(el => revealObserver.observe(el));

    // Stats intersection
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { animateCounters(); statsObs.unobserve(statsSection); }
        }, { threshold: 0.3 });
        statsObs.observe(statsSection);
    }

    // =========== HERITAGE PARALLAX ===========
    const heritageBg = document.querySelector('.heritage-bg');
    if (heritageBg) {
        window.addEventListener('scroll', () => {
            const rect = heritageBg.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const pct = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                heritageBg.style.transform = `translateY(${pct * 50 - 25}px)`;
            }
        }, { passive: true });
    }

    // =========== CONTACT FORM ===========
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('formSubmitBtn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>Sent Successfully! ✓</span>';
            btn.style.background = '#10B981';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // =========== MAGNETIC BUTTONS (desktop) ===========
    if (window.innerWidth > 960) {
        document.querySelectorAll('.hero-arrow, .proj-arrow, .form-submit, .footer-cta-btn, .nav-item-cta').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

})();
