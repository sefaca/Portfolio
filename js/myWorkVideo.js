window.addEventListener('load', function() {
    const video = document.getElementById('myWorkVideo');
    setTimeout(() => {
        video.play();
    }, 7000); // 2000 ms = 2 segundos de retraso
});