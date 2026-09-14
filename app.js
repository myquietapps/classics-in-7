document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("muz-content.json");
        const data = await response.json();

        const today = new Date();
        const month = String(today.getUTCMonth() + 1).padStart(2, '0');
        const day = String(today.getUTCDate()).padStart(2, '0');
        const currentDate = `${month}-${day}`;

        const dayRecord = data.find(item => item.date === currentDate) || data[0];

        document.getElementById("composer-name").textContent = dayRecord.composer.name;
        document.getElementById("composer-meta").textContent = `${dayRecord.composer.birth_year}–${dayRecord.composer.death_year} (${dayRecord.composer.period}) • ${dayRecord.composer.birth_country}`;
        
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

        const wikiLinkEl = document.getElementById("wiki-link");
        if (dayRecord.composer && dayRecord.composer.wiki_url) {
            wikiLinkEl.href = dayRecord.composer.wiki_url;
            wikiLinkEl.style.display = "block";
        } else if (dayRecord.composer && dayRecord.composer.name) {
            wikiLinkEl.href = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(dayRecord.composer.name)}`;
            wikiLinkEl.style.display = "block";
        } else {
            wikiLinkEl.style.display = "none";
        }

        const tracksContainer = document.getElementById("tracks-container");
        tracksContainer.innerHTML = "";

        dayRecord.tracks.forEach(track => {
            const trackEl = document.createElement("div");
            trackEl.className = "track-card";

            const tagsHTML = track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("");

            const rawQuery = `${dayRecord.composer.name} ${track.title}`;
            const spotifyLink = `https://open.spotify.com/search/${encodeURIComponent(rawQuery)}`;
            const appleMusicLink = `https://music.apple.com/us/search?term=${encodeURIComponent(rawQuery)}`;

            trackEl.innerHTML = `
                <div class="track-header">
                    <span class="track-rank">#${track.rank}</span>
                    <h3 class="track-title">${track.title}</h3>
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
trackEl.innerHTML = `
    <div class="track-header">
        <span class="track-rank">#${track.rank}</span>
        <h3 class="track-title">${track.title}</h3>
    </div>
    <div class="mood-tags-container">
        ${tagsHTML}
    </div>
    <p class="track-fact"><strong>Trivia:</strong> ${track.fact}</p>
    <div class="track-actions">
        <a href="${spotifyLink}" target="_blank" rel="noopener noreferrer" class="btn-stream spotify">Spotify</a>
        <a href="${appleMusicLink}" target="_blank" rel="noopener noreferrer" class="btn-stream apple">Apple Music</a>
    </div>
`;
