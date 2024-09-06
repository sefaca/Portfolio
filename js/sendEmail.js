src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js">;
type="text/javascript">
    (function() {
        emailjs.init("service_is3l1lz"); // Reemplaza con tu userID de EmailJS
    })();

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envío del formulario normal

        // Enviar el correo usando EmailJS
        emailjs.sendForm('Yservice_is3l1lz', this)
            .then(function(response) {
                alert('Message sent successfully!', response.status, response.text);
            }, function(error) {
                alert('Failed to send message.', error);
            });
    });