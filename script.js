document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that have the fade-up class
    const fadeElements = document.querySelectorAll('.fade-up');

    // Setup the Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each element
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});
