const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

let messages = [];
const DATA_FILE = './messages.json';

if (fs.existsSync(DATA_FILE)) {
    messages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
};
app.use(logger);

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'SecretToken123') {
        next();
    } else {
        res.status(401).json({ error: 'Brak autoryzacji' });
    }
};

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        res.json({ token: 'SecretToken123', user: username });
    } else {
        res.status(400).json({ error: 'Podaj nazwę użytkownika' });
    }
});

app.get('/messages', authMiddleware, (req, res) => {
    res.json(messages);
});

app.post('/messages', authMiddleware, (req, res) => {
    const newMessage = {
        user: req.body.user,
        text: req.body.text,
        timestamp: new Date()
    };

    messages.push(newMessage);

    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

    res.status(201).json(newMessage);
});

io.on('connection', (socket) => {
    console.log('Nowy użytkownik połączony');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Użytkownik rozłączony');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});