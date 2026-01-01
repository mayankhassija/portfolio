const projects = [
    { name: 'Pong Game', url: '../pongame/index.html' },
    { name: 'NCERT Downloader', url: '../NCERT-Textbook-Downloader/index.html' },
];

const iframe = document.getElementById('tv-iframe');
const buttonsContainer = document.querySelector('.remote-buttons-grid');
let currentIndex = 0;
let autoInterval;
let isUserInteracted = false;

function renderButtons() {
    buttonsContainer.innerHTML = '';
    projects.forEach((proj, index) => {
        const btn = document.createElement('button');
        btn.className = 'remote-btn';
        btn.textContent = proj.name;
        btn.onclick = () => {
            loadProject(index);
            stopAutoPlay();
        };
        buttonsContainer.appendChild(btn);
    });
}

function loadProject(index) {
    currentIndex = index;
    const project = projects[index];

    // Fade effect
    iframe.style.opacity = '0';
    setTimeout(() => {
        iframe.src = project.url;

        iframe.onload = () => {
            iframe.style.opacity = '1';

            // Try to inject styles to hide scrollbars and focus for games
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const style = doc.createElement('style');
                if (project.name === 'Pong Game') {
                    style.textContent = `
                        body { overflow: hidden; }
                        /* Hide scrollbar for Chrome/Safari/Opera */
                        ::-webkit-scrollbar { display: none; }
                        /* Hide scrollbar for IE, Edge and Firefox */
                        body { -ms-overflow-style: none;  scrollbar-width: none; }
                    `;
                } else {
                    // For other projects like NCERT Downloader, allow scrolling
                    style.textContent = `
                        body { overflow: auto; }
                    `;
                }
                doc.head.appendChild(style);

                // Focus for game controls
                iframe.contentWindow.focus();
                iframe.contentWindow.addEventListener('click', () => iframe.contentWindow.focus());
            } catch (e) {
                console.log('Could not inject styles (likely cross-origin restriction if on different domains):', e);
            }
        };
        // Fallback fade in if onload is delayed
        setTimeout(() => iframe.style.opacity = '1', 1000); // Increased timeout for load
    }, 200);

    // Update buttons
    const btns = document.querySelectorAll('.remote-btn');
    btns.forEach((btn, i) => {
        if (i === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function startAutoPlay() {
    if (autoInterval) clearInterval(autoInterval);

    autoInterval = setInterval(() => {
        if (!isUserInteracted) {
            let nextIndex = (currentIndex + 1) % projects.length;
            loadProject(nextIndex);
        }
    }, 5000);
}

function stopAutoPlay() {
    isUserInteracted = true;
    clearInterval(autoInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    renderButtons();
    loadProject(0);
    // startAutoPlay(); // Disabled as per user request
});
