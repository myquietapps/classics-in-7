document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("muz-content.json");
        const data = await response.json();

        // Pobieranie daty według czasu lokalnego użytkownika
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const currentDate = `${day}-${month}`;

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
            window.currentTrackSearchQuery = searchQuery;
        }

        // Obsługa kliknięć dla przycisków 2x2
        document.getElementById("btn-1").addEventListener("click", () => {
            console.log("Kliknięto Button 1 dla utworu:", currentTracks[0]?.title);
        });

        document.getElementById("btn-2").addEventListener("click", () => {
            console.log("Kliknięto Button 2 dla utworu:", currentTracks[0]?.title);
        });

        document.getElementById("btn-3").addEventListener("click", () => {
            console.log("Kliknięto Button 3 dla utworu:", currentTracks[0]?.title);
        });

        document.getElementById("btn-4").addEventListener("click", () => {
            console.log("Kliknięto Button 4 dla utworu:", currentTracks[0]?.title);
        });

        function renderDiscoverList() {
            const tracksContainer = document.getElementById("tracks-container");
            tracksContainer.innerHTML = "";

            const subTracks = currentTracks.slice(1);

            subTracks.forEach((track, index) => {
                const trackEl = document.createElement("div");
                trackEl.className = "track-card";

                const tagsHTML = track.mood_tags ? track.mood_tags.map(tag => `<span class="mood-tag">${tag}</span>`).join("") : "";

                trackEl.innerHTML = `
                    <div class="track-header">
                        <span class="track-rank">#${index + 2}</span>
                        <h3 class="track-title">${track.title}</h3>
                        <div class="track-right-side">
                            <div class="mood-tags-container-right">
                                ${tagsHTML}
                            </div>
                            <span class="track-duration">${track.duration || ""}</span>
                        </div>
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

        // Obsługa rozwijania sekcji Discover More
        const discoverToggle = document.getElementById("discover-toggle");
        const discoverContent = document.getElementById("discover-content");
        const discoverArrow = document.getElementById("discover-arrow");

        discoverToggle.addEventListener("click", () => {
            const isExpanded = discoverContent.classList.toggle("expanded");
            discoverArrow.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
        });

        // Obsługa menu pod zębatką w prawym górnym rogu
        const settingsBtn = document.getElementById("settings-btn");
        const settingsMenu = document.getElementById("settings-menu");

        settingsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle("expanded");
            settingsBtn.classList.toggle("active");
        });

        // Zamknięcie menu po kliknięciu gdziekolwiek indziej na stronie
        document.addEventListener("click", (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
                settingsMenu.classList.remove("expanded");
                settingsBtn.classList.remove("active");
            }
        });

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});
