document.addEventListener("DOMContentLoaded", () => {
    // Alle Menü-Titel
    const titles = document.querySelectorAll(".mein-grid--menu .title");
    // Alle Detail-Boxen
    const detailBoxes = document.querySelectorAll(".mein-grid--details .box");
    const menuBoxes = document.querySelectorAll(".mein-grid--menu .box");
    const body = document.body;

    // Klick-Handler für alle Projekttitel
    titles.forEach(title => {
        title.addEventListener("click", (event) => {
            event.preventDefault();

            // focus-mode aktivieren
            body.classList.add("focus-mode");

            // Projektname aus data-Attribut holen
            const project = title.closest(".box").dataset.project;

            // Alle Detail-Boxen unsichtbar machen
            detailBoxes.forEach(box => {
                box.style.display = "none";
            });
            
            // Alle Menü-Boxen unsichtbar machen
            menuBoxes.forEach(box => {
                box.style.visibility = "hidden";
            });

            // Die geklickte Menü-Box sichtbar lassen
            title.closest(".box").style.visibility = "visible";

            // Nur die passende Detail-Box sichtbar machen
            const targetBox = document.querySelector(`.mein-grid--details .box[data-project="${project}"]`);
              if (targetBox) {
                targetBox.style.display = "grid";

                // *** VIDEO STARTEN ***
                const video = targetBox.querySelector("video");
                
                if (video) {
                    video.play();
                }
                // *********************
              }
        });
    });

    // Klick-Handler für den "Menu"-Link
    const menuLink = document.querySelector(".top-menu");
    if (menuLink) {
        menuLink.addEventListener("click", (event) => {
            event.preventDefault();
            
            // Alle Detail-Boxen ausblenden
            detailBoxes.forEach(box => {
                box.style.display = "none";
            });
            
            // Alle Menü-Boxen wieder einblenden
            menuBoxes.forEach(box => {
                box.style.visibility = "visible";
            });
            
            // focus-mode deaktivieren
            body.classList.remove("focus-mode");

            // *** VIDEO PAUSIEREN ***
            // Finde ALLE Videos auf der Seite
            const allVideos = document.querySelectorAll(".mein-grid--details video");
            
            // Pausiere jedes Video und setze es zurück
            allVideos.forEach(video => {
                video.pause();
                video.currentTime = 0;
            });
            // ***********************
        });
    }
});