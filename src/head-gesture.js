


const startHeadGestureBtn = document.getElementById('start-head-gesture-btn');
let headModel, headVideo, headCanvas, headContext, headStream;
let gestureSent = false; // Flag to track if gesture message is sent
let nosePositions = []; // Array to store nose position history

// Load the BlazePose model for head gesture detection
async function loadHeadGestureModel() {
    headModel = await posenet.load();
    console.log('Head Gesture Model Loaded');

    const headVideoContainer = createHeadWebcamOverlay();

    headVideo = document.createElement('video');
    headVideo.width = 640;
    headVideo.height = 480;
    headVideoContainer.appendChild(headVideo);

    headCanvas = document.createElement('canvas');
    headCanvas.width = headVideo.width;
    headCanvas.height = headVideo.height;
    headContext = headCanvas.getContext('2d');
    headVideoContainer.appendChild(headCanvas);

    // Access the webcam
    headStream = await navigator.mediaDevices.getUserMedia({ video: true });
    headVideo.srcObject = headStream;
    headVideo.play();

    detectHeadGestures();
}

// Create a separate webcam overlay for head gestures
function createHeadWebcamOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'head-webcam-overlay';
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

// Function to detect head gestures (nodding and shaking)
async function detectHeadGestures() {
    const interval = setInterval(async () => {
        if (gestureSent) {
            clearInterval(interval);
            return;
        }

        headContext.drawImage(headVideo, 0, 0, headVideo.width, headVideo.height);

        const predictions = await headModel.estimateSinglePose(headVideo, {
            flipHorizontal: false,
        });

        if (predictions.keypoints && predictions.keypoints.length > 0) {
            const nose = predictions.keypoints.find(point => point.part === 'nose');
            if (!nose) return;

            // Add current nose position to history
            nosePositions.push({ x: nose.position.x, y: nose.position.y });
            if (nosePositions.length > 10) nosePositions.shift(); // Keep the last 10 positions

            // Check for gestures
            if (isNodding() && !gestureSent) {
                console.log("Nodding head detected (Continue in English)");
                socket.emit('gestureMessage', { to: recipientInput.value, from: senderPhoneNumber, gesture: 'Nodding head detected (Continue in English)' });
                gestureSent = true;
                stopHeadWebcam();
            } else if (isShaking() && !gestureSent) {
                console.log("Shaking head detected (Change language)");
                socket.emit('gestureMessage', { to: recipientInput.value, from: senderPhoneNumber, gesture: 'Shaking head detected (Change language)' });
                gestureSent = true;
                stopHeadWebcam();
            }
        }
    }, 100);
}

// Check for nodding gesture (consistent vertical movement)
function isNodding() {
    const yPositions = nosePositions.map(pos => pos.y);
    const minY = Math.min(...yPositions);
    const maxY = Math.max(...yPositions);

    return maxY - minY > 20; // Threshold for vertical movement
}

// Check for shaking gesture (consistent horizontal movement)
function isShaking() {
    const xPositions = nosePositions.map(pos => pos.x);
    const minX = Math.min(...xPositions);
    const maxX = Math.max(...xPositions);

    return maxX - minX > 20; // Threshold for horizontal movement
}

// Stop webcam and remove overlay after a delay
function stopHeadWebcam() {
    console.log('Gesture detected. Stopping webcam in 2 seconds...');

    setTimeout(() => {
        if (headStream) {
            const tracks = headStream.getTracks();
            tracks.forEach(track => track.stop());
        }
        headVideo.srcObject = null;

        const overlay = document.getElementById('head-webcam-overlay');
        if (overlay) overlay.remove();

        console.log('Webcam stopped');
    }, 1000); // 2-second delay before stopping the webcam
}


// Start head gesture detection when the button is clicked
startHeadGestureBtn.addEventListener('click', () => {
    gestureSent = false; // Reset the flag when starting detection
    nosePositions = []; // Clear the history
    loadHeadGestureModel();
});
