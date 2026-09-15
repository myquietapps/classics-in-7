// app.js - Główna logika aplikacji

document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

async function loadContent() {
    try {
        const response = await muz-content.json(); // Jeśli ładujesz przez fetch: await fetch('muz-content.json')
        // Uwaga: Jeśli ładujesz przez fetch, użyj poniższej linii:
        // const response = await fetch('muz-content.json');
        // const data = await response.json();
        
        // Poniższe założenie zakłada standardowe pobieranie fetch (odkomentuj linię wyżej jeśli tak masz):
        const res = await fetch('muz-content.json');
        const data = await res.json();

        // Przykładowo renderujemy pierwszy wpis z bazy lub dopasowujemy po dacie
        renderComposer(data[0]);
    } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
    }
}

function renderComposer(item) {
    // Wyświetlanie danych kompozytora (jeśli masz takie elementy w HTML)
    const nameEl = document.getElementById('composer-name');
    if (nameEl) nameEl.textContent = item.composer.name;

    const container = document.getElementById('tracks-container');
    if (!container) return;

    // Generowanie listy utworów
    container.innerHTML = item.tracks.map((track, index) => {
        const isFirst = index === 0;
        
        // Pierwszy utwór nie ma numeru, pozostałe mają od #2 do #6
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
                    ${track.mood_tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}
