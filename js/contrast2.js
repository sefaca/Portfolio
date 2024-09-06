// Función para cambiar la clase de los enlaces
function changeLinkColors() {
    var links = document.querySelectorAll('.nav_link');
    var scrollPosition = window.scrollY;
    var contentInfoSection = document.querySelector('.content-info-personal');
    var contentInfoPosition = contentInfoSection.offsetTop;

    links.forEach(link => {
        // Cambiar colores cuando se llega a la sección content-info-personal
        if (scrollPosition >= contentInfoPosition) {
            document.getElementById('link-welcome').style.color = '#EF412C'; // Naranja para el enlace superior izquierdo
            document.getElementById('link-about').style.color = '#EF412C'; // Naranja para el enlace inferior izquierdo
            document.getElementById('link-works').style.color = '#E6DFD8'; // Blanco roto para el enlace superior derecho
            document.getElementById('link-contact').style.color = '#E6DFD8'; // Blanco roto para el enlace inferior derecho
        } else {
            // Restablecer colores originales
            document.getElementById('link-welcome').style.color = ''; // Color original
            document.getElementById('link-about').style.color = ''; // Color original
            document.getElementById('link-works').style.color = ''; // Color original
            document.getElementById('link-contact').style.color = ''; // Color original
        }
    });
}

// Escuchar el scroll para cambiar las clases
window.addEventListener('scroll', changeLinkColors);

// Llamar la función inicialmente
changeLinkColors();
