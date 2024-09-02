// Función para cambiar la clase de los enlaces
function changeLinkColors() {
    var scrollPosition = window.scrollY;

    var contentInfoSection = document.querySelector('.content-info-personal');
    var contentInfoPosition = contentInfoSection.offsetTop;

    var workSection = document.querySelector('.my-work-section');
    var workSectionPosition = workSection.offsetTop;

    var contactSection = document.querySelector('#contact');  // Selecciona la sección de contacto
    var contactSectionPosition = contactSection.offsetTop;

    if (scrollPosition >= contactSectionPosition) {
        // Cambiar colores cuando se llega a la sección de contacto
        setLinkColors('#5e2ced');
    } else if (scrollPosition >= workSectionPosition) {
        // Cambiar colores cuando se llega a la sección my-work-section
        setLinkColors('#00D044');
    } else if (scrollPosition >= contentInfoPosition) {
        // Cambiar colores cuando se llega a la sección content-info-personal
        setLinkColors('#EF412C', '#E6DFD8');
    } else {
        // Restablecer colores originales
        setLinkColors('');
    }
}

// Función para establecer los colores de los enlaces
function setLinkColors(colorLeft = '', colorRight = '') {
    document.getElementById('link-welcome').style.color = colorLeft; // Color para el enlace superior izquierdo
    document.getElementById('link-about').style.color = colorLeft; // Color para el enlace inferior izquierdo
    document.getElementById('link-works').style.color = colorRight || colorLeft; // Color para el enlace superior derecho
    document.getElementById('link-example').style.color = colorRight || colorLeft; // Color para el enlace inferior derecho
}

// Escuchar el scroll para cambiar las clases
window.addEventListener('scroll', changeLinkColors);

// Llamar la función inicialmente
changeLinkColors();
