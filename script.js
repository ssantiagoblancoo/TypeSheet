const display = document.getElementById('display');

document.addEventListener('keydown', (event) => {
    if (event.key.length === 1) { // Only process printable characters
        const span = document.createElement('span'); // Gives every character its own span to allow character animations
        span.textContent = event.key;
        display.appendChild(span);
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

function fadeOutCharacter(span) {
    setTimeout(() => {
        span.classList.add('fade-out');
        setTimeout(() => {
            span.remove();
        }, 2000); // Remove span after fade-out animation (2 seconds)
    }, 4000 + display.children.length * 100); // Delay based on position
}