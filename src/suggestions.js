// suggestions.js

// Define business sectors and their corresponding questions
const sectors = {
    bank: [
        'How can I open an account?',
        'What is the interest rate for savings?',
        'How can I apply for a loan?',
        'How to check my account balance?',
        'What are your latest offers?'
    ],
    ticketBooking: [
        'How can I book a flight ticket?',
        'What are the available flights for New York?',
        'Can I change my booking date?',
        'How do I cancel my ticket?',
        'Do you offer student discounts?'
    ],
    customerService: [
        'What is your return policy?',
        'How do I get a refund?',
        'What are your operating hours?',
        'How can I contact customer support?',
        'Do you offer warranty services?'
    ],
    callCenter: [
        'How can I reach your call center?',
        'What is the average wait time?',
        'Can I talk to a supervisor?',
        'How do I resolve my issue?',
        'Do you provide 24/7 support?'
    ]
};

// List of sectors to suggest
const sectorList = Object.keys(sectors);

// Function to display suggestions based on input
function showSuggestions(inputText) {
    const suggestionsBox = document.getElementById('suggestions-box');
    suggestionsBox.innerHTML = ''; // Clear previous suggestions

    if (inputText) {
        // Find matching sectors based on the typed input
        const matchedSectors = sectorList.filter((sector) =>
            sector.startsWith(inputText.toLowerCase())
        );

        matchedSectors.forEach((sector) => {
            // Create suggestion items for each sector
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.innerText = sector;
            suggestionItem.addEventListener('click', () => {
                // When a sector is clicked, fill the input with the sector
                messageInput.value = sector;
                showQuestions(sector);  // Show relevant questions for the sector
                suggestionsBox.innerHTML = '';  // Clear suggestions after selection
            });
            suggestionsBox.appendChild(suggestionItem);
        });
    }
}

// Function to show questions based on the selected sector
function showQuestions(sector) {
    const chatBox = document.getElementById('chat-box');
    const questions = sectors[sector];

    // Clear the chat box and display questions
    chatBox.innerHTML = '';
    const systemMessage = document.createElement('div');
    systemMessage.classList.add('message', 'system');
    systemMessage.innerText = `Please select a question related to "${sector}":`;
    chatBox.appendChild(systemMessage);

    questions.forEach((question) => {
        const questionItem = document.createElement('div');
        questionItem.classList.add('message', 'system');
        questionItem.innerText = question;
        questionItem.addEventListener('click', () => {
            // When a question is selected, display dynamic response
            dynamicResponse(question);
        });
        chatBox.appendChild(questionItem);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to provide dynamic responses based on selected question
function dynamicResponse(question) {
    let response = '';

    // Check for matching questions and provide relevant responses
    if (question === 'How can I open an account?') {
        response = 'To open an account, please visit our nearest branch or apply online on our website.';
    } else if (question === 'What is the interest rate for savings?') {
        response = 'Our current interest rate for savings is 4.5% annually.';
    } else if (question === 'How can I apply for a loan?') {
        response = 'You can apply for a loan online on our website or by visiting our branch.';
    } else if (question === 'How to check my account balance?') {
        response = 'You can check your account balance through our mobile app or by visiting an ATM.';
    } else if (question === 'What are your latest offers?') {
        response = 'We have various offers for new account holders, such as zero fees for the first 6 months.';
    } else if (question === 'How can I book a flight ticket?') {
        response = 'You can book a flight ticket directly through our website or by calling customer support.';
    } else if (question === 'What are the available flights for New York?') {
        response = 'We have flights available for New York from various airlines. Please check our website for availability.';
    } else if (question === 'Can I change my booking date?') {
        response = 'Yes, you can change your booking date by contacting customer support at least 48 hours before departure.';
    } else if (question === 'How do I cancel my ticket?') {
        response = 'You can cancel your ticket from the booking section on the website or contact our support team for assistance.';
    } else if (question === 'Do you offer student discounts?') {
        response = 'Yes, we offer student discounts. Please provide your student ID while booking to avail the offer.';
    } else if (question === 'What is your return policy?') {
        response = 'We offer a 30-day return policy on most items. Please check our website for specific product return details.';
    } else if (question === 'How do I get a refund?') {
        response = 'To get a refund, please return the product and provide proof of purchase within 30 days.';
    } else if (question === 'What are your operating hours?') {
        response = 'Our operating hours are from 9 AM to 6 PM, Monday to Friday.';
    } else if (question === 'How can I contact customer support?') {
        response = 'You can contact customer support through our website, phone number, or live chat.';
    } else if (question === 'Do you offer warranty services?') {
        response = 'Yes, we offer a 1-year warranty on most of our products. Please check the product page for warranty details.';
    } else if (question === 'How can I reach your call center?') {
        response = 'You can reach our call center by dialing 1-800-123-4567 during working hours.';
    } else if (question === 'What is the average wait time?') {
        response = 'The average wait time is currently 3-5 minutes. We appreciate your patience!';
    } else if (question === 'Can I talk to a supervisor?') {
        response = 'Yes, you can request to speak to a supervisor by asking our agent during the call.';
    } else if (question === 'How do I resolve my issue?') {
        response = 'Please provide more details about your issue, and our agent will assist you in resolving it.';
    } else if (question === 'Do you provide 24/7 support?') {
        response = 'Yes, our support team is available 24/7 for urgent issues.';
    } else {
        response = 'I am sorry, I did not understand your question. Could you please rephrase it?';
    }

    // Display dynamic response in the chat box
    const dynamicResponseElement = document.createElement('div');
    dynamicResponseElement.classList.add('message', 'system');
    dynamicResponseElement.innerText = `Agent: ${response}`;
    document.getElementById('chat-box').appendChild(dynamicResponseElement);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

// Add an event listener to the message input to show suggestions as the user types
// const messageInput = document.getElementById('message-input');
messageInput.addEventListener('input', (e) => {
    const inputText = e.target.value;
    showSuggestions(inputText);
});

// Function to send the message (called when a suggestion is clicked or the user sends a message)
function sendMessage(message) {
    const recipient = document.getElementById('recipient-input').value.trim();
    if (recipient) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sender');
        messageElement.innerText = `${senderPhoneNumber}: ${message}`;
        document.getElementById('chat-box').appendChild(messageElement);
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;

        // Send the message via socket
        socket.emit('chatMessage', { to: recipient, msg: message, from: senderPhoneNumber });
    }
}

// Listen for chat messages and provide dynamic responses
socket.on('chatMessage', ({ from, to, msg }) => {
    if (to === senderPhoneNumber) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'receiver');
        messageElement.innerText = `${from}: ${msg}`;
        document.getElementById('chat-box').appendChild(messageElement);
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;

        // If the message is a question, provide a dynamic response
        dynamicResponse(msg);
    }
});
