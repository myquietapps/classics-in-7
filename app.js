let currentComposerId = null;
let currentTrackId = null;
let currentInsightId = null;

let userMoodPreferences = JSON.parse(localStorage.getItem('userMoodPreferences')) || {
    "#Melancholic": 2, "#Relaxing": 2, "#Dreamy": 1, "#Romantic": 2, "#Passionate": 1, "#Dynamic": 1, "#Graceful": 1, "#Grand": 1
};

let userInsightPreferences = JSON.parse(localStorage.getItem('userInsightPreferences')) || {
    "History": 1, "Science": 1, "Instruments": 1, "Pop Culture": 1, "Theory": 1
};

let lastVotedTrackId = null;
let lastVotedInsightId = null;

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

    document.getElementById('youtube-link').href = `https://www.youtube.com/results?search_query=${encodeURIComponent(track.youtubeQuery)}`;

    let selectedFact = composer.facts[track.mood] || "Great classical masterpiece.";
    document.getElementById('fact-text').textContent = selectedFact;

    resetVoteUI('track-vote-up');
    resetVoteUI('track-vote-down');

    document.getElementById('top5List').style.display = 'none';
    document.getElementById('discover-arrow').textContent = '▶';
}

function openSpotify(event) {
    event.preventDefault();
    const composer = composersDatabase.find(c => c.id === currentComposerId);
    if (!composer) return;
    const track = composer.tracks.find(t => t.id === currentTrackId);
    if (!track) return;

    const appUrl = `spotify:search:${encodeURIComponent(track.spotifyQuery)}`;
    const webUrl = `https://open.spotify.com/search/${encodeURIComponent(track.spotifyQuery)}`;
    window.location.href = appUrl;

    let triggered = false;
    const blurListener = () => { triggered = true; };
    window.addEventListener('blur', blurListener, { once: true });

    setTimeout(() => {
        window.removeEventListener('blur', blurListener);
        if (!triggered) {
            if (confirm("Open web player instead?")) {
                window.open(webUrl, '_blank');
            }
        }
    }, 1500);
}

function voteTrack(isUp) {
    if (lastVotedTrackId === currentTrackId) return;
    const composer = composersDatabase.find(c => c.id === currentComposerId);
    if (!composer) return;
    const track = composer.tracks.find(t => t.id === currentTrackId);
    if (!track) return;

    resetVoteUI('track-vote-up');
    resetVoteUI('track-vote-down');

    if (isUp) {
        userMoodPreferences[track.mood] = (userMoodPreferences[track.mood] || 0) + 2;
        document.querySelector('.track-vote-up').classList.add('active');
    } else {
        userMoodPreferences[track.mood] = Math.max(0, (userMoodPreferences[track.mood] || 0) - 1);
        document.querySelector('.track-vote-down').classList.add('active');
    }
    localStorage.setItem('userMoodPreferences', JSON.stringify(userMoodPreferences));
    lastVotedTrackId = currentTrackId;
}

function voteInsight(isUp) {
    if (lastVotedInsightId === currentInsightId) return;
    const insight = classicalInsights.find(i => i.id === currentInsightId);
    if (!insight) return;

    resetVoteUI('insight-vote-up');
    resetVoteUI('insight-vote-down');

    if (isUp) {
        userInsightPreferences[insight.category] = (userInsightPreferences[insight.category] || 0) + 2;
        document.querySelector('.insight-vote-up').classList.add('active');
    } else {
        userInsightPreferences[insight.category] = Math.max(0, (userInsightPreferences[insight.category] || 0) - 1);
        document.querySelector('.insight-vote-down').classList.add('active');
    }
    localStorage.setItem('userInsightPreferences', JSON.stringify(userInsightPreferences));
    lastVotedInsightId = currentInsightId;
}

function saveForLater() {
    let savedTracks = JSON.parse(localStorage.getItem('savedTracks')) || [];
    let saveKey = `${currentComposerId}-${currentTrackId}`;
    if (!savedTracks.includes(saveKey)) {
        savedTracks.push(saveKey);
        localStorage.setItem('savedTracks', JSON.stringify(savedTracks));
        showToast('Saved for later');
    } else {
        showToast('Already saved');
    }
}

function updateDiscoverList() {
    const listContainer = document.getElementById('top5List');
    listContainer.innerHTML = '';

    const composer = composersDatabase.find(c => c.id === currentComposerId);
    if (!composer) return;

    let availableTracks = composer.tracks.filter(t => t.id !== currentTrackId);
    availableTracks.forEach(track => {
        let score = userMoodPreferences[track.mood] || 0;
        track.matchScore = score;
    });

    availableTracks.sort((a, b) => b.matchScore - a.matchScore);

    availableTracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'top5-item';
        item.style.padding = '8px 0';
        item.style.cursor = 'pointer';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        item.onclick = () => selectTrack(composer.id, track.id);
        item.innerHTML = `
            <div style="font-weight: 600; font-size: 14px;">${index + 1}. ${track.title}</div>
            <div style="font-size: 12px; opacity: 0.7; display: flex; justify-content: space-between; margin-top: 2px;">
                <span>${track.duration}</span>
                <span>${track.mood}</span>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function loadForDate(dateObj, pushHistory = true) {
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const targetStr = `${month}-${day}`;

    let todaysComposer = composersDatabase.find(c => c.birthDate === targetStr);
    const mainView = document.getElementById('track-main-view');
    const noComposerView = document.getElementById('no-composer-view');

    if (todaysComposer) {
        selectTrack(todaysComposer.id, todaysComposer.tracks[0].id, pushHistory);
    } else {
        mainView.style.display = 'none';
        noComposerView.style.display = 'block';

        if (pushHistory) {
            history.pushState({ view: 'nocomposer', date: targetStr }, "", `#date-${targetStr}`);
        }

        const insightIndex = (dateObj.getDate() + dateObj.getMonth()) % classicalInsights.length;
        const activeInsight = classicalInsights[insightIndex];
        currentInsightId = activeInsight.id;

        document.getElementById('nc-fact-text').textContent = activeInsight.text;
        document.getElementById('insight-category-tag').textContent = activeInsight.category;

        resetVoteUI('insight-vote-up');
        resetVoteUI('insight-vote-down');

        const uniqueDates = [...new Set(composersDatabase.map(c => c.birthDate))].sort();
        let prevDate = uniqueDates.slice().reverse().find(d => d < targetStr) || uniqueDates[uniqueDates.length - 1];
        let nextDate = uniqueDates.find(d => d > targetStr) || uniqueDates[0];

        const prevComposer = composersDatabase.find(c => c.birthDate === prevDate);
        const nextComposer = composersDatabase.find(c => c.birthDate === nextDate);

        document.getElementById('nc-prev-date').textContent = formatDateDDMMM(prevDate);
        document.getElementById('nc-prev-name').textContent = prevComposer.composer;

        document.getElementById('nc-prev-card').onclick = (e) => {
            e.preventDefault();
            selectTrack(prevComposer.id, prevComposer.tracks[0].id, true);
        };

        document.getElementById('nc-next-date').textContent = formatDateDDMMM(nextDate);
        document.getElementById('nc-next-name').textContent = nextComposer.composer;

        document.getElementById('nc-next-card').onclick = (e) => {
            e.preventDefault();
            selectTrack(nextComposer.id, nextComposer.tracks[0].id, true);
        };
    }
}

window.addEventListener('popstate', (event) => {
    if (event.state) {
        if (event.state.view === 'composer') {
            selectTrack(event.state.composerId, event.state.trackId, false);
        } else if (event.state.view === 'nocomposer') {
            loadForDate(new Date(), false);
        }
    } else {
        loadForDate(new Date(), false);
    }
});

function initApp() {
    loadForDate(new Date(), true);
}

initApp();
