const ocrOutput = document.getElementById('ocr-output');
const ocrInput = document.getElementById('ocr-input');
function openWebcam() {
    const webcam = document.getElementById('webcam');
    const webcamContainer = document.getElementById('webcam-container');
    const outlineBox = document.getElementById('outline-box');
    const captureBtn = document.getElementById('capture-btn');

    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            webcam.style.display = 'block'; // Show the webcam feed
            webcamContainer.style.display = 'flex'; // Display the webcam container
            outlineBox.style.display = 'block'; // Show the outline box
            captureBtn.style.display = 'block'; // Display the capture button
            webcam.srcObject = stream; // Stream the video feed to the webcam element
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
            alert('Unable to access the webcam. Please check permissions or use a supported browser.');
        });
}
function captureImage() {
    const webcam = document.getElementById('webcam');
    const canvas = document.getElementById('webcam-canvas');
    const context = canvas.getContext('2d');
    const outlineBox = document.getElementById('outline-box');
    const captureBtn = document.getElementById('capture-btn');
    const dataType = document.getElementById('data-type').value;

    // Set canvas dimensions to match video stream
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;

    // Draw the current frame from the webcam to the canvas
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);

    // Apply preprocessing (grayscale and thresholding)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale and apply thresholding
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const enhanced = avg > 128 ? 255 : 0; // Threshold at 128
        data[i] = enhanced;      // Red
        data[i + 1] = enhanced;  // Green
        data[i + 2] = enhanced;  // Blue
    }
    context.putImageData(imageData, 0, 0);

    // Convert canvas to Blob for OCR
    canvas.toBlob((blob) => {
        Tesseract.recognize(
            blob,
            'eng',
            { logger: (m) => console.log(m) } // Optional logging
        ).then(({ data: { text } }) => {
            console.log('Raw OCR Output:', text); // Debugging step

            // Normalize OCR text to fix common misreads
            const normalizedText = normalizeOCRText(text);

            // Filter extracted text based on selected data type
            const filteredText = filterTextByType(normalizedText, dataType);

            // Add confirmation step in the chatbox
            const chatBox = document.getElementById('chat-box');

            if (filteredText === 'No valid 16-digit number found') {
                alert('Could not find a valid 16-digit number. Please try again.');
            } else {
                // Display the OCR result in the chatbox
                const ocrMessage = document.createElement('div');
                ocrMessage.classList.add('message', 'ocr');
                ocrMessage.innerText = `OCR Output (${dataType}): ${filteredText}`;
                chatBox.appendChild(ocrMessage);

                // Ask for confirmation in the chatbox
                const confirmationMessage = document.createElement('div');
                confirmationMessage.classList.add('message', 'confirmation');
                confirmationMessage.innerHTML = `
                    Are you sure you want to send this data to the agent? 
                    <button id="confirm-send">Yes</button>
                    <button id="cancel-send">No</button>
                `;
                chatBox.appendChild(confirmationMessage);
                chatBox.scrollTop = chatBox.scrollHeight;

                // Add event listeners for confirmation buttons
                document.getElementById('confirm-send').addEventListener('click', () => {
                    const recipient = document.getElementById('recipient-input').value;
                    const senderPhoneNumber = document.getElementById('phone-number').value;

                    // Send the message via socket
                    socket.emit('ocrMessage', { to: recipient, from: senderPhoneNumber, text: filteredText });

                    // Notify the user in the chatbox
                    const sentMessage = document.createElement('div');
                    sentMessage.classList.add('message', 'sent');
                    sentMessage.innerText = 'Data has been sent successfully.';
                    chatBox.appendChild(sentMessage);
                    chatBox.scrollTop = chatBox.scrollHeight;

                    // Remove confirmation buttons
                    confirmationMessage.remove();
                });

                document.getElementById('cancel-send').addEventListener('click', () => {
                    // Notify the user that the data was not sent
                    const cancelMessage = document.createElement('div');
                    cancelMessage.classList.add('message', 'cancel');
                    cancelMessage.innerText = 'Data was not sent.';
                    chatBox.appendChild(cancelMessage);
                    chatBox.scrollTop = chatBox.scrollHeight;

                    // Remove confirmation buttons
                    confirmationMessage.remove();
                });
            }
        });
    }, 'image/jpeg');

    // Stop webcam stream
    const stream = webcam.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    // Hide webcam and capture button
    webcam.style.display = 'none';
    // outlineBox.style.display = 'none';
    document.getElementById('capture-btn').style.display = 'none';
}


function filterTextByType(text, type) {
    let filteredText;
    switch (type) {
        case 'textonly':
            filteredText = text.replace(/[^a-zA-Z\s]/g, ''); // Remove everything except letters
            break;
        case 'numberonly':
            filteredText = text.replace(/[^0-9]/g, ''); // Remove everything except numbers
            break;
        case 'card16':
            // Normalize the text by removing unnecessary line breaks or extra spaces
            const sanitizedText = text.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with single space
            // Match exactly 16 consecutive digits or groups of 4 separated by spaces/dashes
            const cardMatch = sanitizedText.match(/(?:\d{4}[ -]?){3}\d{4}/);
            filteredText = cardMatch ? cardMatch[0].replace(/[ -]/g, '') : 'No valid 16-digit number found';
            break;
        case 'alphanumeric':
            filteredText = text.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special characters
            break;
        default:
            filteredText = text; // Default case, return original text
    }
    return filteredText;
}

function normalizeOCRText(text) {
    return text.replace(/O/g, 'O') 
               .replace(/I/g, 'I') 
               .replace(/l/g, 'l') 
               .replace(/S/g, 'S'); 
}

