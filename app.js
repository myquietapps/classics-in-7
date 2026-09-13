// app.js - Main Logic

// Zmienne stanu aplikacji
let currentComposerId = null;
let currentTrackId = null;
let currentInsightId = null;

// Ładowanie preferencji użytkownika lub wartości domyślne (z database_3.js)
let userMoodPreferences = JSON.parse(localStorage.getItem('userMoodPreferences')) || {
    "#Relaxing": 2, "#Dreamy": 1, "#Romantic": 2, "#Melancholic": 2, 
    "#Passionate": 1, "#Dynamic": 1, "#Graceful": 1, "#Grand": 1
};

let userInsightPreferences = JSON.parse(localStorage.getItem('userInsightPreferences')) || {
    "History": 1, "Science": 1, "Instruments": 1, "Pop Culture": 1, "Theory": 1
};

let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];

let lastVotedTrackId = null;
let lastVotedInsightId = null;

// --- ☰ LOGIKA MENU HAMBURGERA ---

function toggleMenu() {
    const menuOverlay = document.getElementById('menu-overlay');
    const openBtn = document.querySelector('.menu-open-btn');
    const body = document.body;

    const isMenuVisible = menuOverlay.classList.contains('show');

    if (!isMenuVisible) {
        menuOverlay.classList.add('show');
        openBtn.classList.add('hidden'); // Ukryj hamburgera
        body.style.overflow = 'hidden'; // Zablokuj scroll strony
    } else {
        menuOverlay.classList.remove('show');
        openBtn.classList.remove('hidden'); // Pokaż hamburgera
        body.style.overflow = ''; // Odblokuj scroll
    }
}

// Funkcje nawigacji z menu (na razie proste alerty, development)
function navigateToMainView() {
    toggleMenu();
    // Wróć do dzisiejszego dnia
    loadForDate(new Date(), true); 
}

function openSavedTracks() {
    toggleMenu();
    alert("Saved Tracks view is under construction.");
}

function openMoodStats() {
    toggleMenu();
    alert("Mood Stats view is under construction.\nTotal defined moods: " + allAvailableMoods.length);
}

function openJumpToDate() {
    toggleMenu();
    const todayStr = formatDateForInput(new Date());
    const selectedDate = prompt("Enter date (YYYY-MM-DD):", todayStr);
    
    if (selectedDate) {
        let dateObj = new Date(selectedDate);
        if (!isNaN(dateObj.getTime())) {
            loadForDate(dateObj, true);
        } else {
            alert("Invalid date format.");
        }
    }
}

// Nowa funkcja dla punktu 5
function openAppearance() {
    toggleMenu();
    alert("Appearance settings (Dark/Light mode) coming soon.");
}

function resetDailyView() {
    toggleMenu();
    loadForDate(new Date(), true);
}

function clearAppData() {
    if(confirm("Are you sure you want to clear all saved data, stats, and preferences?")) {
        localStorage.clear();
        location.reload();
    }
    toggleMenu();
}

function openAbout() {
    toggleMenu();
    alert("Classics in 7 v2.0 \nYour daily dose of classical music.\nBuilt for exploration.");
}

// --- Funkcja pomocnicza do daty ---
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// --- KONIEC LOGIKI MENU ---


// --- Funkcje główne aplikacji (bez zmian) ---

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1800);
}

function formatDateDDMMM(dateStr) {
    const [month, day] = dateStr.split('-');
    const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthsNames[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)}-${monthName}`;
}

function toggleDiscover() {
    const list = document.getElementById('top5List');
    const arrow = document.getElementById('discover-arrow');
    
    const currentDisplay = window.getComputedStyle(list).display;
    
    if (currentDisplay === 'flex' && list.style.display === 'flex') {
        list.style.display = 'none';
        arrow.textContent = '▶';
    } else {
        updateDiscoverList();
        list.style.display = 'flex';
        arrow.textContent = '▼';
    }
}

function resetVoteUI(type) {
    const btns = document.querySelectorAll(`.${type}`);
    btns.forEach(b => b.classList.remove('active'));
}

function updateSaveBtnState() {
    const saveBtn = document.querySelector('.save-btn');
    if (!saveBtn) return;
    let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];
    let saveKey = `${currentComposerId}-${currentTrackId}`;
    if (savedTracks.includes(saveKey)) {
        saveBtn.textContent = "Saved";
        saveBtn.classList.add('is-saved');
    } else {
        saveBtn.textContent = "Later";
        saveBtn.classList.remove('is-saved');
    }
}

function selectTrack(composerId, trackId, pushHistory = true) {
    const composer = composersDatabase.find(c => c.id === composerId);
    if (!composer) return;
    const track = composer.tracks.find(t => t.id === trackId);
    if (!track) return;

    currentComposerId = composer.id;
    currentTrackId = track.id;

    document.getElementById('track-main-view').style.display = 'block';
    document.getElementById('no-composer-view').style.display = 'none';

    if (pushHistory) {
        history.pushState({ view: 'composer', composerId: composerId, trackId: trackId }, "", `#composer-${composerId}`);
    }

    document.getElementById('track-title').textContent = "♪ " + track.title;
    document.getElementById('track-composer').textContent = composer.composer;
    document.getElementById('track-country').textContent = composer.country;
    document.getElementById('track-duration').textContent = track.duration;
    
    document.getElementById('track-mood').textContent = track.mood;
    document.getElementById('youtube-link').href = `
