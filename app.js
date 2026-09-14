/**
 * Classics in 7 - Main Application Engine
 * Hand-crafted with focus on zero-scroll UX and digital minimalism.
 */

// Global state configuration
const currentUser = {
    isPremium: false // Toggle to true to test Premium functionalities
};

// Default user settings for the programmable 2x2 matrix buttons (KEY 1 & KEY 2)
let playerSettings = {
    key1: 'spotify',     // Options: 'spotify', 'apple', 'amazon', 'deezer', 'youtube_app', 'youtube_safe'
    key2: 'youtube_app'  // Must be unique from key1 (handled by validation mechanism)
};

// Keep track of the currently loaded active track data for dynamic sharing
let activeTrackData = {
    composer: '',
    title: '',
    duration: '',
    didYouKnow: ''
};

// Tracks data cache for the active composer of the day
let currentDayTracks = [];

/**
 * Retrieves current date string in local MM-DD format based on user's device clock
 */
function getCurrentDateKey() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}-${day}`;
}

/**
 * Main application initialization triggered on DOM Content Loaded
 */
async function initializeApp() {
    showSkeletonLoader(true);
    
    try {
        // Fetching both data systems simultaneously for maximum efficiency
        const [appContentResponse, muzContentResponse] = await Promise.all([
            fetch('app-content.json'),
            fetch('muz-content.json')
        ]);

        const appData = await appContentResponse.json();
        const muzData = await muzContentResponse.json();

        // 1. Inject static UI strings from app-content.json
        setupInterfaceTranslations(appData.ui_strings);

        // 2. Load and verify the historical anchor of the day from muz-content.json
        const dateKey = getCurrentDateKey();
        const dailyData = muzData[dateKey];

        if (dailyData) {
            setupComposerCard(dailyData);
        } else {
            handleMissingDataState();
        }

        // 3. Initialize Hamburger Menu logic and Event Listeners
        setupMenuLogic();
        setupPlayerSettingsValidation();

    } catch (error) {
        console.error("Critical error during application startup:", error);
        document.getElementById('composerName').textContent = "Connection Error";
    } finally {
        showSkeletonLoader(false);
    }
}

/**
 * Toggles the visibility of the visual Skeleton Loader
 */
function showSkeletonLoader(isLoading) {
    const loader = document.getElementById('skeletonLoader');
    const mainContent = document.getElementById('mainContentCard');
    
    if (loader && mainContent) {
        if (isLoading) {
            loader.style.display = 'flex';
            mainContent.style.opacity = '0';
        } else {
            loader.style.display = 'none';
            mainContent.style.opacity = '1';
        }
    }
}

/**
 * Populates global card elements and loads track number 1 as default
 */
function setupComposerCard(data) {
    document.getElementById('contextHeader').textContent = data.event_type;
    document.getElementById('composerName').textContent = data.composer;
    
    // Inject biographical metadata string format: [Country • Period • Years]
    document.getElementById('biographyMeta').textContent = 
        `[${data.country} • ${data.period} • ${data.years}]`;
        
    document.getElementById('wikiLink').href = data.wiki_url;

    // Cache the 6 tracks array and inject track 1 automatically
    currentDayTracks = data.tracks;
    injectTrackToMainPosition(1);
    setupDiscoverMoreList();
}

/**
 * Core dynamic mechanic: Swaps clicked track from the 1-6 list into primary view
 */
function injectTrackToMainPosition(trackId) {
    const track = currentDayTracks.find(t => t.id === trackId);
    if (!track) return;

    // Update dynamic interface elements
    document.getElementById('pieceTitle').textContent = `${track.title} (${track.duration})`;
    document.getElementById('factText').textContent = track.did_you_know;

    // Update global object cache used for sharing functions
    activeTrackData.composer = document.getElementById('composerName').textContent;
    activeTrackData.title = track.title;
    activeTrackData.duration = track.duration;
    activeTrackData.didYouKnow = track.did_you_know;

    // Render the 2x2 programmable button links based on current user preferences
    renderProgrammableButtons(track);
}

/**
 * Renders behavior, colors, and links of KEY 1 and KEY 2 buttons based on settings
 */
function renderProgrammableButtons(track) {
    const key1Btn = document.getElementById('matrixKey1');
    const key2Btn = document.getElementById('matrixKey2');

    if (key1Btn) configureSingleButton(key1Btn, playerSettings.key1, track);
    if (key2Btn) configureSingleButton(key2Btn, playerSettings.key2, track);
}

/**
 * Compiles specific target strings and behaviors for a defined programmable button
 */
function configureSingleButton(buttonElement, preference, track) {
    buttonElement.style.backgroundColor = '';
    buttonElement.style.color = '';
    
    let query = `${activeTrackData.composer} ${track.title}`;
    
    switch(preference) {
        case 'spotify':
            buttonElement.textContent = "▶ Spotify";
            buttonElement.style.backgroundColor = "#1DB954";
            buttonElement.style.color = "#FFFFFF";
            buttonElement.onclick = () => window.open(`https://spotify.com{encodeURIComponent(query)}`, '_blank');
            break;
            
        case 'apple':
            buttonElement.textContent = "▶ Apple Music";
            buttonElement.style.backgroundColor = "#000000";
            buttonElement.style.color = "#FFFFFF";
            buttonElement.onclick = () => window.open(`https://apple.com{encodeURIComponent(query)}`, '_blank');
            break;
            
        case 'amazon':
            buttonElement.textContent = "▶ Amazon Music";
            buttonElement.style.backgroundColor = "#00A8E1";
            buttonElement.style.color = "#FFFFFF";
            buttonElement.onclick = () => window.open(`https://amazon.com{encodeURIComponent(query)}`, '_blank');
            break;
            
        case 'deezer':
            buttonElement.textContent = "▶ Deezer";
            buttonElement.style.backgroundColor = "#FF007F";
            buttonElement.style.color = "#FFFFFF";
            buttonElement.onclick = () => window.open(`https://deezer.com{encodeURIComponent(query)}`, '_blank');
            break;
            
        case 'youtube_app':
            buttonElement.textContent = "▶ YouTube";
            buttonElement.style.backgroundColor = "#333333";
            buttonElement.style.color = "#E0E0E0";
            buttonElement.onclick = () => window.open(`https://youtube.com{encodeURIComponent(query + " official")}`, '_blank');
            break;
            
        case 'youtube_safe':
            buttonElement.textContent = "▶ YouTube (Safe)";
            buttonElement.style.backgroundColor = "#D4AF37";
            buttonElement.style.color = "#121212";
            buttonElement.onclick = () => triggerSafeIframePlayer(track.youtube_video_id);
            break;
    }
}

/**
 * Premium functionality: Injects a privacy-enhanced ad-free embedded iframe player
 */
function triggerSafeIframePlayer(videoId) {
    if (!currentUser.isPremium) {
        alert("🔒 YouTube Safe Browser Mode is a Premium feature ($1/mo). It blocks all ad scripts legally inside our dark interface.");
        return;
    }
    
    const factContainer = document.getElementById('factText');
    if (!factContainer) return;

    factContainer.innerHTML = `
        <div style="width:100%; height:150px; background:#000; border-radius:8px; overflow:hidden;">
            <iframe width="100%" height="100%" src="https://youtube-nocookie.com{videoId}?autoplay=1&rel=0" 
                    title="YouTube video player" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </div>
        <p style="font-size:0.8rem; color:#888; text-align:center; margin-top:8px;">
            🧘 Respecting your on-screen time. Close your eyes and enjoy the calm.
        </p>
    `;
}

/**
 * Renders the 5 expanding secondary pieces inside DISCOVER MORE container
 */
function setupDiscoverMoreList() {
    const container = document.getElementById('discoverMoreList');
    if (!container) return;
    
    container.innerHTML = '';
    const secondaryTracks = currentDayTracks.slice(1);
    
    secondaryTracks.forEach(track => {
        const item = document.createElement('div');
        item.className = 'discover-list-item';
        item.style.padding = '12px 0';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        item.style.cursor = 'pointer';
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                <span>${track.id}. ${track.title}</span>
                <span style="color:#888;">${track.duration}</span>
            </div>
        `;
        
        item.onclick = () => {
            injectTrackToMainPosition(track.id);
            document.getElementById('discoverMoreList').classList.remove('expanded');
        };
        
        container.appendChild(item);
    });
}

/**
 * Strategic Viral Engine: Compiles the dynamic clipboard data package for Button 4
 */
function executePrimaryShare() {
    const textToCopy = `Classics in 7\n🏛️ ${activeTrackData.composer} – ${activeTrackData.title} (${activeTrackData.duration})\n\nDid you know?\n${activeTrackData.didYouKnow}\n\nEnjoy classical music. No ads or scrolling:\n➔ https://pages.dev`;
    
