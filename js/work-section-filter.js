document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filter-all').addEventListener('click', function() {
        // Mostrar todas las secciones
        let allSections = document.querySelectorAll('.cook-mate-preview-app-left, .cook-mate-preview-app-right, .website-preview-app-left, .website-preview-app-right');
        allSections.forEach(section => {
            section.style.display = 'flex';
        });
    });

    document.getElementById('filter-web').addEventListener('click', function() {
        // Mostrar solo las secciones de Web Development
        let appSections = document.querySelectorAll('.app-mobile');
        let webSections = document.querySelectorAll('.web-development');

        appSections.forEach(section => {
            section.style.display = 'none';
        });

        webSections.forEach(section => {
            section.style.display = 'flex';
        });
    });

    document.getElementById('filter-app').addEventListener('click', function() {
        // Mostrar solo las secciones de App Mobile
        let appSections = document.querySelectorAll('.app-mobile');
        let webSections = document.querySelectorAll('.web-development');

        webSections.forEach(section => {
            section.style.display = 'none';
        });

        appSections.forEach(section => {
            section.style.display = 'flex';
        });
    });
});
