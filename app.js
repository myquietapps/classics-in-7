/* ==========================================
   CLASSICS IN 7 - APP LOGIC & NAVIGATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hamburger Menu & Drawer Toggle Logic
    const menuToggle = document.getElementById('menu-toggle');
    const gearToggle = document.getElementById('gear-toggle');
    const menuClose = document.getElementById('menu-close');
    const menu = document.getElementById('hamburger-menu');
    const backdrop = document.getElementById('drawer-backdrop');
    const menuLinks = document.querySelectorAll('.menu-list a');

    function toggleMenu() {
        menu.classList.toggle('hidden');
        backdrop.classList.toggle('hidden');
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', toggleMenu);

    // Gear icon shortcut -> Jump to Date view
    if (gearToggle) {
        gearToggle.addEventListener('click', () => {
            switchView('jump');
        });
    }

    // View Switching Logic
    const views = document.querySelectorAll('.view-section');

    function switchView(targetViewId) {
        views.forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view-${targetViewId}`);
        if (target) {
            target.classList.add('active');
        }
        menuLinks.forEach(l => {
            if (l.getAttribute('data-view') === targetViewId) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });
        window.scrollTo(0, 0);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-view');
            switchView(viewId);
            if (window.innerWidth <= 768) {
                menu.classList.add('hidden');
                backdrop.classList.add('hidden');
            }
        });
    });

    // 2. Saved Tracks Management & Dynamic Badge
    let savedTracks = [
        { id: 1, title: "Clair de Lune", composer: "Claude Debussy", mood: "Serene" },
        { id: 2, title: "Nocturne in E-flat major, Op. 9, No. 2", composer: "Frédéric Chopin", mood: "Melancholic" },
        { id: 3, title: "The Four Seasons: Spring", composer: "Antonio Vivaldi", mood: "Uplifting" }
    ];

    function updateSavedBadge() {
        const badge = document.getElementById('saved-badge');
        if (badge) {
            badge.textContent = savedTracks.length;
        }
    }

    function renderSavedTracks() {
        const savedListContainer = document.getElementById('saved-list-container');
        if (!savedListContainer) return;

        if (savedTracks.length === 0) {
            savedListContainer.innerHTML = `<p class="subtitle">No saved tracks yet. Explore daily masterpieces and save your favorites!</p>`;
            return;
        }

        savedListContainer.innerHTML = savedTracks.map((item, idx) => `
            <div class="saved-item">
                <div>
                    <strong>${item.title}</strong><br>
                    <small>${item.composer} • <em>#${item.mood}</em></small>
                </div>
                <button class="icon-btn remove-saved-btn" data-index="${idx}" title="Remove">×</button>
            </div>
        `).join('');

        document.querySelectorAll('.remove-saved-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                savedTracks.splice(index, 1);
                updateSavedBadge();
                renderSavedTracks();
            });
        });
    }

    updateSavedBadge();
    renderSavedTracks();

    // 3. My Mood Stats & Reaction Tracker
    let statsData = {
        thumbsUp: 14,
        thumbsDown: 2,
        tags: [
            { name: "Serene", score: 85 },
            { name: "Melancholic", score: 70 },
            { name: "Uplifting", score: 60 },
            { name: "Dramatic", score: 40 },
            { name: "Romantic", score: 30 }
        ]
    };

    function renderMoodStats() {
        const countUp = document.getElementById('count-up');
        const countDown = document.getElementById('count-down');
        if (countUp) countUp.textContent = statsData.thumbsUp;
        if (countDown) countDown.textContent = statsData.thumbsDown;

        const moodTagsContainer = document.getElementById('mood-tags-container');
        if (moodTagsContainer) {
            moodTagsContainer.innerHTML = statsData.tags.map(tag => `
                <div class="tag-bar-row">
                    <div class="tag-bar-info">
                        <span>#${tag.name}</span>
                        <span>${tag.score}%</span>
                    </div>
                    <div class="tag-progress-track">
                        <div class="tag-progress-fill" style="width: ${tag.score}%"></div>
                    </div>
                </div>
            `).join('');
        }
    }

    renderMoodStats();

    const btnThumbUp = document.getElementById('btn-thumb-up');
    const btnThumbDown = document.getElementById('btn-thumb-down');

    if (btnThumbUp) {
        btnThumbUp.addEventListener('click', () => {
            statsData.thumbsUp++;
            renderMoodStats();
        });
    }
    if (btnThumbDown) {
        btnThumbDown.addEventListener('click', () => {
            statsData.thumbsDown++;
            renderMoodStats();
        });
    }

    // 4. Appearance Themes
    const themeCards = document.querySelectorAll('.theme-card');

    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('classics_theme', themeName);
        themeCards.forEach(card => {
            if (card.getAttribute('data-theme-val') === themeName) {
                card.classList.add('active-theme');
            } else {
                card.classList.remove('active-theme');
            }
        });
    }

    const savedTheme = localStorage.getItem('classics_theme') || 'system';
    setTheme(savedTheme);

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const t = card.getAttribute('data-theme-val');
            setTheme(t);
        });
    });

    // 5. Jump to Date Logic
    const jumpGoBtn = document.getElementById('jump-go-btn');
    const datePickerInput = document.getElementById('date-picker-input');

    if (datePickerInput) {
        datePickerInput.value = new Date().toISOString().split('T')[0];
    }

    if (jumpGoBtn && datePickerInput) {
        jumpGoBtn.addEventListener('click', () => {
            const selectedDate = datePickerInput.value;
            if (!selectedDate) return;
            loadMasterpieceForDate(selectedDate);
            switchView('home');
        });
    }

    // 6. Home / Masterpiece Renderer with DB Integration & Case 1 Fallback
    const dynamicCaseContainer = document.getElementById('dynamic-case-container');
    const currentDateLabel = document.getElementById('current-date-label');

    function loadMasterpieceForDate(dateStr) {
        if (currentDateLabel) {
            currentDateLabel.textContent = `Date • ${dateStr}`;
        }
        
        if (dynamicCaseContainer) {
            // Konwersja daty YYYY-MM-DD do formatu MM-DD z bazy (np. 03-01 lub 08-22)[cite: 10]
            const dateObj = new Date(dateStr);
            const mmdd = String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
            
            // Sprawdzanie czy w bazie danych są urodziny kompozytora w tym dniu[cite: 10]
            const composer = typeof composersDatabase !== 'undefined' 
                ? composersDatabase.find(c => c.birthDate === mmdd) 
                : null;

            if (composer) {
                // Wyświetlanie kompozytora z bazy
                const track = composer.tracks[0];
                dynamicCaseContainer.innerHTML = `
                    <div class="stat-card">
                        <h3>Wyróżnienie na dziś: ${composer.composer} ${composer.country}</h3>
                        <p><strong>Urodziny:</strong> ${composer.birthDate}</p>
                        <p>Propozycja: <strong>${track.title}</strong> ${track.duration}</p>
                        <p><em>${track.mood}</em> – ${composer.facts[track.mood] || "Klasyczne dzieło mistrza."}</p>
                        <hr class="subtle-divider">
                        <button class="primary-btn" id="save-current-btn" style="width: 100%;">⭐ Zapisz w bibliotece</button>
                    </div>
                `;

                const saveBtn = document.getElementById('save-current-btn');
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => {
                        savedTracks.push({
                            id: Date.now(),
                            title: track.title,
                            composer: composer.composer,
                            mood: track.mood.replace('#', '')
                        });
                        updateSavedBadge();
                        renderSavedTracks();
                        alert("Utwór został zapisany w bibliotece!");
                    });
                }
            } else {
                // CASE 1: Brak urodzin w bazie – wyświetlamy ekrany nawigacji Previous/Next (Chopin / Debussy)[cite: 10]
                dynamicCaseContainer.innerHTML = `
                    <div class="stat-card" style="text-align: center;">
                        <h3>Brak rocznicy w bazie dla dnia ${mmdd}</h3>
                        <p class="subtitle" style="margin-top: 0.5rem;">Sprawdź dni, w których urodzili się nasi główni kompozytorzy:</p>
                        
                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
                            <button class="primary-btn" id="go-chopin-btn" style="flex: 1;">
                                ⬅ Poprzedni: Chopin (01.03)
                            </button>
                            <button class="primary-btn" id="go-debussy-btn" style="flex: 1;">
                                Następny: Debussy (22.08) ➡
                            </button>
                        </div>
                    </div>
                `;

                document.getElementById('go-chopin-btn').addEventListener('click', () => {
                    const targetDate = `${new Date().getFullYear()}-03-01`;
                    if (datePickerInput) datePickerInput.value = targetDate;
                    loadMasterpieceForDate(targetDate);
                });

                document.getElementById('go-debussy-btn').addEventListener('click', () => {
                    const targetDate = `${new Date().getFullYear()}-08-22`;
                    if (datePickerInput) datePickerInput.value = targetDate;
                    loadMasterpieceForDate(targetDate);
                });
            }
        }
    }

    // Ładowanie domyślne dla dzisiejszego dnia
    loadMasterpieceForDate(new Date().toISOString().split('T')[0]);

    console.log("Classics in 7 initialized successfully with dynamic DB check and Case 1 navigation.");
});
