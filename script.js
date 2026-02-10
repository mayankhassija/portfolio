// === CONFIGURATION ===
const GITHUB_USER = 'mayankhassija'; // Your GitHub username
const REPO_NAME = 'portfolio';      // Your repository name
const FOLDER_NAME = 'Music';         // Exact folder name on GitHub

// === ELEMENTS ===
const audio = document.getElementById('audio-player');
const playlistUI = document.getElementById('playlist');
const trackTitle = document.getElementById('track-title');
const statusText = document.getElementById('status');

// 1. Register Service Worker for Offline/Cache Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Offline Engine Ready'))
            .catch(err => console.log('Offline Engine Failed', err));
    });
}

// 2. Fetch Music List from GitHub API
async function loadLibrary() {
    // API URL to get folder contents
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FOLDER_NAME}`;
    
    statusText.textContent = "Loading library...";

    try {
        const response = await fetch(url);
        const data = await response.json();

        // DEBUG: See what GitHub is actually sending back in the F12 Console
        console.log("GitHub Response:", data);

        if (!Array.isArray(data)) {
            statusText.textContent = "Error: Folder Not Found";
            trackTitle.textContent = "Check if folder name is exactly '" + FOLDER_NAME + "'";
            return;
        }

        // Filter for FLAC files (case-insensitive)
        const flacs = data.filter(file => 
            file.name.toLowerCase().endsWith('.flac')
        );

        if (flacs.length === 0) {
            statusText.textContent = "Empty Library";
            trackTitle.textContent = "No .flac files found in /" + FOLDER_NAME;
            return;
        }

        // Clear playlist and build list
        playlistUI.innerHTML = "";
        flacs.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.name.replace(/\.[^/.]+$/, ""); // Removes extension
            li.onclick = () => playTrack(file.download_url, li);
            playlistUI.appendChild(li);
        });

        statusText.textContent = `${flacs.length} Tracks Loaded (Lossless)`;

    } catch (error) {
        console.error("API Error:", error);
        statusText.textContent = "Connection Error";
    }
}

// 3. Playback Logic
function playTrack(url, element) {
    // UI Update
    document.querySelectorAll('li').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    trackTitle.textContent = element.textContent;

    // Audio Update
    audio.src = url;
    audio.play();

    // Lock Screen / Media Notification
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: element.textContent,
            artist: 'My Lossless Library',
            album: 'FLAC Collection'
        });
    }
}

// 4. Handle auto-play next track
audio.onended = () => {
    const active = document.querySelector('li.active');
    if (active && active.nextElementSibling) {
        active.nextElementSibling.click();
    }
};

// Initialize
loadLibrary();
