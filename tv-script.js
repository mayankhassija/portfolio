const projects = [
    { name: 'Pong Game', url: 'https://mayankhassija.github.io/pongame/' },
    { name: 'NCERT Downloader', url: 'https://mayankhassija.github.io/NCERT-Textbook-Downloader/' },
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
        };
        // Fallback
        setTimeout(() => iframe.style.opacity = '1', 500);
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
    startAutoPlay();
});
