const endChatBtn = document.getElementById('end-chat-btn');
let isChatActive = false;

endChatBtn.addEventListener('click', () => {
    if (!isChatActive) {
        return; // Do nothing if there's no active chat
    }

    if (chatMessages.length > 0) {
        socket.emit('endChat', { messages: chatMessages });
        // Clear chat messages in memory
        chatMessages = []; 

        // Append a 'Chat Ended Successfully' message to the chatbox
        const endChatMessage = document.createElement('div');
        endChatMessage.classList.add('message', 'system');
        endChatMessage.innerText = 'Chat Ended Successfully';
        chatBox.appendChild(endChatMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        // Handle case when there are no messages to end
        const noMessagesMessage = document.createElement('div');
        noMessagesMessage.classList.add('message', 'system');
        noMessagesMessage.innerText = 'No messages to analyze!';
        chatBox.appendChild(noMessagesMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Reset chat state and disable input fields
    isChatActive = false;
    senderPhoneNumber = null;
});



// Handle End Chat button click
endChatBtn.addEventListener('click', () => {
    if (!isChatActive) {
        return; // Do nothing if there's no active chat
    }

    if (chatMessages.length > 0) {
        socket.emit('endChat', { messages: chatMessages });
        // Clear chat messages in memory
        chatMessages = []; 

        // Append a 'Chat Ended Successfully' message to the chatbox
        const endChatMessage = document.createElement('div');
        endChatMessage.classList.add('message', 'system');
        endChatMessage.innerText = 'Chat Ended Successfully';
        chatBox.appendChild(endChatMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        // Handle case when there are no messages to end
        const noMessagesMessage = document.createElement('div');
        noMessagesMessage.classList.add('message', 'system');
        noMessagesMessage.innerText = 'No messages to analyze!';
        chatBox.appendChild(noMessagesMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Reset chat state and disable input fields
    isChatActive = false;
    senderPhoneNumber = null;
 
});

socket.on('sentimentAnalysisResult', (result) => {
    // Create a new div for sentiment analysis result message
    const sentimentMessageElement = document.createElement('div');
    sentimentMessageElement.classList.add('message', 'sentiment-analysis');

    // Set color based on sentiment
    let sentimentColor = '';

    if (result.sentiment === 'positive') {
        sentimentColor = 'green'; // Positive sentiment color
    } else if (result.sentiment === 'negative') {
        sentimentColor = 'red'; // Negative sentiment color
    } else if (result.sentiment === 'neutral') {
        sentimentColor = 'gray'; // Neutral sentiment color
    }

    // Add sentiment analysis result to the message element
    sentimentMessageElement.innerHTML = `
        <strong>Sentiment Analysis Results:</strong><br>
        Overall Sentiment: <span style="color: ${sentimentColor};">${result.sentiment} ${result.emoji}</span><br>
        Positive Messages: ${result.positive}%<br>
        Negative Messages: ${result.negative}%<br>
        Neutral Messages: ${result.neutral}%<br>
        <canvas id="sentiment-pie-chart" width="150" height="150"></canvas>`;

    // Append the sentiment analysis result message to the chatbox
    chatBox.appendChild(sentimentMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Now, generate the 3D effect pie chart
    const ctx = document.getElementById('sentiment-pie-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie', // Define the chart type
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [result.positive, result.negative, result.neutral], // Data for the chart
                backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'], // Colors for each section
                hoverBackgroundColor: ['#66bb6a', '#e57373', '#bdbdbd'],
            }]
        },
        options: {
            responsive: true,
            animation: {
                animateRotate: true, // Animate rotation for smoother feel
                animateScale: true, // Animate scaling of the segments
                duration: 1000, // Animation duration in milliseconds
                easing: 'easeOutBounce', // Use a bouncy easing effect for smooth animation
            },
            rotation: Math.PI / 4, // Add a slight rotation for a 3D effect
            cutoutPercentage: 70, // Creates a donut chart look, for a 3D feel
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            // Customize tooltip display
                            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                        }
                    }
                }
            },
            elements: {
                arc: {
                    borderWidth: 5, // Thicker border for more emphasis on segments
                    borderColor: '#ffffff', // White border for better visual contrast
                }
            },
            // Simulate a 3D effect using perspective
            rotation: Math.PI / 4, // Rotate the chart to give a 3D-like feel
            aspectRatio: 1.5, // Keeps the chart aspect ratio better aligned
            maintainAspectRatio: true,
        }
    });
});