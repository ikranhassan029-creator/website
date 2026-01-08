// ===================================================================
// NEU: Globale Variable und Scroll-Erkennung
// ===================================================================
// Globale Variable, die erkennt, ob der Benutzer manuell gescrollt hat.
let userHasScrolled = false; 

// Handler-Funktion: Setzt die Flagge auf true und entfernt sich selbst.
function handleUserScroll() {
    userHasScrolled = true;
    // Entfernt den Event-Listener, damit er nicht unnötig Ressourcen verbraucht
    window.removeEventListener('scroll', handleUserScroll); 
}
// HINWEIS: Der Listener wird jetzt NICHT direkt beim Laden hinzugefügt, 
// sondern erst NACH dem Klick, um die Wartezeit sauber zu erfassen (siehe unten).
// ===================================================================


document.addEventListener("DOMContentLoaded", () => {
    // Feste Scroll-Geschwindigkeit (Höher = langsamer)
    const SCROLL_DURATION = 2000; // Zeit in Millisekunden (2000ms = 2 Sekunden)

    // Funktion für das benutzerdefinierte, langsame Scrollen
    function smoothScrollToElement(targetElement, duration) {
        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Eine einfachere Easing-Funktion (Smooth Start/End)
            const easeProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress); 

            window.scrollTo(0, startPosition + distance * easeProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        requestAnimationFrame(animation);
    }
    
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

            // 1. focus-mode aktivieren (Startet den CSS Farbübergang)
            body.classList.add("focus-mode");

            // *** NEUE LOGIK START ***
            // 1. Flagge zurücksetzen
            userHasScrolled = false; 
            // 2. Scroll-Listener HINZUFÜGEN, um manuelle Scroll-Bewegungen JETZT zu erfassen
            window.addEventListener('scroll', handleUserScroll); 
            // *** NEUE LOGIK ENDE ***
            
            // Projektname aus data-attribut holen
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
                
                // *** LANGSAMER SCROLL-EFFEKT STARTEN ***
                // Das Scroll-Ziel ist nun IMMER das project-hero Element
                const scrollTarget = targetBox.querySelector(".project-hero");
                
                if (scrollTarget) {
                    // Warten, bis der Hintergrund fast schwarz ist (CSS-Transition)
                    setTimeout(() => {
                        // *** NEUE IF-KONDITION HINZUGEFÜGT ***
                        if (!userHasScrolled) {
                            smoothScrollToElement(scrollTarget, SCROLL_DURATION);
                        }
                        // Listener sofort wieder entfernen, damit er beim nächsten Klick neu startet
                        window.removeEventListener('scroll', handleUserScroll); 
                        // *** NEUE IF-KONDITION ENDE ***
                    }, 3000); // Verzögerung vor dem Scroll-Start (3000ms = 3 Sekunden)
                }
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

            // Automatisch wieder ganz nach oben scrollen
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // *** VIDEO PAUSIEREN ***
            const allVideos = document.querySelectorAll(".mein-grid--details video");
            allVideos.forEach(video => {
                video.pause();
                video.currentTime = 0;
            });
        });
    }
});