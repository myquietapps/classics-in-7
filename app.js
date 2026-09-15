document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("muz-content.json");
        const data = await response.json();

        // Pobieranie daty według czasu lokalnego użytkownika
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
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
            wikiLinkEl.parentElement.style.display = "block";
        } else if (dayRecord.composer && dayRecord.composer.name) {
            wikiLinkEl.href = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(dayRecord.composer.name)}`;
            wikiLinkEl.parentElement.style.display = "block";
        } else {
            wikiLinkEl.parentElement.style.display = "none";
        }

        let currentTracks = [...dayRecord.tracks];
        const composerName = dayRecord.composer.name;

        function renderMainTrack(track) {
            document.getElementById("main-track-rank").textContent = `#1`;
            document.getElementById("main-track-title").textContent = track.title;
            document.getElementById("main-track-duration").textContent = track.duration || "";
            
            const moodsContainer = document.getElementById("main-track-moods");
            if (track.mood_tags && Array.isArray(track.mood_tags)) {
                moodsContainer.innerHTML = track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("");
            } else {
                moodsContainer.innerHTML = "";
            }

            document.getElementById("main-track-fact").innerHTML = `<strong>Classical Insight:</strong> ${track.fact}`;

            const searchQuery = encodeURIComponent(`${composerName} ${track.title}`);
            const spotifyLink = `https://open.spotify.com/search/${searchQuery}`;
            const appleMusicLink = `https://music.apple.com/us/search?term=${searchQuery}`;

            const actionsContainer = document.getElementById("main-track-actions");
            actionsContainer.innerHTML = `
                <a href="${spotifyLink}" target="_blank" class="btn-stream spotify">Spotify</a>
                <a href="${appleMusicLink}" target="_blank" class="btn-stream apple">Apple Music</a>
            `;
        }

        function renderDiscoverList() {
            const tracksContainer = document.getElementById("tracks-container");
            tracksContainer.innerHTML = "";

            const subTracks = currentTracks.slice(1);

            subTracks.forEach((track, index) => {
                const trackEl = document.createElement("div");
                trackEl.className = "track-card";

                const tagsHTML = track.mood_tags ? track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("") : "";

                // Usunięto linię z ciekawostką (track-fact) poniżej:
                trackEl.innerHTML = `
                    <div class="track-header">
                        <span class="track-rank">#${index + 2}</span>
                        <h3 class="track-title">${track.title}</h3>
                        <span class="track-duration">${track.duration || ""}</span>
                    </div>
                    <div class="mood-tags-container">
                        ${tagsHTML}
                    </div>
                `;

                trackEl.addEventListener("click", () => {
                    const originalIndex = currentTracks.findIndex(t => t.title === track.title);
                    
                    if (originalIndex !== -1) {
                        const selectedTrack = currentTracks.splice(originalIndex, 1)[0];
                        currentTracks.unshift(selectedTrack);

                        renderMainTrack(currentTracks[0]);
                        renderDiscoverList();

                        discoverContent.classList.remove("expanded");
                        discoverArrow.style.transform = "rotate(0deg)";
                    }
                });

                tracksContainer.appendChild(trackEl);
            });
        }

        if (currentTracks.length > 0) {
            renderMainTrack(currentTracks[0]);
            renderDiscoverList();
        }

        const discoverToggle = document.getElementById("discover-toggle");
        const discoverContent = document.getElementById("discover-content");
        const discoverArrow = document.getElementById("discover-arrow");

        discoverToggle.addEventListener("click", () => {
            const isExpanded = discoverContent.classList.toggle("expanded");
            discoverArrow.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
        });

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});
