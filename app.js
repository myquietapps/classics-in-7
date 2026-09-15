document.addEventListener("DOMContentLoaded", () => {
    // 1. Zmienne globalne DOM dla sekcji About & Support
    const aboutPanel = document.getElementById("about-panel");
    const closeAboutBtn = document.getElementById("close-about");
    const menuToggleBtn = document.getElementById("menu-toggle");
    
    // Pola tekstowe w panelu Slide-over
    const aboutManifest = document.getElementById("about-manifest");
    const aboutAuthor = document.getElementById("about-author");
    const supportLink = document.getElementById("support-link");
    const feedbackLink = document.getElementById("feedback-link");
    const shareBtn = document.getElementById("share-btn");

    // 2. Pobieranie danych z bazy JSON
    fetch('app-content.json')
        .then(response => {
            if (!response.ok) throw new Error("Błąd podczas ładowania app-content.json");
            return response.json();
        })
        .then(data => {
            // Po udanym pobraniu, inicjalizujemy sekcje aplikacji
            initAboutSection(data.about_section);
            // Tutaj w przyszłości wywołamy initThemes(data.themes) oraz initUI(data.ui_strings)
        })
        .catch(error => console.error("Error:", error));

    // 3. Funkcja wstrzykująca dane do sekcji About & Support
    function initAboutSection(aboutData) {
        // Zwykłe .innerText zachowuje znaki nowej linii (\n) z naszego JSON-a
        aboutManifest.innerText = aboutData.manifest;
        aboutAuthor.innerText = aboutData.author_note;
        
        supportLink.innerText = aboutData.support_cta;
        supportLink.href = "https://www.buymeacoffee.com/"; // Wklej swój link wsparcia
        
        feedbackLink.innerText = aboutData.feedback_cta;
        feedbackLink.href = aboutData.feedback_url;
        
        shareBtn.innerText = aboutData.share_app_cta;

        // 4. Logika przycisku Share (kopiowanie do schowka)
        shareBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(aboutData.share_app_text)
                .then(() => {
                    // Elegancki feedback dla użytkownika
                    const originalText = shareBtn.innerText;
                    shareBtn.innerText = "✓ Copied to clipboard!";
                    shareBtn.style.backgroundColor = "#4A8F4A"; // Delikatna zieleń sukcesu
                    shareBtn.style.color = "#FFFFFF";
                    
                    // Powrót do oryginału po 2.5s
                    setTimeout(() => {
                        shareBtn.innerText = originalText;
                        shareBtn.style.backgroundColor = ""; // Powrót do koloru ze style.css
                        shareBtn.style.color = "";
                    }, 2500);
                })
                .catch(err => console.error("Clipboard copy failed: ", err));
        });
    }

    // 5. Obsługa interfejsu (Wysuwanie i chowanie panelu Slide-over)
    // Tymczasowo podpinamy testowe otwieranie panelu About pod przycisk Menu
    // Docelowo ten przycisk znajdzie się w rozwiniętym Menu Hamburgera
    menuToggleBtn.addEventListener("click", () => {
        aboutPanel.classList.remove("hidden");
    });

    closeAboutBtn.addEventListener("click", () => {
        aboutPanel.classList.add("hidden");
    });
});
