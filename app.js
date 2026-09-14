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

        // Wstrzykiwanie danych do głównego utworu (#1) w złotej ramce
        if (dayRecord.tracks && dayRecord.tracks.length > 0) {
            const primaryTrack = dayRecord.tracks[0];
            document.getElementById("track-title").textContent = primaryTrack.title;
            
            const moodEl = document.getElementById("track-mood");
            if (primaryTrack.mood_tags && primaryTrack.mood_tags.length > 0) {
                moodEl.textContent = primaryTrack.mood_tags[0];
                moodEl.style.display = "inline-block";
            } else {
                moodEl.style.display = "none";
            }

            document.getElementById("track-fact").innerHTML = `<strong>Trivia:</strong> ${primaryTrack.fact}`;
        }

        // Pozostałe utwory (jeśli występują w bazie)
        const tracksContainer = document.getElementById("tracks-container");
        tracksContainer.innerHTML = "";

        if (dayRecord.tracks && dayRecord.tracks.length > 1) {
            dayRecord.tracks.slice(1).forEach(track => {
                const trackEl = document.createElement("div");
                trackEl.className = "track-card";

                const tagsHTML = track.mood_tags ? track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("") : "";

                trackEl.innerHTML = `
                    <div class="track-header">
                        <span class="track-rank">#${track.rank}</span>
                        <h3 class="track-title">${track.title}</h3>
                    </div>
                    <div class="mood-tags-container">
                        ${tagsHTML}
                    </div>
                    <p class="track-fact"><strong>Trivia:</strong> ${track.fact}</p>
                `;

                tracksContainer.appendChild(trackEl);
            });
        }

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});
