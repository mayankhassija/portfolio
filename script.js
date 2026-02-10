const GITHUB_USER = 'mayankhassija';
const REPO_NAME = 'portfolio';
const audio = document.getElementById('audio-player');
const playlistUI = document.getElementById('playlist');
const trackTitle = document.getElementById('track-title');

// 1. Register Service Worker for Offline Support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// 2. Fetch Music List from GitHub API
async function loadLibrary() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/Music`;
    try {
        const response = await fetch(url);
        const files = await response.json();
        
        const flacs = files.filter(file => file.name.endsWith('.flac'));
        
        flacs.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.name.replace('.flac', '');
            li.onclick = () => playTrack(file.download_url, li);
            playlistUI.appendChild(li);
        });
    } catch (e) {
        console.error("Failed to load library", e);
    }
}

function playTrack(url, element) {
    document.querySelectorAll('li').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    trackTitle.textContent = element.textContent;
    
    audio.src = url;
    audio.play();
    
    // Media Session API (Shows info on Lock Screen)
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: element.textContent,
            artist: 'My FLAC Library'
        });
    }
}

loadLibrary();
