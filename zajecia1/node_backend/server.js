const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

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
];

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.post('/answers', (req, res) => {
  console.log("Odpowiedzi odebrane:", req.body);

  const answers = req.body;
  let score = 0;

  answers.forEach(answer => {
    const question = questions.find(q => q.id === Number(answer.id));

    if (question) {
      console.log(`Pytanie: ${question.question} | Odpowiedź użytkownika: ${answer.answer} | Poprawna odpowiedź: ${question.correctAnswer}`);

      const correctAnswer = question.correctAnswer.trim().toLowerCase();
      const userAnswer = answer.answer.trim().toLowerCase();

      if (correctAnswer === userAnswer) {
        score += 1;
      } else {
        console.log(`Odpowiedź niepoprawna: ${userAnswer} !== ${correctAnswer}`);
      }
    } else {
      console.log(`Brak pytania o ID: ${answer.id}`);
    }
  });

  console.log(`Wynik: ${score} na ${questions.length}`);
  res.json({ score, total: questions.length });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});