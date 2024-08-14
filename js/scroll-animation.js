// Detectar el scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const triggerHeight = windowHeight * 0.5;
    const showAfterContentHeight = windowHeight * 1.5; // Mostrar el contenido extra después del zoom

    // Activar la clase de zoom cuando el usuario hace scroll
    if (scrollPosition > triggerHeight) {
        document.querySelector('.container').classList.add('zoom-in');
    } else {
        document.querySelector('.container').classList.remove('zoom-in');
    }

    // Mostrar el contenido extra cuando se hace más scroll
    if (scrollPosition > showAfterContentHeight) {
        document.body.classList.add('show-after-content');
    } else {
        document.body.classList.remove('show-after-content');
    }

    // Mostrar la sección adicional cuando se hace scroll
    if (scrollPosition > showAfterContentHeight + windowHeight) {
        document.querySelector('.additional-content').style.opacity = 1;
    } else {
        document.querySelector('.additional-content').style.opacity = 0;
    }
});
