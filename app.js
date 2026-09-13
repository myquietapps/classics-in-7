// app.js - Kompletna wersja (Logika dat, baz danych i Spotify)

let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

// Główna funkcja inicjalizująca po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    loadDailyContent();
    updateSavedCount();
});

// Funkcja ładująca zawartość na podstawie dzisiejszej daty
function loadDailyContent() {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en', { month: 'short' }); // np. "Aug", "Mar"
    const dateKey = `${day}-${month}`; // np. "22-Aug"

    // Sprawdzamy database_1 (czy ktoś się urodził)
    // Przyjmujemy strukturę database_1 z Twojego projektu
    if (typeof database_1 !== 'undefined' && database_1[dateKey]) {
        const data = database_1[dateKey];
        renderComposerView(data, dateKey);
    } else {
        // Brak kompozytora - ładujemy database_2 (Insights)
        renderNoComposerView(dateKey);
    }
}

// Renderowanie widoku kompozytora
function renderComposerView(data, dateKey) {
    const mainView = document.getElementById('track-main-view');
    const noComposerView = document.getElementById('no-composer-view');
    
    if (mainView) mainView.style.display = 'block';
    if (noComposerView) noComposerView.style.display = 'none';

    document.getElementById('date-header').textContent = `BORN TODAY (${dateKey})`;
    document.getElementById('track-title').textContent = data.title || '';
    document.getElementById('track-composer').textContent = data.composer || '';
    document.getElementById('track-country').textContent = data.country || '';
    document.getElementById('track-duration').textContent = data.duration ? `(${data.duration})` : '';
    document.getElementById('track-mood').textContent = data.mood || '';
    document.getElementById('fact-text').textContent = data.fact || '';

    // Podpięcie Spotify z nową funkcją sprawdzającą aplikację
    const spotifyLink = document.getElementById('spotify-link');
    if (spotifyLink && data.spotifyUrl) {
        spotifyLink.href = data.spotifyUrl;
        spotifyLink.onclick = (e) => openSpotify(e, data.spotifyUrl);
    }

    // Podpięcie YouTube
    const ytLink = document.getElementById('youtube-link');
    if (ytLink && data.youtubeQuery) {
        ytLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.youtubeQuery)}`;
    }
}

// Renderowanie widoku alternatywnego (Brak kompozytora)
function renderNoComposerView(dateKey) {
    const mainView = document.getElementById('track-main-view');
    const noComposerView = document.getElementById('no-composer-view');
    
    if (mainView) mainView.style.display = 'none';
    if (noComposerView) noComposerView.style.display = 'block';

    // Pobieramy insight z database_2 jeśli istnieje
    if (typeof database_2 !== 'undefined' && database_2[dateKey]) {
        const insight = database_2[dateKey];
        const factText = document.getElementById('nc-fact-text');
        const tag = document.getElementById('insight-category-tag');
        if (factText) factText.textContent = insight.fact || '';
        if (tag) tag.textContent = insight.category || 'Science';
    }
}

// --- Obsługa Spotify z komunikatem o braku aplikacji ---
function openSpotify(event, spotifyUrl) {
    event.preventDefault();
    
    // Próbujemy otworzyć link (uruchomi aplikację Spotify, jeśli jest zainstalowana)
    window.open(spotifyUrl, '_blank');
    
    // Wyświetlamy okno z opcją pobrania aplikacji lub kontynuowania
    setTimeout(() => {
        showSpotifyPrompt(spotifyUrl);
    }, 500);
}

function showSpotifyPrompt(fallbackUrl) {
    let modal = document.getElementById('spotify-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'spotify-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; justify-content: center;
            align-items: center; z-index: 2000; backdrop-filter: blur(4px);
        `;
        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; max-width: 320px; text-align: center; color: white; font-family: sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <p style="margin-bottom: 20px; font-size: 15px; line-height: 1.4;">Works best with installed Spotify, would you like to install?</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="https://www.spotify.com/download/" target="_blank" style="background: #1DB954; color: black; padding: 10px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 14px;">Install Spotify</a>
                    <a href="${fallbackUrl}" target="_blank" style="background: rgba(255,255,255,0.1); color: white; padding: 10px; border-radius: 20px; text-decoration: none; font-size: 14px;" onclick="document.getElementById('spotify-modal').style.display='none'">Continue in Web Browser</a>
                    <button onclick="document.getElementById('spotify-modal').style.display='none'" style="background: none; border: none; color: #a0a0a0; cursor: pointer; margin-top: 5px; font-size: 13px;">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
}

function updateSavedCount() {
    const countSpan = document.getElementById('menu-saved-count');
    if(countSpan) countSpan.textContent = '(' + savedTracks.length + ')';
}

function toggleDiscover() {
    const list = document.getElementById('top5List');
    const arrow = document.getElementById('discover-arrow');
    if (list) {
        if (list.style.display === 'none' || list.style.display === '') {
            list.style.display = 'flex';
            if (arrow) arrow.textContent = '▼';
        } else {
            list.style.display = 'none';
            if (arrow) arrow.textContent = '▶';
        }
    }
}
