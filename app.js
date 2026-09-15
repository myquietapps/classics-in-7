*Zintegrowano odczyt z pliku `core-content.json`[cite: 10], logikę dynamicznej zmiany widoku ustawień przez menu pod zębatką oraz obsługę przycisków Save i Share.*

```javascript
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Ładowanie zawartości treści oraz konfiguracji tekstu z core-content.json
        const [muzResponse, coreResponse] = await Promise.all([
            fetch("muz-content_4.json"),
            fetch("core-content.json")
        ]);
        
        const data = await muzResponse.json();
        const coreData = await coreResponse.json();

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

        // Inicjalizuj ustawienia odtwarzacza
        initPlayerSettings(coreData);

        function executeButtonAction(actionType, track) {
            const container = document.getElementById("player-container");
            const searchQuery = encodeURIComponent(`${composerName} ${track.title}`);

            if (!container) return;

            switch (actionType) {
                case "yt-embed":
                    if (track.youtube_id) {
                        container.innerHTML = `<iframe width="100%" height="180" src="https://www.youtube-nocookie.com/embed/${track.youtube_id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                    } else {
                        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                    }
                    break;
                case "spotify-embed":
                    if (track.isrc) {
                        container.innerHTML = `<iframe src="https://open.spotify.com/embed/track?isrc=${track.isrc}&theme=0" width="100%" height="80" frameborder="0" allow="encrypted-media"></iframe>`;
                    } else {
                        window.open(`https://open.spotify.com/search/${searchQuery}`, '_blank');
                    }
                    break;
                case "yt-search":
                    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                    break;
                case "spotify-search":
                    window.open(`https://open.spotify.com/search/${searchQuery}`, '_blank');
                    break;
            }
        }

        function getButtonLabel(actionType) {
            const labels = {
                "yt-embed": "▶ YouTube Player",
                "spotify-embed": "▶ Spotify Player",
                "yt-search": "🔍 Search on YT",
                "spotify-search": "🔍 Search on Spotify"
            };
            return labels[actionType] || "Play";
        }

        function setupTrackButtons(track) {
            const btn1 = document.getElementById("btn-1");
            const btn2 = document.getElementById("btn-2");
            const btn3 = document.getElementById("btn-3");
            const btn4 = document.getElementById("btn-4");

            if (!btn1 || !btn2) return;

            const action1 = localStorage.getItem("btn1Action") || "yt-embed";
            const action2 = localStorage.getItem("btn2Action") || "spotify-embed";

            btn1.textContent = getButtonLabel(action1);
            btn1.onclick = () => executeButtonAction(action1, track);

            btn2.textContent = getButtonLabel(action2);
            btn2.onclick = () => executeButtonAction(action2, track);

            // Przycisk 3: Save (Ulubione)
            if (btn3) {
                btn3.textContent = coreData.player_settings?.save_label || "Save";
                btn3.onclick = () => {
                    let saved = JSON.parse(localStorage.getItem("savedTracks") || "[]");
                    saved.push(track);
                    localStorage.setItem("savedTracks", JSON.stringify(saved));
                    alert(coreData.player_settings?.saved_track_alert || "Track saved to favorites!");
                };
            }

            // Przycisk 4: Share (Udostępnianie)
            if (btn4) {
                btn4.textContent = coreData.player_settings?.share_label || "Share";
                btn4.onclick = () => {
                    if (navigator.share) {
                        navigator.share({ title: track.title, url: window.location.href });
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert(coreData.player_settings?.share_copied_alert || "Link copied to clipboard!");
                    }
                };
            }
        }

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

            // Reset kontenera odtwarzacza przy zmianie utworu i podpięcie akcji
            document.getElementById("player-container").innerHTML = "";
            setupTrackButtons(track);
        }

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

        document.addEventListener("click", (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
                settingsMenu.classList.remove("expanded");
                settingsBtn.classList.remove("active");
            }
        });

        // Obsługa przełączania widoków z menu pod zębatką
        document.querySelectorAll(".menu-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const target = item.getAttribute("data-target");
                settingsMenu.classList.remove("expanded");
                settingsBtn.classList.remove("active");

                if (target === "settings-player") {
                    document.getElementById("main-app-view").classList.add("hidden");
                    document.getElementById("settings-player-view").classList.remove("hidden");
                }
            });
        });

        // Przycisk powrotu z ustawień
        const backBtn = document.getElementById("btn-back-settings");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                document.getElementById("settings-player-view").classList.add("hidden");
                document.getElementById("main-app-view").classList.remove("hidden");
            });
        }

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});

// Konfiguracja i zapis ustawień odtwarzacza z core-content.json
function initPlayerSettings(coreData) {
    const pConfig = coreData.player_settings;
    if (!pConfig) return;

    document.getElementById("settings-view-title").textContent = pConfig.title;
    document.getElementById("label-select-1").textContent = pConfig.btn1_label;
    document.getElementById("label-select-2").textContent = pConfig.btn2_label;

    const select1 = document.getElementById("select-btn-1");
    const select2 = document.getElementById("select-btn-2");
    const saveBtn = document.getElementById("save-player-settings");

    if (!select1 || !select2 || !saveBtn) return;

    const optionsHtml = Object.entries(pConfig.options)
        .map(([val, text]) => `<option value="${val}">${text}</option>`)
        .join("");

    select1.innerHTML = optionsHtml;
    select2.innerHTML = optionsHtml;

    select1.value = localStorage.getItem("btn1Action") || "yt-embed";
    select2.value = localStorage.getItem("btn2Action") || "spotify-embed";

    saveBtn.textContent = pConfig.save_btn;
    saveBtn.onclick = () => {
        localStorage.setItem("btn1Action", select1.value);
        localStorage.setItem("btn2Action", select2.value);
        alert(pConfig.saved_alert);
    };
}
