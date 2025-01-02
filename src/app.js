const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const Sentiment = require('sentiment'); // Sentiment analysis library

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;


app.use(express.static(path.join(__dirname, '../assets')));  // Going up one level to access the 'assets' folder
app.use(express.static(path.join(__dirname, '../src')));  // Going up one level to access the 'assets' folder

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..','index.html');
    console.log('Serving index.html from:', filePath);  // Debugging path
    res.sendFile(filePath);
});


const users = {};
const sentiment = new Sentiment();

// Handle client connections
io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.on('register', (phoneNumber) => {
        users[socket.id] = phoneNumber;
        console.log(`User registered: ${phoneNumber}`);
    });

    socket.on('chatMessage', ({ to, msg, from }) => {
        for (let [id, phoneNumber] of Object.entries(users)) {
            if (phoneNumber === to) {
                io.to(id).emit('chatMessage', { from, to, msg });
            }
        }
    });

    socket.on('ocrMessage', ({ to, from, text }) => {
        for (let [id, phoneNumber] of Object.entries(users)) {
            if (phoneNumber === to) {
                io.to(id).emit('chatMessage', { from, to, msg: `OCR Output: ${text}` });
            }
        }
    });

    socket.on('gestureMessage', ({ to, from, gesture }) => {
        for (let [id, phoneNumber] of Object.entries(users)) {
            if (phoneNumber === to) {
                io.to(id).emit('chatMessage', { from, to, msg: `Gesture Detected: ${gesture}` });
            }
        }
    });

    socket.on('endChat', ({ messages }) => {
        const sentimentResults = analyzeSentiment(messages);
        io.to(socket.id).emit('sentimentAnalysisResult', sentimentResults);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${users[socket.id]}`);
        delete users[socket.id];
    });
});

// Analyze the sentiment of messages
function analyzeSentiment(messages) {
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    messages.forEach((msg) => {
        const result = sentiment.analyze(msg);
        if (result.score > 0) {
            positive += 1;
        } else if (result.score < 0) {
            negative += 1;
        } else {
            neutral += 1;
        }
    });

    const totalMessages = messages.length;
    const positivePercentage = ((positive / totalMessages) * 100).toFixed(2);
    const negativePercentage = ((negative / totalMessages) * 100).toFixed(2);
    const neutralPercentage = ((neutral / totalMessages) * 100).toFixed(2);

    let sentimentText = 'Neutral';
    let emoji = '🙂';
    if (positive > negative) {
        sentimentText = 'Positive';
        emoji = '😊';
    } else if (negative > positive) {
        sentimentText = 'Negative';
        emoji = '😞';
    }

    return {
        sentiment: sentimentText,
        emoji,
        positive: positivePercentage,
        negative: negativePercentage,
        neutral: neutralPercentage,
    };
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
