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

        // Kopia utworów do lokalnej manipulacji przy podmianie
        let currentTracks = [...dayRecord.tracks];
        const composerName = dayRecord.composer.name;

        // Funkcja renderująca główny utwór na podstawie obiektu utworu
        function renderMainTrack(track) {
            document.getElementById("main-track-rank").textContent = `#${track.rank}`;
            document.getElementById("main-track-title").textContent = track.title;
            
            const moodsContainer = document.getElementById("main-track-moods");
            moodsContainer.innerHTML = track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("");

            document.getElementById("main-track-fact").innerHTML = `<strong>Trivia:</strong> ${track.fact}`;

            const searchQuery = encodeURIComponent(`${composerName} ${track.title}`);
            const spotifyLink = `https://open.spotify.com/search/${searchQuery}`;
            const appleMusicLink = `https://music.apple.com/us/search?term=${searchQuery}`;

            const actionsContainer = document.getElementById("main-track-actions");
            actionsContainer.innerHTML = `
                <a href="${spotifyLink}" target="_blank" class="btn-stream spotify">Spotify</a>
                <a href="${appleMusicLink}" target="_blank" class="btn-stream apple">Apple Music</a>
            `;
        }

        // Funkcja renderująca listę w sekcji "Discover More" (pozostałe utwory)
        function renderDiscoverList() {
            const tracksContainer = document.getElementById("tracks-container");
            tracksContainer.innerHTML = "";

            // Wszystkie utwory oprócz aktualnie głównego (indeks 0 w currentTracks)
            const subTracks = currentTracks.slice(1);

            subTracks.forEach((track) => {
                const trackEl = document.createElement("div");
                trackEl.className = "track-card";

                const tagsHTML = track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("");

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

                // Mechanika podmiany po kliknięciu w utwór z listy
                trackEl.addEventListener("click", () => {
                    // Znajdź indeks klikniętego utworu w pełnej tablicy
                    const clickedIndex = currentTracks.findIndex(t => t.rank === track.rank);
                    
                    if (clickedIndex !== -1) {
                        // Przesuń kliknięty utwór na pierwszą pozycję
                        const selectedTrack = currentTracks.splice(clickedIndex, 1)[0];
                        currentTracks.unshift(selectedTrack);

                        // Odśwież widoki
                        renderMainTrack(currentTracks[0]);
                        renderDiscoverList();

                        // Automatyczne zwinięcie listy (zamknięcie akordeonu)
                        discoverContent.classList.remove("expanded");
                        discoverArrow.style.transform = "rotate(0deg)";
                    }
                });

                tracksContainer.appendChild(trackEl);
            });
        }

        // Inicjalizacja stanu początkowego (główny to pierwszy z tablicy)
        if (currentTracks.length > 0) {
            renderMainTrack(currentTracks[0]);
            renderDiscoverList();
        }

        // Obsługa akordeonu "DISCOVER MORE"
        const discoverToggle = document.getElementById("discover-toggle");
        const discoverContent = document.getElementById("discover-content");
        const discoverArrow = document.getElementById("discover-arrow");

        discoverToggle.addEventListener("click", () => {
            const isExpanded = discoverContent.classList.toggle("expanded");
            discoverArrow.style.transform = isExpanded ? "rotate(90deg)" : "rotate(0deg)";
        });

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});
