// app.js - Wersja zintegrowana z obsługą Spotify

let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

// Funkcje Menu
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

function navigateToMainView() { toggleMenu(); loadToday(); }
function openSavedTracks() { toggleMenu(); alert('Saved Tracks under construction'); }
function openMoodStats() { toggleMenu(); alert('Mood Stats under construction'); }
function openJumpToDate() { toggleMenu(); alert('Jump to Date under construction'); }
function openAppearance() { toggleMenu(); alert('Appearance under construction'); }
function resetDailyView() { toggleMenu(); loadToday(); }
function clearAppData() { if(confirm('Clear all data?')) { localStorage.clear(); location.reload(); } toggleMenu(); }
function openAbout() { toggleMenu(); alert('Classics in 7'); }

// --- Obsługa Spotify z komunikatem o braku aplikacji ---
function openSpotify(event, spotifyUrl) {
    event.preventDefault();
    
    // Próbujemy otworzyć link (co uruchomi aplikację Spotify, jeśli jest zainstalowana)
    window.open(spotifyUrl, '_blank');
    
    // Po chwili wyświetlamy okno z opcją pobrania aplikacji lub kontynuowania
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
// -----------------------------------------------------

// Funkcja startowa
function initApp() {
    const appContent = document.getElementById('app-content');
    if(appContent) {
        appContent.innerHTML = '<h1 style="text-align:center; font-size:24px; margin-top:20px;">Welcome to Classics in 7</h1><p style="text-align:center; margin-top:10px;">Click the menu icon (☰) to begin.</p>';
    }
    updateSavedCount();
}

function loadToday() {
    const appContent = document.getElementById('app-content');
    if(appContent) {
        appContent.innerHTML = '<h1 style="text-align:center; font-size:24px; margin-top:20px;">Daily Piece Loaded</h1><p style="text-align:center;">(Placeholder)</p>';
    }
}

function updateSavedCount() {
    const countSpan = document.getElementById('menu-saved-count');
    if(countSpan) countSpan.textContent = '(' + savedTracks.length + ')';
}

// Uruchomienie
document.addEventListener('DOMContentLoaded', initApp);
