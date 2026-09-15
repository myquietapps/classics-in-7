document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

async function loadContent() {
    try {
        const response = await fetch('muz-content.json');
        if (!response.ok) {
            throw new Error('Nie udało się załadować bazy danych.');
        }
        const data = await response.json();
        
        // Renderujemy pierwszy element z bazy (lub dostosuj do swojej logiki wyboru dnia)
        renderComposer(data[0]);
    } catch (error) {
        console.error('Błąd:', error);
        const container = document.getElementById('tracks-container');
        if (container) {
            container.innerHTML = '<p>Nie udało się załadować utworu.</p>';
        }
    }
}

function renderComposer(item) {
    // Wyświetlanie nazwy kompozytora, jeśli element istnieje w HTML
    const nameEl = document.getElementById('composer-name');
    if (nameEl && item.composer) {
        nameEl.textContent = item.composer.name;
    }

    const container = document.getElementById('tracks-container');
    if (!container || !item.tracks) return;

    // Generowanie listy utworów
    container.innerHTML = item.tracks.map((track, index) => {
        const isFirst = index === 0;
        
        // Pierwszy utwór nie ma numeru, pozostałe dostają numer od #2 do #6
        const rankDisplay = isFirst ? '' : `<span class="track-rank">#${index + 1}</span>`;

        return `
            <div class="track-card ${isFirst ? 'main-track' : 'regular-track'}">
                <div class="track-header">
                    ${rankDisplay}
                    <h3 class="track-title">${track.title}</h3>
                    <span class="track-duration">${track.duration}</span>
                </div>
                <p class="track-fact">${track.fact}</p>
                <div class="track-tags">
                    ${track.mood_tags ? track.mood_tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        `;
    }).join('');
}
