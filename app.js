// app.js - Główna logika aplikacji

let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadDailyContent();
    updateSavedCount();
});

// --- Obsługa Menu Hamburgerowego ---
function toggleMenu() {
    const menuOverlay = document.getElementById('menu-overlay');
    const openBtn = document.querySelector('.menu-open-btn');
    const body = document.body;

    if (!menuOverlay.classList.contains('show')) {
        menuOverlay.classList.add('show');
        if (openBtn) openBtn.classList.add('hidden');
        body.style.overflow = 'hidden';
    } else {
        menuOverlay.classList.remove('show');
        if (openBtn) openBtn.classList.remove('hidden');
        body.style.overflow = '';
    }
}

function navigateToMainView() { toggleMenu(); loadDailyContent(); }
function openSavedTracks() { toggleMenu(); alert('Saved Tracks under construction'); }
function clearAppData() { if(confirm('Clear all data?')) { localStorage.clear(); location.reload(); } toggleMenu(); }

// --- Sprawdzanie dzisiejszej daty (Case 1) ---
function loadDailyContent() {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en', { month: 'short' }); // np. "Sep"
    const dateKey = `${day}-${month}`; // np. "13-Sep"

    // Sprawdzamy, czy w bazie jest karta dla dzisiejszej daty
    if (typeof database !== 'undefined' && database[dateKey] && database[dateKey].type === "composer") {
        renderComposerView(database[dateKey], dateKey);
    } else {
        // CASE 1: Brak karty dla dzisiejszego dnia – ładujemy widok alternatywny
        renderCase1View();
    }
}

// --- Ładowanie konkretnej karty po kliknięciu (np. Debussy lub Chopin) ---
function loadCardByDate(dateKey) {
    if (typeof database !== 'undefined' && database[dateKey]) {
        renderComposerView(database[dateKey], dateKey);
    }
}

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

    const spotifyLink = document.getElementById('spotify-link');
    if (spotifyLink && data.spotifyUrl) {
        spotifyLink.href = data.spotifyUrl;
        spotifyLink.onclick = (e) => openSpotify(e, data.spotifyUrl);
    }

    const ytLink = document.getElementById('youtube-link');
    if (ytLink && data.youtubeQuery) {
        ytLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.youtubeQuery)}`;
    }
}

function renderCase1View() {
    const mainView = document.getElementById('track-main-view');
    const noComposerView = document.getElementById('no-composer-view');
    
    if (mainView) mainView.style.display = 'none';
    if (noComposerView) noComposerView.style.display = 'block';

    const factText = document.getElementById('nc-fact-text');
    const tag = document.getElementById('insight-category-tag');
    if (factText) factText.textContent = "Listening to classical piano music activates both hemispheres of the brain, significantly reducing stress.";
    if (tag) tag.textContent = "Science";

    // Ustawienie etykiet kart
    document.getElementById('nc-prev-date').textContent = "22-AUG";
    document.getElementById('nc-prev-name').textContent = "Claude Debussy";
    document.getElementById('nc-next-date').textContent = "1-MAR";
    document.getElementById('nc-next-name').textContent = "Frédéric Chopin";
}

// --- Integracja Spotify z modalem ---
function openSpotify(event, spotifyUrl) {
    event.preventDefault();
    window.open(spotifyUrl, '_blank');
    
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
            align-items: center; z-index: 20000; backdrop-filter: blur(4px);
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
