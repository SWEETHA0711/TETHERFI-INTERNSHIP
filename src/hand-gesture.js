const startGestureBtn = document.getElementById('start-gesture-btn');
// const stopGestureBtn = document.getElementById('stop-gesture-btn');
const gestureOutput = document.getElementById('gesture-output');
let isGestureCaptured = false;
let model, video, canvas, context, stream;

async function loadGestureModel() {
    model = await handpose.load();
    console.log('Hand Gesture Model Loaded');

    const videoContainer = createWebcamOverlay();

    video = document.createElement('video');
    video.width = 640;
    video.height = 480;
    videoContainer.appendChild(video);

    canvas = document.createElement('canvas');
    canvas.width = video.width;
    canvas.height = video.height;
    context = canvas.getContext('2d');
    videoContainer.appendChild(canvas);

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();

    detectGesture();
}

function createWebcamOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'webcam-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const videoContainer = document.createElement('div');
    videoContainer.style.position = 'relative';
    videoContainer.style.width = '640px';
    videoContainer.style.height = '480px';
    videoContainer.style.backgroundColor = '#000';

    overlay.appendChild(videoContainer);
    document.body.appendChild(overlay);

    return videoContainer;
}

async function detectGesture() {
    if (isGestureCaptured) return;

    const interval = setInterval(async () => {
        context.drawImage(video, 0, 0, video.width, video.height);

        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const hand = predictions[0];

            const thumbTip = hand.landmarks[4];
            const thumbBase = hand.landmarks[2];
            const indexTip = hand.landmarks[8];
            const indexBase = hand.landmarks[5];

            const thumbUp = thumbTip[1] < thumbBase[1];
            const thumbDown = thumbTip[1] > thumbBase[1];
            const indexUp = indexTip[1] < indexBase[1];
            const indexDown = indexTip[1] > indexBase[1];

            if (thumbUp && indexUp) {
                // gestureOutput.innerText = 'Thumbs Up';
                socket.emit('gestureMessage', { to: recipientInput.value, from: senderPhoneNumber, gesture: '👍Thumbs Up' });

                clearInterval(interval);
                isGestureCaptured = true;
                stopWebcam();
            } else if (thumbDown && indexDown) {
                // gestureOutput.innerText = 'Thumbs Down';
                socket.emit('gestureMessage', { to: recipientInput.value, from: senderPhoneNumber, gesture: '👎Thumbs Down' });


                clearInterval(interval);
                isGestureCaptured = true;
                stopWebcam();
            } else {
                gestureOutput.innerText = ''; // No valid gesture detected
            }
        }
    }, 100);
}

function stopWebcam() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
    }
    video.srcObject = null;

    const overlay = document.getElementById('webcam-overlay');
    if (overlay) overlay.remove();

    console.log('Webcam stopped');
}

startGestureBtn.addEventListener('click', () => {
    isGestureCaptured = false;
    loadGestureModel();
});









