

// window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// if (window.SpeechRecognition) {
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false; // Only finalize results
//     recognition.continuous = false; // Stop after speaking

//     const micIcon = document.getElementById('mic-icon');
//     const messageInput = document.getElementById('message-input');

//     micIcon.addEventListener('click', () => {
//         recognition.start();
//         micIcon.classList.add('listening'); // Add a visual effect
//     });

//     recognition.addEventListener('start', () => {
//         console.log('Speech recognition started...');
//         micIcon.classList.add('listening'); // Keep pulsing and red while listening
//     });

//     recognition.addEventListener('result', (event) => {
//         const transcript = event.results[0][0].transcript.trim();
//         console.log('Speech recognized:', transcript);
//         messageInput.value = transcript; // Append recognized text to message input
//     });

//     recognition.addEventListener('end', () => {
//         console.log('Speech recognition ended.');
//         micIcon.classList.remove('listening'); // Stop pulsing and reset color
//     });

//     recognition.addEventListener('error', (event) => {
//         console.error('Speech recognition error:', event.error);
//         alert('Error in speech recognition: ' + event.error);
//         micIcon.classList.remove('listening'); // Stop pulsing and reset color on error
//     });
// } else {
//     alert('Speech Recognition API not supported in your browser.');
// }


// Check if the browser supports the Speech Recognition and Speech Synthesis APIs
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.speechSynthesis = window.speechSynthesis || null;

if (window.SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Only finalize results
    recognition.continuous = false; // Stop after speaking

    const micIcon = document.getElementById('mic-icon');
    const messageInput = document.getElementById('message-input');

    micIcon.addEventListener('click', () => {
        recognition.start();
        micIcon.classList.add('listening'); // Add a visual effect
    });

    recognition.addEventListener('start', () => {
        console.log('Speech recognition started...');
        micIcon.classList.add('listening'); // Keep pulsing and red while listening
    });

    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log('Speech recognized:', transcript);
        messageInput.value = transcript; // Append recognized text to message input
        
        // Provide voice feedback using Speech Synthesis
        speak(`You said: ${transcript}`);
    });

    recognition.addEventListener('end', () => {
        console.log('Speech recognition ended.');
        micIcon.classList.remove('listening'); // Stop pulsing and reset color
    });

    recognition.addEventListener('error', (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Error in speech recognition: ' + event.error);
        micIcon.classList.remove('listening'); // Stop pulsing and reset color on error

        // Provide error feedback using Speech Synthesis
        speak('There was an error in recognizing your speech. Please try again.');
    });
} else {
    alert('Speech Recognition API not supported in your browser.');
    speak('Speech recognition is not supported in your browser. Please use a compatible browser.');
}

// Function to handle speech synthesis
function speak(text) {
    if (!window.speechSynthesis) {
        console.warn('Speech Synthesis API not supported in this browser.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
        console.log('Speech synthesis started...');
    };

    utterance.onend = () => {
        console.log('Speech synthesis finished.');
    };

    utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
    };

    window.speechSynthesis.speak(utterance);
}
