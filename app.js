/* ==========================================
   CLASSICS IN 7 - APP LOGIC & NAVIGATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hamburger Menu Toggle Logic
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menu = document.getElementById('hamburger-menu');
    const menuLinks = document.querySelectorAll('.menu-list a');

    function toggleMenu() {
        menu.classList.toggle('hidden');
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);

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
            }
        });
    });

    // 2. Daily Reminders (10 English encouraging prompts)
    const encouragingReminders = [
        "Your daily classical ritual is waiting for you.",
        "Pause for a moment—discover today's masterpiece.",
        "Time for a short break with music that has stood the test of time.",
        "One track, a new story. Check out what we have prepared for today.",
        "Starting the day with class? Your classical piece for today is ready.",
        "A moment to breathe: today's music and a fascinating fact are waiting.",
        "Treat yourself to a few minutes of beauty in your busy day.",
        "Your musical compass points to today's classic. Discover it!",
        "Music has the power to shift your mood. See what's playing today.",
        "Open the app and tune into today's track of the day."
    ];

    const remindersListPreview = document.getElementById('reminders-list-preview');
    if (remindersListPreview) {
        remindersListPreview.innerHTML = encouragingReminders.map(prompt => `<li>${prompt}</li>`).join('');
    }

    // 3. Appearance Themes (6 Motywy)
    const themeCards = document.querySelectorAll('.theme-card');
    const themeQuickToggle = document.getElementById('theme-quick-toggle');
    const themesOrder = ['system', 'nocturne', 'sonata', 'cello', 'e-ink', 'primavera'];

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

    // Load saved theme
    const savedTheme = localStorage.getItem('classics_theme') || 'system';
    setTheme(savedTheme);

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const t = card.getAttribute('data-theme-val');
            setTheme(t);
        });
    });

    if (themeQuickToggle) {
        themeQuickToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'system';
            const nextIdx = (themesOrder.indexOf(current) + 1) % themesOrder.length;
            setTheme(themesOrder[nextIdx]);
        });
    }

    // 4. Jump to Date Tabs Logic
    const tabBtns = document.querySelectorAll('.jump-tabs .tab-btn');
    const tabRoll = document.getElementById('tab-content-roll');
    const tabCalendar = document.getElementById('tab-content-calendar');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            tabBtns.forEach(b => { b.classList.remove('active'); b.classList.add('tab-inactive'); });
            btn.classList.add('active');
            btn.classList.remove('tab-inactive');

            if (tabName === 'roll') {
                tabRoll.classList.remove('hidden');
                tabCalendar.classList.add('hidden');
            } else {
                tabRoll.classList.add('hidden');
                tabCalendar.classList.remove('hidden');
            }
        });
    });

    // Populate Archive scroll list
    const archiveScrollList = document.getElementById('archive-scroll-list');
    if (archiveScrollList) {
        const sampleDates = ['2026-09-13', '2026-09-12', '2026-09-11', '2026-09-10', '2026-09-09', '2026-09-08', '2026-09-07'];
        archiveScrollList.innerHTML = sampleDates.map(date => `
            <a href="#" class="archive-item">
                <strong>${date}</strong> — Daily Masterpiece & Microlearning
            </a>
        `).join('');
    }

    // 5. Saved Classics Sample List
    const savedListContainer = document.getElementById('saved-list-container');
    if (savedListContainer) {
        const savedItems = [
            { title: "Clair de Lune", composer: "Claude Debussy", mood: "Serene" },
            { title: "Nocturne in E-flat major, Op. 9, No. 2", composer: "Frédéric Chopin", mood: "Melancholic" },
            { title: "The Four Seasons: Spring", composer: "Antonio Vivaldi", mood: "Uplifting" }
        ];
        savedListContainer.innerHTML = savedItems.map(item => `
            <div class="saved-item">
                <div>
                    <strong>${item.title}</strong><br>
                    <small>${item.composer} • <em>${item.mood}</em></small>
                </div>
                <button class="icon-btn" title="Remove">×</button>
            </div>
        `).join('');
    }

    // 6. Home / Case Renderer Initializer
    const dynamicCaseContainer = document.getElementById('dynamic-case-container');
    const currentDateLabel = document.getElementById('current-date-label');
    if (currentDateLabel) {
        const today = new Date().toISOString().split('T')[0];
        currentDateLabel.textContent = `Today • ${today}`;
    }

    if (dynamicCaseContainer) {
        dynamicCaseContainer.innerHTML = `
            <div class="stat-card">
                <h3>Today's Masterpiece: Goldberg Variations, BWV 988</h3>
                <p><strong>Composer:</strong> Johann Sebastian Bach</p>
                <p>A monumental work of keyboard literature consisting of an aria and a set of 30 variations.</p>
                <hr class="subtle-divider">
                <h4>Microlearning 1: The Sleeping Pill Legend</h4>
                <p>Count Hermann von Keyserling commissioned the piece to help him sleep through his painful insomnia, played by his talented young student Johann Gottlieb Goldberg.</p>
            </div>
        `;
    }

    console.log("Classics in 7 initialized successfully with all hamburger menu sections.");
});
