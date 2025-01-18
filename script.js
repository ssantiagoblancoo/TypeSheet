const display = document.getElementById('display');
const clickSound = new Audio('./sfx/keystroke.wav');
const backgroundMusic = new Audio('./sfx/ethereal.wav');
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.20; // Lower the volume to 20%

const settingsPopup = document.getElementById('settings-popup');
const closePopupButton = document.getElementById('close-popup');
const wpmDisplay = document.getElementById('wpm-display');
wpmDisplay.classList.add('wpm-glow'); // Add glow effect to WPM display

let typedWord = '';
let wordCount = 0;
let startTime = null;
let lastTypedTime = null;
let currentWpm = 0;
let targetWpm = 0;

// Function to reset the background music before it ends
function resetBackgroundMusicNearEnd() {
    if (backgroundMusic.currentTime >= backgroundMusic.duration - 20) {
        backgroundMusic.currentTime = 0; // Reset to the beginning for the next loop
        backgroundMusic.play();
    }
}

// Function to smoothly update the WPM display
function updateWpmDisplay() {
    const updateInterval = setInterval(() => {
        if (currentWpm < targetWpm) {
            currentWpm += 1;
            if (currentWpm > targetWpm) currentWpm = targetWpm;
        } else if (currentWpm > targetWpm) {
            currentWpm -= 1;
            if (currentWpm < targetWpm) currentWpm = targetWpm;
        } else {
            clearInterval(updateInterval);
        }
        wpmDisplay.textContent = `${Math.round(currentWpm)} WPM`;
    }, 100); // Update every 100 milliseconds
}

// Start playing the background music once first character is typed
document.addEventListener('keydown', () => {
    backgroundMusic.play();
    backgroundMusic.addEventListener('timeupdate', resetBackgroundMusicNearEnd);
}, { once: true });

document.addEventListener('keydown', (event) => {
    if (event.key.length === 1) { // Only process printable characters
        const span = document.createElement('span'); // Gives every character its own span to allow character animations
        span.textContent = event.key;
        span.classList.add('glow'); // Add glow effect
        display.appendChild(span);
        clickSound.play(); // Play the clicking sound
        fadeOutCharacter(span); // Each character fades out individually

        typedWord += event.key;
        if (typedWord.endsWith('settings')) {
            settingsPopup.style.display = 'block';
        }

        if (event.key === ' ') {
            wordCount++;
            if (!startTime) {
                startTime = new Date().getTime();
            }
            lastTypedTime = new Date().getTime();
            const elapsedTime = (lastTypedTime - startTime) / 60000; // Time in minutes
            targetWpm = Math.round(wordCount / elapsedTime);
            updateWpmDisplay();
        }
    } else if (event.key === 'Backspace') {
        if (display.lastChild) {
            display.removeChild(display.lastChild);
        }
        typedWord = typedWord.slice(0, -1);
    } else if (event.key === 'Enter') {
        const words = display.textContent.split(' ');
        const lastWord = words[words.length - 1];
        const spans = display.querySelectorAll('span');
        let wordStartIndex = spans.length - lastWord.length;
        for (let i = wordStartIndex; i < spans.length; i++) {
            spans[i].style.color = 'red';
            spans[i].classList.add('red-glow'); // Add red glow effect
            fadeOutCharacter(spans[i], true);
        }
    }
});

closePopupButton.addEventListener('click', () => {
    settingsPopup.style.display = 'none';
});

// Update WPM display every second
setInterval(() => {
    if (startTime) {
        const currentTime = new Date().getTime();
        const elapsedTimeSinceLastType = (currentTime - lastTypedTime) / 1000; // Time in seconds
        if (elapsedTimeSinceLastType > 1) {
            targetWpm = 0;
            updateWpmDisplay();
        }
    }
}, 1000);

function fadeOutCharacter(span, isRedWord = false) {
    const fadeOutTime = isRedWord ? 2000 : 1000; // Double the time for red words
    setTimeout(() => {
        span.classList.add('fade-out');
        setTimeout(() => {
            span.remove();
        }, fadeOutTime); // Remove span after fade-out animation
    }, 4000 + display.children.length * 100); // Delay based on position
}