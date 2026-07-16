document.addEventListener('DOMContentLoaded', () => {
    // Legacy fade-up (used by restoria.html)
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.15 });
        fadeElements.forEach(el => observer.observe(el));
    }

    // GSAP spring animations for the cog homepage
    if (!document.body.classList.contains('cog-page') || !window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    const spring = 'elastic.out(1, 0.75)';
    const pop = 'back.out(1.7)';

    // Preview cards fly in on load, settle tilted
    const tilts = [-8, -2, 6, 13];
    const offsets = [
        { x: -139, y: -11 },
        { x: -88, y: -45 },
        { x: -44, y: -69 },
        { x: 18, y: -90 }
    ];
    document.querySelectorAll('.cog-preview-card').forEach((card, i) => {
        const tilt = tilts[i % tilts.length];
        const from = offsets[i % offsets.length];
        gsap.fromTo(card,
            { x: from.x, y: from.y, rotation: 0, opacity: 0 },
            { x: 0, y: 0, rotation: tilt, opacity: 1, duration: 1.2, delay: 0.3 + i * 0.05, ease: spring }
        );

        // Hover: straighten and lift with a springy feel
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { rotation: tilt / 3, scale: 1.08, duration: 0.5, ease: pop });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotation: tilt, scale: 1, duration: 0.5, ease: pop });
        });
    });

    // Per-section entrances on scroll
    document.querySelectorAll('.cog-section').forEach(section => {
        const headline = section.querySelector('.cog-headline');
        const pill = section.querySelector('.cog-status-pill');
        const video = section.querySelector('.cog-video-container');
        const description = section.querySelector('.cog-description');

        if (headline) {
            gsap.from(headline, {
                y: 80, opacity: 0, duration: 1, ease: pop,
                scrollTrigger: { trigger: headline, start: 'top 88%' }
            });
        }
        if (pill) {
            gsap.from(pill, {
                scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(2)',
                scrollTrigger: { trigger: pill, start: 'top 92%' }
            });
        }
        if (video) {
            gsap.from(video, {
                y: 120, rotation: 2, opacity: 0, duration: 1.1, ease: pop,
                scrollTrigger: { trigger: video, start: 'top 85%' }
            });
        }
        if (description) {
            gsap.from(description, {
                y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: description, start: 'top 92%' }
            });
        }
    });

    // Statement rises with a spring
    const statement = document.querySelector('.cog-statement-text');
    if (statement) {
        gsap.from(statement, {
            y: 100, opacity: 0, rotation: -2, duration: 1.2, ease: pop,
            scrollTrigger: { trigger: statement, start: 'top 85%' }
        });
    }

    // Footer: brand, nav items and socials pop in staggered
    const footerItems = document.querySelectorAll('.cog-footer-brand, .cog-nav-item, .cog-footer-meta');
    if (footerItems.length) {
        gsap.from(footerItems, {
            y: 50, opacity: 0, duration: 0.9, ease: pop, stagger: 0.12,
            scrollTrigger: { trigger: '.cog-footer', start: 'top 90%' }
        });
    }

    // Scroll-driven page color zones: the page tints orange/green per
    // section and returns to white at the top and the footer
    const colorZones = [
        { el: '#restoria', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' },
        { el: '#mni', bg: '#f4e6cf', ink: '#31231d', link: '#a85b38', ring: 'rgba(49,35,29,0.25)' },
        { el: '#npoint', bg: '#31231d', ink: '#fff7f3', link: '#e9c98f', ring: 'rgba(255,247,243,0.35)' },
        { el: '.cog-statement', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' }
    ];
    colorZones.forEach(zone => {
        if (!document.querySelector(zone.el)) return;
        const paint = () => gsap.to('.cog-page', {
            backgroundColor: zone.bg,
            '--cog-ink': zone.ink,
            '--cog-link': zone.link,
            '--cog-ring': zone.ring,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
        });
        ScrollTrigger.create({
            trigger: zone.el,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: paint,
            onEnterBack: paint
        });
    });
});
