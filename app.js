// app.js - Minimalna działająca wersja

let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

// Funkcje Menu
function toggleMenu() {
    const menuOverlay = document.getElementById('menu-overlay');
    const openBtn = document.querySelector('.menu-open-btn');
    const body = document.body;

    if (!menuOverlay.classList.contains('show')) {
        menuOverlay.classList.add('show');
        openBtn.classList.add('hidden');
        body.style.overflow = 'hidden';
    } else {
        menuOverlay.classList.remove('show');
        openBtn.classList.remove('hidden');
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

// Funkcja startowa
function initApp() {
    // Ładujemy cokolwiek do głównego widoku, żeby nie było pusto
    const appContent = document.getElementById('app-content');
    if(appContent) {
        appContent.innerHTML = '<h1 style="text-align:center; font-size:24px; margin-top:20px;">Welcome to Classics in 7</h1><p style="text-align:center; margin-top:10px;">Click the menu icon (☰) to begin.</p>';
    }
    updateSavedCount();
}

function loadToday() {
    // To jest funkcja tymczasowa, docelowo będzie tu selectTrack
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
