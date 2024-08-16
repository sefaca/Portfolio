window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const triggerHeight = windowHeight * 0.3; // Al 90% del scroll
    const container = document.querySelector('.container');
    const video = document.querySelector('.vidzflow-embed');
    const text = document.querySelector('.develop-text');

    if (scrollPosition > triggerHeight) {
        container.classList.add('zoom-in');
    } else {
        container.classList.remove('zoom-in');
    }

    if (scrollPosition > windowHeight) {
        container.classList.remove('fixed');
        container.classList.add('relative');
    } else {
        container.classList.add('fixed');
        container.classList.remove('relative');
    }
});
