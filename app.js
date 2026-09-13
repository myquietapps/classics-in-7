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

        // Attach delete listeners
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

    // 4. Appearance Themes (6 Motywy)
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

    // 6. Home / Masterpiece Renderer
    const dynamicCaseContainer = document.getElementById('dynamic-case-container');
    const currentDateLabel = document.getElementById('current-date-label');

    function loadMasterpieceForDate(dateStr) {
        if (currentDateLabel) {
            currentDateLabel.textContent = `Date • ${dateStr}`;
        }
        if (dynamicCaseContainer) {
            dynamicCaseContainer.innerHTML = `
                <div class="stat-card">
                    <h3>Masterpiece for ${dateStr}: Goldberg Variations, BWV 988</h3>
                    <p><strong>Composer:</strong> Johann Sebastian Bach</p>
                    <p>A monumental work of keyboard literature consisting of an aria and 30 diverse variations.</p>
                    <hr class="subtle-divider">
                    <h4>Microlearning: The Sleeping Pill Legend</h4>
                    <p>Count Hermann von Keyserling commissioned the piece to help him sleep through painful insomnia, performed by young Johann Gottlieb Goldberg.</p>
                    <hr class="subtle-divider">
                    <button class="primary-btn" id="save-current-btn" style="width: 100%;">⭐ Save to Library</button>
                </div>
            `;

            const saveBtn = document.getElementById('save-current-btn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    savedTracks.push({
                        id: Date.now(),
                        title: "Goldberg Variations, BWV 988",
                        composer: "Johann Sebastian Bach",
                        mood: "Serene"
                    });
                    updateSavedBadge();
                    renderSavedTracks();
                    alert("Track saved to your library!");
                });
            }
        }
    }

    loadMasterpieceForDate(new Date().toISOString().split('T')[0]);

    console.log("Classics in 7 initialized successfully with Hamburger Menu, Saved Tracks, Mood Stats, and Jump to Date.");
});
