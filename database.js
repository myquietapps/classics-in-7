const classicalInsights = [
    {
        id: 1,
        category: "History",
        text: "The modern piano was invented around 1700 by Bartolomeo Cristofori in Florence, solving the volume limitations of the harpsichord."
    },
    {
        id: 2,
        category: "Science",
        text: "Listening to classical piano music activates both hemispheres of the brain, significantly reducing stress and cortisol levels."
    },
    {
        id: 3,
        category: "Instruments",
        text: "Organ music features frequencies so low they can be felt physically rather than just heard, stimulating deep relaxation."
    },
    {
        id: 4,
        category: "Pop Culture",
        text: "Classical masterpieces like Bach's Goldberg Variations have been heavily sampled in modern ambient and cinematic electronic music."
    },
    {
        id: 5,
        category: "Theory",
        text: "The system of equal temperament tuning standardized Western music, allowing composers to seamlessly change keys without retuning."
    }
];

const composersDatabase = [
    {
        id: "debussy",
        composer: "Claude Debussy",
        birthDate: "08-22",
        country: "[FR]",
        facts: {
            "#Melancholic": "Debussy wrote this piece during a period of intense personal and financial struggle, channeling deep melancholy into serene soundscapes.",
            "#Relaxing": "Debussy sought to break away from traditional German romanticism, creating fluid, impressionistic textures designed to deeply calm the listener.",
            "#Dreamy": "Fascinated by Symbolist poetry, Debussy crafted ethereal, floating harmonies that feel like an undisturbed dream.",
            "#Dynamic": "Even in his most powerful orchestral works, Debussy treated instruments like shifting waves of light and color rather than rigid blocks of sound.",
            "#Graceful": "Debussy's writing here mirrors the fluid elegance of arabesque lines in visual art, prioritizing organic motion."
        },
        tracks: [
            {
                id: "debussy-1",
                title: "Clair de Lune",
                duration: "(4:30)",
                mood: "#Relaxing",
                youtubeQuery: "Claude Debussy Clair de Lune official audio",
                spotifyQuery: "Claude Debussy Clair de Lune"
            },
            {
                id: "debussy-2",
                title: "Reverie",
                duration: "(4:05)",
                mood: "#Dreamy",
                youtubeQuery: "Claude Debussy Reverie",
                spotifyQuery: "Claude Debussy Reverie"
            },
            {
                id: "debussy-3",
                title: "Arabesque No. 1",
                duration: "(5:00)",
                mood: "#Graceful",
                youtubeQuery: "Claude Debussy Arabesque No 1",
                spotifyQuery: "Claude Debussy Arabesque No 1"
            },
            {
                id: "debussy-4",
                title: "La Mer (Dialogue du vent et de la mer)",
                duration: "(8:15)",
                mood: "#Dynamic",
                youtubeQuery: "Claude Debussy La Mer Dialogue",
                spotifyQuery: "Claude Debussy La Mer Dialogue du vent et de la mer"
            },
            {
                id: "debussy-5",
                title: "The Girl with the Flaxen Hair",
                duration: "(2:30)",
                mood: "#Melancholic",
                youtubeQuery: "Claude Debussy The Girl with the Flaxen Hair",
                spotifyQuery: "Claude Debussy The Girl with the Flaxen Hair"
            }
        ]
    },
    {
        id: "chopin",
        composer: "Frédéric Chopin",
        birthDate: "03-01",
        country: "[PL]",
        facts: {
            "#Romantic": "Chopin poured his intense longing for his homeland Poland and personal heartbreak directly into his expressive piano lines.",
            "#Dreamy": "Chopin revolutionized piano technique by making the left hand provide a steady, hypnotic pulse while the right hand sang freely like a human voice.",
            "#Melancholic": "Much of Chopin's music was composed while battling severe illness, transforming physical fragility into breathtaking poetic vulnerability.",
            "#Passionate": "Despite his refined salon image, Chopin's performance style was fiercely dramatic, full of unexpected rhythmic freedom (rubato).",
            "#Grand": "Written as a grand patriotic statement, this piece showcases the ultimate aristocratic pageantry of Polish dance."
        },
        tracks: [
            {
                id: "chopin-1",
                title: "Nocturnes, Op. 9 No. 2",
                duration: "(4:35)",
                mood: "#Romantic",
                youtubeQuery: "Chopin Nocturne Op 9 No 2 official",
                spotifyQuery: "Frédéric Chopin Nocturne Op 9 No 2"
            },
            {
                id: "chopin-2",
                title: "Minute Waltz (Op. 64 No. 1)",
                duration: "(1:50)",
                mood: "#Passionate",
                youtubeQuery: "Chopin Minute Waltz Op 64 No 1",
                spotifyQuery: "Frédéric Chopin Waltz in D-Flat Major Op. 64 No. 1"
            },
            {
                id: "chopin-3",
                title: "Raindrop Prelude (Op. 28 No. 15)",
                duration: "(5:20)",
                mood: "#Melancholic",
                youtubeQuery: "Chopin Raindrop Prelude Op 28 No 15",
                spotifyQuery: "Frédéric Chopin Prelude Op. 28 No. 15"
            },
            {
                id: "chopin-4",
                title: "Fantaisie-Impromptu (Op. 66)",
                duration: "(5:12)",
                mood: "#Dreamy",
                youtubeQuery: "Chopin Fantaisie Impromptu Op 66",
                spotifyQuery: "Frédéric Chopin Fantaisie-Impromptu Op. 66"
            },
            {
                id: "chopin-5",
                title: "Heroic Polonaise (Op. 53)",
                duration: "(7:00)",
                mood: "#Grand",
                youtubeQuery: "Chopin Polonaise in A flat major Op 53 Heroic",
                spotifyQuery: "Frédéric Chopin Polonaise in A-Flat Major Op. 53"
            }
        ]
    }
];
