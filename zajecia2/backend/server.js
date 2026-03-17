const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

// --- DANE I ARCHIWIZACJA ---
let messages = [];
const DATA_FILE = './messages.json';

// Ładowanie historii z pliku przy starcie
if (fs.existsSync(DATA_FILE)) {
    messages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// --- MIDDLEWARE ---

// 1. Logger - loguje URL i metodę [cite: 11, 25]
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
};
app.use(logger);

// 2. Auth - sprawdza token w nagłówku
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'SecretToken123') { // Uproszczona weryfikacja na potrzeby zadania
        next();
    } else {
        res.status(401).json({ error: 'Brak autoryzacji' });
    }
};

// --- REST API ---

// Logowanie - zwraca token [cite: 7]
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        res.json({ token: 'SecretToken123', user: username });
    } else {
        res.status(400).json({ error: 'Podaj nazwę użytkownika' });
    }
});

// Pobieranie wiadomości (Chronione) [cite: 8, 26]
app.get('/messages', authMiddleware, (req, res) => {
    res.json(messages);
});

// Wysyłanie wiadomości (Chronione) [cite: 9, 12, 27]
app.post('/messages', authMiddleware, (req, res) => {
    const newMessage = {
        user: req.body.user,
        text: req.body.text,
        timestamp: new Date()
    };

    messages.push(newMessage);

    // Archiwizacja do JSON
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

    res.status(201).json(newMessage);
});

// --- SOCKET.IO --- [cite: 13, 15]
io.on('connection', (socket) => {
    console.log('Nowy użytkownik połączony');

    socket.on('chat message', (msg) => {
        // Broadcast do wszystkich
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