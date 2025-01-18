const display = document.getElementById('display');
const clickSound = new Audio('./sfx/keystroke.wav');
const backgroundMusic = new Audio('./sfx/ethereal.wav');
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.20; // Lower the volume to 20%

// Function to reset the background music before it ends
function resetBackgroundMusicNearEnd() {
    if (backgroundMusic.currentTime >= backgroundMusic.duration - 34) {
        backgroundMusic.currentTime = 0; // Reset to the beginning for the next loop
        backgroundMusic.play();
    }
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
        display.appendChild(span);
        clickSound.play(); // Play the clicking sound
        fadeOutCharacter(span); // Each character fades out individually
    } else if (event.key === 'Backspace') {
        if (display.lastChild) {
            display.removeChild(display.lastChild);
        }
    } else if (event.key === 'Enter') {
        const words = display.textContent.split(' ');
        const lastWord = words[words.length - 1];
        const spans = display.querySelectorAll('span');
        let wordStartIndex = spans.length - lastWord.length;
        for (let i = wordStartIndex; i < spans.length; i++) {
            spans[i].style.color = 'red';
            fadeOutCharacter(spans[i], true);
        }
    }
});

function fadeOutCharacter(span, isRedWord = false) {
    const fadeOutTime = isRedWord ? 2000 : 1000; // Double the time for red words
    setTimeout(() => {
        span.classList.add('fade-out');
        setTimeout(() => {
            span.remove();
        }, fadeOutTime); // Remove span after fade-out animation
    }, 4000 + display.children.length * 100); // Delay based on position
}