document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("muz-content.json");
        const data = await response.json();

        const today = new Date();
        const month = String(today.getUTCMonth() + 1).padStart(2, '0');
        const day = String(today.getUTCDate()).padStart(2, '0');
        const currentDate = `${month}-${day}`;

        const dayRecord = data.find(item => item.date === currentDate);

        if (dayRecord) {
            // Pokazujemy widok z kompozytorem, ukrywamy widok alternatywny
            document.getElementById("track-main-view").style.display = "block";
            document.getElementById("no-composer-view").style.display = "none";

            const primaryTrack = dayRecord.tracks[0] || {};

            document.getElementById("track-title").textContent = `♪ ${primaryTrack.title || 'Classical Masterpiece'}`;
            document.getElementById("track-composer").textContent = dayRecord.composer.name;
            document.getElementById("track-country").textContent = `[${dayRecord.composer.birth_country ? dayRecord.composer.birth_country.substring(0,2).toUpperCase() : 'EU'}]`;
            document.getElementById("track-duration").textContent = "(4:30)";
            
            const moodEl = document.getElementById("track-mood");
            if (primaryTrack.mood_tags && primaryTrack.mood_tags.length > 0) {
                moodEl.textContent = primaryTrack.mood_tags[0];
                moodEl.style.display = "inline-block";
            } else {
                moodEl.style.display = "none";
            }

            document.getElementById("fact-text").textContent = primaryTrack.fact || dayRecord.event_note || "Classic compositions deeply influence focus and relaxation.";

            // Poprawne bindowanie linku do Spotify przez ID (działa stabilnie na mobile i desktop)
            const searchQuery = `${dayRecord.composer.name} ${primaryTrack.title || ''}`;
            const spotifyLinkEl = document.getElementById("spotify-link");
            spotifyLinkEl.href = `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`;

            const youtubeLinkEl = document.getElementById("youtube-link");
            youtubeLinkEl.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

            // Obsługa rozwijanej listy Discover More (jeśli istnieje w bazie)
            const discoverCard = document.getElementById("discoverCard");
            const top5List = document.getElementById("top5List");
            const discoverHeader = discoverCard.querySelector(".discover-header");
            
            if (dayRecord.tracks.length > 1) {
                discoverCard.style.display = "block";
                top5List.innerHTML = "";
                dayRecord.tracks.forEach(t => {
                    const item = document.createElement("div");
                    item.style.cssText = "padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px;";
                    item.innerHTML = `<strong>#${t.rank}</strong> ${t.title}`;
                    top5List.appendChild(item);
                });

                discoverHeader.onclick = () => {
                    const isVisible = top5List.style.display === "flex";
                    top5List.style.display = isVisible ? "none" : "flex";
                    document.getElementById("discover-arrow").textContent = isVisible ? "▶" : "▼";
                };
            } else {
                discoverCard.style.display = "none";
            }

        } else {
            // Widok alternatywny (brak danych na dzisiaj)
            document.getElementById("track-main-view").style.display = "none";
            document.getElementById("no-composer-view").style.display = "block";
            
            // Przykładowe statyczne wypełnienie nawigacji wstecz/w przód
            document.getElementById("nc-prev-date").textContent = "13-Sep";
            document.getElementById("nc-prev-name").textContent = "Claudio Monteverdi";
            document.getElementById("nc-next-date").textContent = "15-Sep";
            document.getElementById("nc-next-name").textContent = "Johannes Brahms";
            document.getElementById("nc-fact-text").textContent = "Listening to classical masterpieces activates both hemispheres of the brain, significantly reducing daily stress levels.";
        }

    } catch (error) {
        console.error("Error loading Classics in 7 content:", error);
    }
});
