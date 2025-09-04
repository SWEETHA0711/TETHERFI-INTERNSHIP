const socket = io();

const registerBtn = document.getElementById('register-btn');
const phoneNumberInput = document.getElementById('phone-number');
const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const recipientInput = document.getElementById('recipient-input');



let chatMessages = []; // To store the chat messages
let senderPhoneNumber = null; // Initialize sender phone number

// Register user with their phone number
registerBtn.addEventListener('click', () => {
    isChatActive = true;
    const phoneNumber = phoneNumberInput.value.trim();
    if (phoneNumber) {
        senderPhoneNumber = phoneNumber;
        socket.emit('register', phoneNumber);
        alert(`Registered as ${phoneNumber}`);
        if(phoneNumber!='Agent'){
            // const chatPrompt = document.createElement('div');
            chatPrompt.classList.add('message', 'system', 'fade-in');
            // chatPrompt.innerHTML = "Do you want to continue in English? Please give your input by head gestures.</br>i)Nodding head to continue in English.</br>ii)Shake head to change the language";
            document.getElementById('chat-box').appendChild(chatPrompt);
           

        }
    } else {
        alert('Please enter a valid phone number!');
    }
});

// Handle chat form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isChatActive) {
        alert('Please register before starting a chat.');
        return;
    }

    const msg = messageInput.value.trim();
    const recipient = recipientInput.value.trim();

    if (msg && recipient) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sender');
        messageElement.innerText = `${senderPhoneNumber}: ${msg}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        socket.emit('chatMessage', { to: recipient, msg, from: senderPhoneNumber });
        chatMessages.push(msg);
        messageInput.value = '';
        // recipientInput.value = '';
        messageInput.focus();
    } else {
        alert('Please enter a message and recipient!');
    }
});

// Listen for chat messages and display them based on recipient name match
socket.on('chatMessage', ({ from, to, msg }) => {
    if (to === senderPhoneNumber) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'receiver');
        messageElement.innerText = `${from}: ${msg}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

