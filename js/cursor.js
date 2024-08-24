// Crear el cursor personalizado
const cursor = document.createElement('div');
cursor.classList.add('cursor');
const cursorInner = document.createElement('div');
cursorInner.classList.add('inner');
cursor.appendChild(cursorInner);
document.body.appendChild(cursor);

// Mover el cursor personalizado junto con el mouse
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Expansión del cursor al pasar sobre elementos interactivos
document.querySelectorAll('a, button, .hover-target').forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});
