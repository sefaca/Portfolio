// Función para cambiar la clase de los enlaces
function changeLinkColors() {
    var links = document.querySelectorAll('.nav_link');
    var scrollPosition = window.scrollY;

    links.forEach(link => {
        // Aquí puedes ajustar la lógica para cambiar la clase dependiendo del scroll
        if (scrollPosition > 100) { // Ejemplo de condición
            link.classList.add('is-white');
            link.classList.remove('is-black');
        } else {
            link.classList.add('is-black');
            link.classList.remove('is-white');
        }
    });
}

// Escuchar el scroll para cambiar las clases
window.addEventListener('scroll', changeLinkColors);

// Llamar la función inicialmente
changeLinkColors();
