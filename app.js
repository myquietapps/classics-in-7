document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

async function loadContent() {
    try {
        const response = await fetch('muz-content.json');
        if (!response.ok) {
            throw new Error('Błąd pobierania bazy danych');
        }
        const data = await response.json();
        
        // Pobieramy np. pierwszy wpis z bazy (lub wg Twojej logiki daty)
        renderComposer(data[0]);
    } catch (error) {
        console.error('Błąd:', error);
    }
}

function renderComposer(item) {
    // 1. Wyświetlenie nazwy kompozytora
    const nameEl = document.getElementById('composer-name');
    if (nameEl && item.composer) {
        nameEl.textContent = item.composer.name;
    }

    if (!item.tracks || item.tracks.length === 0) return;

    // 2. PIERWSZY UTWÓR (Główna sekcja pod nazwiskiem) - BEZ NUMERU #1
    const mainTrack = item.tracks[0];
    const mainContainer = document.getElementById('main-track-container'); // Dostosuj ID do swojego HTML jeśli jest inne
    
    if (mainContainer) {
        mainContainer.innerHTML = `
            <div class="main-track-card">
                <h3 class="track-title">${mainTrack.title}</h3>
                <p class="track-duration">${mainTrack.duration || ''}</p>
                <p class="track-fact">${mainTrack.fact}</p>
                <div class="track-tags">
                    ${mainTrack.mood_tags ? mainTrack.mood_tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        `;
    }

    // 3. POZOSTAŁE UTWORY (#2 do #6) - z numeracją
    const listContainer = document.getElementById('tracks-container');
    if (listContainer) {
        // Bierze utwory od indeksu 1 do końca (czyli 5 kolejnych utworów)
        const otherTracks = item.tracks.slice(1);

        listContainer.innerHTML = otherTracks.map((track, index) => {
            // index 0 w 'otherTracks' to w bazie indeks 1, czyli utwór #2
            const trackNumber = index + 2; 

            return `
                <div class="track-card regular-track">
                    <span class="track-rank">#${trackNumber}</span>
                    <div class="track-content">
                        <div class="track-header">
                            <h3 class="track-title">${track.title}</h3>
                            <span class="track-duration">${track.duration || ''}</span>
                        </div>
                        <p class="track-fact">${track.fact}</p>
                        <div class="track-tags">
                            ${track.mood_tags ? track.mood_tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}
