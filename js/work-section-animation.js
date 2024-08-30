document.addEventListener('DOMContentLoaded', function() {
    const leftSections = document.querySelectorAll('.cook-mate-preview-app-left');
    const rightSections = document.querySelectorAll('.cook-mate-preview-app-right');
    const leftSectionsWebsite = document.querySelectorAll('.website-preview-app-left');
    const rightSectionsWebsite = document.querySelectorAll('.website-preview-app-right');


    function checkPosition() {
        const triggerBottom = window.innerHeight / 5 * 4;

        leftSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('show-left'); // Aparece desde la izquierda
            } else {
                section.classList.remove('show-left');
            }
        });

        leftSectionsWebsite.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('show-left'); // Aparece desde la izquierda
            } else {
                section.classList.remove('show-left');
            }
        });

        rightSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('show-right'); // Aparece desde la derecha
            } else {
                section.classList.remove('show-right');
            }
        });

        rightSectionsWebsite.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('show-right'); // Aparece desde la derecha
            } else {
                section.classList.remove('show-right');
            }
        });
    }

    window.addEventListener('scroll', checkPosition);
    checkPosition();
});
