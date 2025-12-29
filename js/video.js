export function playCelebrationVideo() {
    const video = document.createElement('video');
    video.src = '../video/celebration.mp4';
    video.muted = true;
    video.playsInline = true;

    const displayCanvas = document.createElement('canvas');
    const ctx = displayCanvas.getContext('2d', { willReadFrequently: true });

    displayCanvas.style.position = 'fixed';
    displayCanvas.style.top = '0';
    displayCanvas.style.left = '0';
    displayCanvas.style.width = '100vw';
    displayCanvas.style.height = '100vh';
    
    displayCanvas.style.zIndex = '10001'; 
    displayCanvas.style.pointerEvents = 'none'; 

    let isRunning = true;
    const stopEverything = () => {
        isRunning = false;
        if (displayCanvas.parentNode) displayCanvas.remove();
        if (video.parentNode) video.remove();
        video.pause();
    };

    video.onloadedmetadata = () => {
        video.currentTime = 2; 
        displayCanvas.width = video.videoWidth;
        displayCanvas.height = video.videoHeight;
        document.body.appendChild(displayCanvas);
        video.play();
    };

    function processFrame() {
        if (!isRunning || video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, displayCanvas.width, displayCanvas.height);
        const frame = ctx.getImageData(0, 0, displayCanvas.width, displayCanvas.height);
        const data = frame.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i+0], g = data[i+1], b = data[i+2];
            if (g > 100 && g > r * 1.2 && g > b * 1.2) data[i + 3] = 0; 
        }
        ctx.putImageData(frame, 0, 0);
        requestAnimationFrame(processFrame);
    }
    video.onplay = processFrame;

    return stopEverything;
}