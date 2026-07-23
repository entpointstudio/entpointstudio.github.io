document.addEventListener('DOMContentLoaded', () => {
    initVideoPlayers();

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

    // Wait for the full load (fonts, images, gifs) so every section has its
    // final layout height before ScrollTrigger measures scroll positions —
    // measuring too early causes triggers to fire at the wrong scroll offset.
    if (document.readyState === 'complete') {
        initCogAnimations();
    } else {
        window.addEventListener('load', initCogAnimations);
    }
});

// Custom Video Player Interactivity — works on any .cog-video-container
function initVideoPlayers() {
    document.querySelectorAll('.cog-video-container').forEach(container => {
        const video = container.querySelector('.cog-video-player');
        if (!video) return;
        const playBtn = container.querySelector('.cog-play-btn');
        const playToggle = container.querySelector('.cog-play-toggle');
        const volumeToggle = container.querySelector('.cog-volume-toggle');
        const fullscreenToggle = container.querySelector('.cog-fullscreen-toggle');
        const progress = container.querySelector('.cog-progress');
        const timelineContainer = container.querySelector('.cog-timeline-container');
        const timeDisplay = container.querySelector('.cog-time-display');

        // Format time display
        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }

        // Update time display when metadata loads
        video.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        });

        // If metadata is already loaded
        if (video.duration) {
            timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        }

        // Toggle play/pause
        function togglePlay() {
            if (video.paused) {
                video.play();
                playBtn.classList.add('playing');
                container.classList.remove('is-paused');
                playToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            } else {
                video.pause();
                playBtn.classList.remove('playing');
                container.classList.add('is-paused');
                playToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
            }
        }

        playBtn.addEventListener('click', togglePlay);
        playToggle.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        // Update Progress Bar & Timer
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const percentage = (video.currentTime / video.duration) * 100;
                progress.style.width = `${percentage}%`;
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            }
        });

        // Seek on Timeline click
        timelineContainer.addEventListener('click', (e) => {
            const rect = timelineContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            video.currentTime = percentage * video.duration;
        });

        // Mute / Unmute Toggle
        volumeToggle.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                volumeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM3 9v6h4l5 5V4L7 9H3z" style="opacity:0.5;"/></svg>';
            } else {
                volumeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM3 9v6h4l5 5V4L7 9H3z"/></svg>';
            }
        });

        // Fullscreen Toggle
        fullscreenToggle.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    });
}

function initCogAnimations() {
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

        // Restoria-page extras: CTA buttons, testimonial, stats, gallery, socials
        const extras = section.querySelectorAll(':scope > .btn, .prologue-buttons, .quote-section, .stats-bar, .restoria-scroller, .social-grid');
        if (extras.length) {
            gsap.from(extras, {
                y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
                scrollTrigger: { trigger: extras[0], start: 'top 92%' }
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
        { el: '.cog-statement', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' },

        // restoria.html's own zones
        { el: '#r-hero', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' },
        { el: '#r-prologue', bg: '#31231d', ink: '#fff7f3', link: '#e9c98f', ring: 'rgba(255,247,243,0.35)' },
        { el: '#r-story', bg: '#f4e6cf', ink: '#31231d', link: '#a85b38', ring: 'rgba(49,35,29,0.25)' },
        { el: '#r-feature-1', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' },
        { el: '#r-feature-2', bg: '#f4e6cf', ink: '#31231d', link: '#a85b38', ring: 'rgba(49,35,29,0.25)' },
        { el: '#r-feature-3', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' },
        { el: '#r-feature-4', bg: '#f4e6cf', ink: '#31231d', link: '#a85b38', ring: 'rgba(49,35,29,0.25)' },
        { el: '#r-gallery', bg: '#31231d', ink: '#fff7f3', link: '#e9c98f', ring: 'rgba(255,247,243,0.35)' },
        { el: '#r-socials', bg: '#ffffff', ink: '#000000', link: '#0099ff', ring: 'rgba(255,255,255,0)' }
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

    ScrollTrigger.refresh();
}
