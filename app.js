document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Pobranie bazy danych z pliku muz-content.json[cite: 1]
        const response = await fetch("muz-content.json");
        const data = await response.json();

        // 2. Określenie daty w formacie UTC (MM-DD) odpornej na zmiany stref czasowych użytkownika
        const today = new Date();
        const month = String(today.getUTCMonth() + 1).padStart(2, '0');
        const day = String(today.getUTCDate()).padStart(2, '0');
        const currentDate = `${month}-${day}`;

        // Szukamy wpisu dla dzisiejszego dnia, a w razie braku bierzemy pierwszy z brzegu jako fallback
        const dayRecord = data.find(item => item.date === currentDate) || data[0];

        // 3. Renderowanie danych kompozytora i nagłówka[cite: 1]
        document.getElementById("composer-name").textContent = dayRecord.composer.name;
        document.getElementById("composer-meta").textContent = `${dayRecord.composer.birth_year}–${dayRecord.composer.death_year} (${dayRecord.composer.period}) • ${dayRecord.composer.birth_country}`;
        
        // Obsługa typu kotwicy (Urodziny vs Historyczny Kamień Milowy)[cite: 1]
        const badgeEl = document.getElementById("anchor-badge");
        const eventNoteEl = document.getElementById("event-note");
        
        if (dayRecord.anchor_type === "premiere") {
            badgeEl.textContent = "HISTORICAL MILESTONE";
            if (eventNoteEl) {
                eventNoteEl.textContent = dayRecord.event_note;
                eventNoteEl.style.display = "block";
            }
        } else {
            badgeEl.textContent = "BORN TODAY";
            if (eventNoteEl) {
                eventNoteEl.style.display = "none";
            }
        }

        // 4. Renderowanie 6 utworów[cite: 1]
        const tracksContainer = document.getElementById("tracks-container");
        tracksContainer.innerHTML = ""; // Czyszczenie kontenera

        dayRecord.tracks.forEach(track => {
            const trackEl = document.createElement("div");
            trackEl.className = `track-card ${track.is_main_hit ? 'main-hit' : ''}`;

            // Generowanie tagów nastroju z zachowaniem flex-wrap[cite: 1]
            const tagsHTML = track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("");

            // Generowanie linków wyszukiwania (KEY 1 / KEY 2 deep-linking)[cite: 1]
            const searchQuery = encodeURIComponent(`${dayRecord.composer.name} ${track.title}`);
            const spotifyLink = `https://open.spotify.com/search/${searchQuery}`;
            const appleMusicLink = `https://music.apple.com/us/search?term=${searchQuery}`;

            trackEl.innerHTML = `
                <div class="track-header">
                    <span class="track-rank">#${track.rank}</span>
                    <h3 class="track-title">${track.title}</h3>
                    ${track.is_main_hit ? '<span class="hit-badge">MAIN HIT</span>' : ''}
                </div>
                <div class="mood-tags-container">
                    ${tagsHTML}
                </div>
                <p class="track-fact"><strong>Trivia:</strong> ${track.fact}</p>
                <div class="track-actions">
                    <a href="${spotifyLink}" target="_blank" class="btn-stream spotify">Spotify</a>
                    <a href="${appleMusicLink}" target="_blank" class="btn-stream apple">Apple Music</a>
                </div>
            `;

            tracksContainer.appendChild(trackEl);
        });

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});
