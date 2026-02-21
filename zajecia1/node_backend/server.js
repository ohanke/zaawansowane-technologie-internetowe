const express = require('express');
const app = express();
const port = 3000;

// Middleware do parsowania JSON
app.use(express.json());

// Przykładowe pytania
const questions = [
  {
    id: 1,
    question: "Jak nazywa się stolicą Polski?",
    options: ["Warszawa", "Kraków", "Wrocław", "Poznań"],
    correctAnswer: "Warszawa"
  },
  {
    id: 2,
    question: "Jakie jest największe jezioro w Polsce?",
    options: ["Śniardwy", "Mamry", "Łebsko", "Czorsztyn"],
    correctAnswer: "Śniardwy"
  },
  // Można dodać więcej pytań
];

// Endpoint GET - zwrócenie pytań
app.get('/questions', (req, res) => {
  res.json(questions);
});

// Endpoint POST - odbiór odpowiedzi użytkownika
app.post('/answers', (req, res) => {
  const answers = req.body;  // Oczekujemy, że odpowiedzi będą przesyłane w ciele żądania
  let score = 0; // Upewnij się, że score jest zdefiniowane na początku

  // Sprawdzanie odpowiedzi
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.id);
    if (question && question.correctAnswer === answer.answer) {
      score += 1;
    }
  });

  // Zwrócenie wyniku
  res.json({ score, total: questions.length });
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});