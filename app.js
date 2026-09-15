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
