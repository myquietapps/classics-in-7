document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Obsługa menu zębatki w prawym górnym rogu ---
    const settingsBtn = document.getElementById('settings-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (settingsBtn && dropdownMenu) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Zamknięcie menu po kliknięciu w dowolne miejsce poza nim
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('active');
        });
    }

    // --- 2. Obsługa rozwijania sekcji "Discover More" ---
    const discoverToggle = document.getElementById('discover-toggle');
    const discoverContent = document.getElementById('discover-content');
    const discoverArrow = document.getElementById('discover-arrow');

    if (discoverToggle && discoverContent) {
        discoverToggle.addEventListener('click', () => {
            discoverContent.classList.toggle('expanded');
            if (discoverContent.classList.contains('expanded')) {
                discoverArrow.style.transform = 'rotate(180deg)';
            } else {
                discoverArrow.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- 3. Dane demonstracyjne (Mock Data) dla aplikacji ---
    const appData = {
        composer: "Fryderyk Chopin",
        anchorBadge: "Mistrz Fortepianu",
        meta: "1810 – 1849 • Polska / Francja",
        eventNote: "Wydarzenie specjalne: Rok Chopinowski",
        wikiUrl: "https://pl.wikipedia.org/wiki/Fryderyk_Chopin",
        
        mainTrack: {
            title: "Nokturn Es-dur op. 9 nr 2",
            duration: "4:35",
            moods: ["Nostalgiczny", "Romantyczny", "Spokojny"],
            fact: "Jeden z najbardziej rozpoznawalnych utworów fortepianowych na świecie, skomponowany, gdy Chopin miał zaledwie około 20 lat.",
            actions: ["Posłuchaj", "Nuty", "Analiza", "Ulubione"]
        },

        otherTracks: [
            {
                rank: "02",
                title: "Preludium Des-dur op. 28 nr 15 ('Deszczowe')",
                duration: "5:20",
                moods: ["Mroczny", "Refleksyjny"],
                fact: "Skomponowany podczas pobytu na Majorce w klasztorze w Valldemossie."
            },
            {
                rank: "03",
                title: "Polonez A-dur op. 40 nr 1 ('Wojskowa')",
                duration: "3:45",
                moods: ["Heroiczny", "Energetyczny"],
                fact: "Symbol polskiego patriotyzmu i potęgi brzmienia fortepianu."
            }
        ]
    };

    // --- 4. Wstrzykiwanie danych do interfejsu ---
    
    // Nagłówek kompozytora
    document.getElementById('anchor-badge').textContent = appData.anchorBadge;
    document.getElementById('composer-name').textContent = appData.composer;
    document.getElementById('composer-meta').textContent = appData.meta;
    
    const eventNoteEl = document.getElementById('event-note');
    if (appData.eventNote) {
        eventNoteEl.textContent = appData.eventNote;
        eventNoteEl.style.display = 'block';
    }

    // Główny utwór
    document.getElementById('main-track-title').textContent = appData.mainTrack.title;
    document.getElementById('main-track-duration').textContent = appData.mainTrack.duration;
    document.getElementById('main-track-fact').textContent = appData.mainTrack.fact;

    // Tagi nastrojów głównego utworu
    const mainMoodsContainer = document.getElementById('main-track-moods');
    mainMoodsContainer.innerHTML = appData.mainTrack.moods
        .map(mood => `<span class="mood-tag">${mood}</span>`)
        .join('');

    // Przyciski akcji głównego utworu
    appData.mainTrack.actions.forEach((action, index) => {
        const btn = document.getElementById(`btn-${index + 1}`);
        if (btn) {
            btn.textContent = action;
            btn.addEventListener('click', () => {
                console.log(`Wybrano akcję: ${action}`);
            });
        }
    });

    // Lista utworów w "Discover More"
    const tracksContainer = document.getElementById('tracks-container');
    if (tracksContainer) {
        tracksContainer.innerHTML = appData.otherTracks.map(track => `
            <div class="track-card">
                <div class="track-header">
                    <span class="track-rank">${track.rank}</span>
                    <h4 class="track-title">${track.title}</h4>
                    <div class="track-right-side">
                        <span class="track-duration">${track.duration}</span>
                    </div>
                </div>
                <div class="mood-tags-container">
                    ${track.moods.map(m => `<span class="mood-tag">${m}</span>`).join('')}
                </div>
                <p class="track-fact">${track.fact}</p>
            </div>
        `).join('');
    }

    // Link do Wikipedii
    const wikiLink = document.getElementById('wiki-link');
    if (wikiLink) {
        wikiLink.href = appData.wikiUrl;
    }
});
