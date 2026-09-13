document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menu = document.getElementById('hamburger-menu');
    const backdrop = document.getElementById('drawer-backdrop');
    const gearToggle = document.getElementById('gear-toggle');
    const menuLinks = document.querySelectorAll('.menu-list a');
    const views = document.querySelectorAll('.view-section');

    function toggleMenu() {
        menu.classList.toggle('hidden');
        backdrop.classList.toggle('hidden');
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', toggleMenu);
    if (gearToggle) gearToggle.addEventListener('click', () => switchView('jump'));

    function switchView(targetViewId) {
        views.forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view-${targetViewId}`);
        if (target) target.classList.add('active');
        menuLinks.forEach(l => {
            if (l.getAttribute('data-view') === targetViewId) l.classList.add('active');
            else l.classList.remove('active');
        });
        window.scrollTo(0, 0);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(link.getAttribute('data-view'));
            if (window.innerWidth <= 768) toggleMenu();
        });
    });

    // 10 Powiadomień (EN)
    const prompts = [
        "Your daily classical ritual is waiting for you.", "Pause for a moment—discover today's masterpiece.",
        "Time for a short break with music that has stood the test of time.", "One track, a new story. Check out what we have prepared for today.",
        "Starting the day with class? Your classical piece for today is ready.", "A moment to breathe: today's music and a fascinating fact are waiting.",
        "Treat yourself to a few minutes of beauty in your busy day.", "Your musical compass points to today's classic. Discover it!",
        "Music has the power to shift your mood. See what's playing today.", "Open the app and tune into today's track of the day."
    ];
    const preview = document.getElementById('reminders-list-preview');
    if (preview) preview.innerHTML = prompts.map(p => `<li>${p}</li>`).join('');

    // Motywy
    const themeCards = document.querySelectorAll('.theme-card');
    function setTheme(name) {
        document.documentElement.setAttribute('data-theme', name);
        localStorage.setItem('classics_theme', name);
        themeCards.forEach(c => {
            if (c.getAttribute('data-theme-val') === name) c.classList.add('active-theme');
            else c.classList.remove('active-theme');
        });
    }
    setTheme(localStorage.getItem('classics_theme') || 'system');
    themeCards.forEach(c => c.addEventListener('click', () => setTheme(c.getAttribute('data-theme-val'))));

    // Jump to date tabs
    document.querySelectorAll('.jump-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.jump-tabs .tab-btn').forEach(b => b.classList.toggle('active', b === btn));
            const isRoll = btn.getAttribute('data-tab') === 'roll';
            document.getElementById('tab-content-roll').classList.toggle('hidden', !isRoll);
            document.getElementById('tab-content-calendar').classList.toggle('hidden', isRoll);
        });
    });

    const archive = document.getElementById('archive-scroll-list');
    if (archive) {
        archive.innerHTML = ['2026-09-13', '2026-09-12', '2026-09-11'].map(d => `<a href="#" class="archive-item"><strong>${d}</strong> — Masterpiece</a>`).join('');
    }
});
