document.addEventListener('DOMContentLoaded', () => {
    // --- Inicjalizacja UI ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menu = document.getElementById('hamburger-menu');
    const backdrop = document.getElementById('drawer-backdrop');
    const menuLinks = document.querySelectorAll('.menu-list a');
    const views = document.querySelectorAll('.view-section');

    // Obsługa menu
    function toggleMenu() {
        menu.classList.toggle('hidden');
        backdrop.classList.toggle('hidden');
    }
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', toggleMenu);

    // Przełączanie widoków
    function switchView(targetViewId) {
        views.forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${targetViewId}`).classList.add('active');
        menuLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-view') === targetViewId));
        window.scrollTo(0, 0);
    }
    menuLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(link.getAttribute('data-view'));
        if (window.innerWidth <= 768) toggleMenu();
    }));

    // --- 📅 Nawigacja Datą (Logika) 📅 ---
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    const dateDisplay = document.getElementById('current-date-display');
    
    // Zmienna stanu dla "przeglądanej" daty. Zaczynamy od dzisiaj.
    let currentDate = new Date();

    function updateMainViewForDate(dateObj) {
        // 1. Aktualizuj wyświetlaną datę (np. "September 13, 2026")
        dateDisplay.textContent = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        // 2. Sprawdź dostępność danych dla tej daty w BAZIE 2 (Kompozytorzy)
        const targetMMDD = String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
        const composerFound = composersDatabase.find(c => c.birthDate === targetMMDD);

        // 3. Renderuj odpowiedni scenariusz
        renderScenario(composerFound);

        // 4. Renderuj codzienną ciekawostkę (BASE 1 - wspólne dla obu scenariuszy)
        renderDailyInsight(dateObj);
    }

    // --- 🎬 Silnik renderowania scenariuszy 🎬 ---

    function renderScenario(composer) {
        const contentArea = document.getElementById('dynamic-content-area');
        
        if (composer) {
            // 🌟 CASE 2: Mamy urodziny! 🌟
            const mainTrack = composer.tracks[0]; // Sugerowany główny utwór

            // Budujemy HTML dla "Born Today"
            contentArea.innerHTML = `
                <div class="card born-today-card">
                    <div class="section-label">Born Today</div>
                    <h2>${composer.composer}</h2>
                    <p class="composer-nationality">${composer.country}</p>
                    
                    <hr class="subtle-divider">
                    
                    <div class="suggested-track">
                        <h3>${mainTrack.title} <span class="track-duration">${mainTrack.duration}</span></h3>
                        <div class="case-details">
                            <p class="fact-text"><em>"${composer.facts[mainTrack.mood]}"</em></p>
                            <span class="mood-tag">${mainTrack.mood.replace('#', '')}</span>
                        </div>
                        <div class="external-links">
                            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(mainTrack.youtubeQuery)}" target="_blank" class="action-btn yt-link">▶ Listen on YouTube</a>
                            <a href="https://open.spotify.com/search/${encodeURIComponent(mainTrack.spotifyQuery)}" target="_blank" class="action-btn sp-link">🔊 Listen on Spotify</a>
                        </div>
                         <button class="action-btn save-btn" id="save-track-btn" data-track-id="${mainTrack.id}">⭐ Save for later</button>
                    </div>

                    <div class="discover-section">
                        <h3>Discover more by ${composer.composer}</h3>
                        <div class="track-list">
                            ${composer.tracks.slice(1).map(track => `
                                <div class="track-item">
                                    <div class="track-meta">
                                        <span>${track.title}</span>
                                        <span class="track-duration">${track.duration}</span>
                                    </div>
                                    <div class="track-links external-links">
                                         <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(track.youtubeQuery)}" target="_blank" class="icon-btn yt-link" title="YouTube">▶</a>
                                         <a href="https://open.spotify.com/search/${encodeURIComponent(track.spotifyQuery)}" target="_blank" class="icon-btn sp-link" title="Spotify">🔊</a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
             // Obsługa przycisku save
            document.getElementById('save-track-btn').addEventListener('click', () => console.log('Saved:', mainTrack.id));

        } else {
            // 🌑 CASE 1: Nie ma kompozytora 🌑
            contentArea.innerHTML = `
                <div class="card no-composer-card">
                     <div class="section-label">Today's Meditation</div>
                    <h3>A quiet moment awaits...</h3>
                    <p>No specific composer recorded premiere for this day in our database.</p>
                    <p>Use the navigation above to explore other days.</p>
                    
                    <!-- Ilustracja opcjonalnie -->
                    <div class="placeholder-visual">🪕</div>
                </div>
            `;
        }
    }

    // --- 💡 Silnik renderowania ciekawostek (BASE 1) 💡 ---
    function renderDailyInsight(dateObj) {
        const insightContainer = document.getElementById('daily-insight-container');
        
        // Obliczamy "indeks" ciekawostki na dany dzień. 
        // Prosty sposób: numer dnia roku modulo długość bazy ciekawostek.
        const start = new Date(dateObj.getFullYear(), 0, 0);
        const diff = dateObj - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const insightIndex = dayOfYear % classicalInsights.length;
        const todayInsight = classicalInsights[insightIndex];

        insightContainer.innerHTML = `
            <div class="section-label">Did You Know? (${todayInsight.category})</div>
            <p>"${todayInsight.text}"</p>
        `;
    }


    // --- ⚙️ Obsługa przycisków nawigacyjnych ⚙️ ---

    navPrev.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateMainViewForDate(currentDate);
    });

    navNext.addEventListener('click', () => {
        // Opcjonalnie: blokada wybiegania w przyszłość, jeśli aplikacja ma być "codzienna"
        // if (currentDate >= new Date()) return; 
        currentDate.setDate(currentDate.getDate() + 1);
        updateMainViewForDate(currentDate);
    });

    // --- 🎉 Start aplikacji 🎉 ---
    // Załaduj widok dla dzisiejszego dnia na starcie
    updateMainViewForDate(currentDate);

    // Pozostałe moduły (Stats, Jump, Reminder, Appearance) nie wymagają zmian,
    // ponieważ ich logika jest zamknięta w blokach if(element)
});
