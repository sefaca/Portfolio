window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    const container = document.querySelector('.container');
    const techIconsSection = document.querySelector('.tech-icons');
    const contentInfoSection = document.querySelector('.content-info-personal');
    
    const contentInfoPosition = contentInfoSection.offsetTop - windowHeight * 0.3;

    const triggerHeight = windowHeight * 0.3; // Al 30% del scroll

    // Zoom in on the video and hide DEVELOP text
    if (scrollPosition > triggerHeight) {
        container.classList.add('zoom-in');
    } else {
        container.classList.remove('zoom-in');
    }

    // Transition container from fixed to relative position
    if (scrollPosition > windowHeight) {
        container.classList.remove('fixed');
        container.classList.add('relative');
    } else {
        container.classList.add('fixed');
        container.classList.remove('relative');
    }

    // Show tech icons when the user reaches the content-info-personal section
    if (scrollPosition >= contentInfoPosition) {
        techIconsSection.classList.add('show-icons');
    }
});
