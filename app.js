// Baza danych kompozytorów oraz ich 7 kluczowych utworów
const composersData = [
    {
        name: "Johann Sebastian Bach",
        meta: "Baroque • 1685–1750 • Germany",
        anchorBadge: "The Foundation",
        wikiUrl: "https://pl.wikipedia.org/wiki/Johann_Sebastian_Bach",
        eventNote: "💡 1717: Okres w Cöthen – czas rozkwitu muzyki instrumentalnej.",
        tracks: [
            {
                title: "Wtc I: Prelude and Fugue in C Major, BWV 846",
                duration: "2:15",
                moods: ["Meditative", "Pure"],
                fact: "Architektoniczny majstersztyk rozpoczynający monumentalny cykl Das Wohltemperierte Klavier, symbol harmonii i ładu.",
                buttons: [
                    { label: "Posłuchaj (YT)", url: "https://www.youtube.com/results?search_query=BWV+846" },
                    { label: "Nuty (IMSLP)", url: "https://imslp.org/wiki/Special:ImagefromLH/9040" },
                    { label: "Analiza", url: "#" },
                    { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Brandenburg Concerto No. 3 in G Major, BWV 1048",
                duration: "5:40",
                moods: ["Energetic", "Joyful"],
                fact: "Niezwykły utwór w całości powierzony instrumentom smyczkowym bez tradycyjnych solistów.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Goldberg Variations, BWV 988: Aria",
                duration: "4:30",
                moods: ["Sublime", "Calm"],
                fact: "Słynna aria, która według legendy miała pomagać hrabiemu Keyserlingowi w bezsennych nocach.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Cello Suite No. 1 in G Major, BWV 1007: Prélude",
                duration: "2:35",
                moods: ["Majestic", "Solo"],
                fact: "Jedna z najbardziej rozpoznawalnych melodii napisanich na wiolonczelę solo.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Toccata and Fugue in D Minor, BWV 565",
                duration: "8:50",
                moods: ["Dramatic", "Grand"],
                fact: "Najsłynniejsze dzieło organowe w historii muzyki klasycznej, pełne mrocznego patosu.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Orchestral Suite No. 3 in D Major, BWV 1068: Air",
                duration: "4:20",
                moods: ["Lyrical", "Serene"],
                fact: "Powszechnie znany jako „Air na strunie G”, urzeka swoim śpiewnym i głębokim charakterem.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "St. Matthew Passion, BWV 244: Erbarme dich",
                duration: "6:10",
                moods: ["Devotional", "Tragic"],
                fact: "Głęboko poruszająca aria z Pasji wg św. Mateusza ze wspaniałym obbligato skrzypiec.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            }
        ]
    },
    {
        name: "Ludwig van Beethoven",
        meta: "Classical/Romantic • 1770–1827 • Germany",
        anchorBadge: "The Titan",
        wikiUrl: "https://pl.wikipedia.org/wiki/Ludwig_van_Beethoven",
        eventNote: "💡 1804: Powstanie przełomowej III Symfonii „Eroica”.",
        tracks: [
            {
                title: "Symphony No. 5 in C Minor, Op. 67: I. Allegro con brio",
                duration: "7:20",
                moods: ["Fateful", "Tense"],
                fact: "Motyw losu pukającego do drzwi – jeden z najbardziej rozpoznawalnych motywów muzycznych świata.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Piano Sonata No. 14 in C-sharp Minor, Op. 27 No. 2 ('Moonlight'): I",
                duration: "6:00",
                moods: ["Nocturnal", "Melancholic"],
                fact: "Romantyczny nokturn o hipnotyzującym, trójsiecznym akompaniamencie.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Bagatelle in A Minor, WoO 59 ('Für Elise')",
                duration: "3:10",
                moods: ["Gentle", "Lyrical"],
                fact: "Niezwykle popularna miniatura fortepianowa pełna delikatnego uroku.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Symphony No. 9 in D Minor, Op. 125: IV. Presto ('Ode to Joy')",
                duration: "6:45",
                moods: ["Triumphant", "Universal"],
                fact: "Finał z udziałem chóru oparty na odzie Friedricha Schillera, hymn Unii Europejskiej.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Violin Concerto in D Major, Op. 61: III. Rondo",
                duration: "9:50",
                moods: ["Sparkling", "Virtuoso"],
                fact: "Jeden z najwspanialszych koncertów skrzypcowych w historii, łączący liryzm z energią.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "Piano Concerto No. 5 in E-flat Major, Op. 73 ('Emperor'): I",
                duration: "20:15",
                moods: ["Heroic", "Majestic"],
                fact: "Ostatni koncert fortepianowy Beethovena, pełen rozmachu i monumentalnej siły.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            },
            {
                title: "String Quartet No. 14 in C-sharp Minor, Op. 131: I",
                duration: "6:50",
                moods: ["Introspective", "Transcendent"],
                fact: "Dzieło późnego okresu twórczości, które Schubert uważał za szczyt kameralnej ekspresji.",
                buttons: [
                    { label: "Posłuchaj", url: "#" }, { label: "Nuty", url: "#" }, { label: "Analiza", url: "#" }, { label: "Historia", url: "#" }
                ]
            }
        ]
    }
];

// Losowanie kompozytora przy wejściu (lub możesz wybrać indeks domyślny 0)
const currentComposer = composersData[Math.floor(Math.random() * composersData.length)];

// Funkcja wypełniająca interfejs danymi kompozytora i utworów
function initApp() {
    // 1. Ustawienie danych nagłówka kompozytora
    document.getElementById('anchor-badge').textContent = currentComposer.anchorBadge;
    document.getElementById('composer-name').textContent = currentComposer.name;
    document.getElementById('composer-meta').textContent = currentComposer.meta;
    
    const eventNoteEl = document.getElementById('event-note');
    if (currentComposer.eventNote) {
        eventNoteEl.textContent = currentComposer.eventNote;
        eventNoteEl.style.display = 'block';
    }

    document.getElementById('wiki-link').href = currentComposer.wikiUrl;

    // 2. Pierwszy utwór jako utwór główny (#1)
    const mainTrack = currentComposer.tracks[0];
    document.getElementById('main-track-title').textContent = mainTrack.title;
    document.getElementById('main-track-duration').textContent = mainTrack.duration;
    document.getElementById('main-track-fact').textContent = mainTrack.fact;

    // Tagi nastroju głównego utworu (w prawym panelu pod czasem)
    const mainMoodsContainer = document.getElementById('main-track-moods');
    mainMoodsContainer.innerHTML = '';
    mainTrack.moods.forEach(mood => {
        const span = document.createElement('span');
        span.className = 'mood-tag';
        span.textContent = mood;
        mainMoodsContainer.appendChild(span);
    });

    // Przyciski głównego utworu (2x2)
    for (let i = 0; i < 4; i++) {
        const btnData = mainTrack.buttons[i];
        const btnElement = document.getElementById(`btn-${i + 1}`);
        if (btnData && btnElement) {
            btnElement.textContent = btnData.label;
            btnElement.onclick = () => {
                if (btnData.url.startsWith('http')) {
                    window.open(btnData.url, '_blank');
                } else {
                    alert(`Kliknięto: ${btnData.label} dla utworu: ${mainTrack.title}`);
                }
            };
        }
    }

    // 3. Utwory od #2 do #7 w sekcji Discover More
    const tracksContainer = document.getElementById('tracks-container');
    tracksContainer.innerHTML = '';

    for (let i = 1; i < currentComposer.tracks.length; i++) {
        const track = currentComposer.tracks[i];
        const card = document.createElement('div');
        card.className = 'track-card';

        // Generowanie tagów nastroju dla karty
        let moodsHTML = '<div class="mood-tags-container-right">';
        track.moods.forEach(m => {
            moodsHTML += `<span class="mood-tag">${m}</span>`;
        });
        moodsHTML += '</div>';

        card.innerHTML = `
            <div class="track-header">
                <span class="track-rank">#${i + 1}</span>
                <h4 class="track-title">${track.title}</h4>
                <div class="track-right-side">
                    <div class="track-right-column">
                        <span class="track-duration">${track.duration}</span>
                        ${moodsHTML}
                    </div>
                </div>
            </div>
            <p class="track-fact">${track.fact}</p>
        `;

        // Opcjonalnie: kliknięcie w kartę może promować utwór na główny lub wyświetlać detale
        card.addEventListener('click', () => {
            // Przykładowa akcja – np. zamiana miejscami z głównym utworem
            // Możesz tutaj dopisać własną logikę wyboru utworu
        });

        tracksContainer.appendChild(card);
    }
}

// Obsługa rozwijania sekcji "Discover More"
const discoverToggle = document.getElementById('discover-toggle');
const discoverContent = document.getElementById('discover-content');
const discoverArrow = document.getElementById('discover-arrow');

discoverToggle.addEventListener('click', () => {
    discoverContent.classList.toggle('expanded');
    if (discoverContent.classList.contains('expanded')) {
        discoverArrow.style.transform = 'rotate(180deg)';
    } else {
        discoverArrow.style.transform = 'rotate(0deg)';
    }
});

// Obsługa menu zębatki w prawym górnym rogu
const settingsBtn = document.getElementById('settings-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

if (settingsBtn && dropdownMenu) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
    });
}

// Uruchomienie aplikacji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', initApp);
