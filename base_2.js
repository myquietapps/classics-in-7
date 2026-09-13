const composersDatabase = [
    {
        id: "debussy",
        composer: "Claude Debussy",
        birthDate: "08-22",
        country: "[FR]",
        facts: {
            "#Melancholic": "Debussy wrote this piece during a period of intense personal and financial struggle, channeling deep melancholy into serene soundscapes.",
            "#Relaxing": "Debussy sought to break away from traditional German romanticism, creating fluid, impressionistic textures designed to deeply calm the listener.",
            "#Dreamy": "Fascinated by Symbolist poetry, Debussy crafted ethereal, floating harmonies that feel like an undisturbed dream."
        },
        tracks: [
            { id: "debussy-1", title: "Clair de Lune", duration: "(4:30)", mood: "#Relaxing", youtubeQuery: "Claude Debussy Clair de Lune official audio", spotifyQuery: "Claude Debussy Clair de Lune" },
            { id: "debussy-2", title: "Reverie", duration: "(4:05)", mood: "#Dreamy", youtubeQuery: "Claude Debussy Reverie", spotifyQuery: "Claude Debussy Reverie" }
        ]
    },
    {
        id: "chopin",
        composer: "Frédéric Chopin",
        birthDate: "03-01",
        country: "[PL]",
        facts: {
            "#Romantic": "Chopin poured his intense longing for his homeland Poland and personal heartbreak directly into his expressive piano lines.",
            "#Melancholic": "Much of Chopin's music was composed while battling severe illness, transforming physical fragility into breathtaking poetic vulnerability."
        },
        tracks: [
            { id: "chopin-1", title: "Nocturnes, Op. 9 No. 2", duration: "(4:35)", mood: "#Romantic", youtubeQuery: "Chopin Nocturne Op 9 No 2 official", spotifyQuery: "Frédéric Chopin Nocturne Op 9 No 2" },
            { id: "chopin-2", title: "Minute Waltz (Op. 64 No. 1)", duration: "(1:50)", mood: "#Melancholic", youtubeQuery: "Chopin Minute Waltz Op 64 No 1", spotifyQuery: "Frédéric Chopin Waltz in D-Flat Major Op. 64 No. 1" }
        ]
    }
];
