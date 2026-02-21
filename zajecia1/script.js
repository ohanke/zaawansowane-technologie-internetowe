document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');

  if (!form) {
    console.error('Formularz nie został znaleziony!');
    return;
  }

  const resultDiv = document.getElementById('result');
  const scoreSpan = document.getElementById('score');
  const totalSpan = document.getElementById('total');

  // Pobieranie pytań z backendu
  fetch('http://localhost:3000/questions')
    .then(response => response.json())
    .then(questions => {
      console.log("Pytania załadowane:", questions);

      totalSpan.textContent = questions.length;

      questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
          <label>${question.question}</label>
          <div class="options">
            ${question.options.map(option => `
              <input type="radio" name="question_${question.id}" value="${option}" id="q${question.id}_${option}" required>
              <label for="q${question.id}_${option}">${option}</label>
            `).join('')}
          </div>
        `;
        form.insertBefore(questionDiv, form.querySelector('.submit-btn'));
      });
    });

  // Obsługa wysyłania formularza
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const answers = [];
    let isValid = true;

    const questions = document.querySelectorAll('.question');
    questions.forEach((questionDiv) => {
      const questionId = questionDiv.querySelector('input').name.split('_')[1]; // Poprawiamy sposób pobierania ID
      const selectedOption = questionDiv.querySelector('input[type="radio"]:checked');

      if (selectedOption) {
        answers.push({
          id: questionId,  // Teraz ID jest poprawnie pobrane
          answer: selectedOption.value
        });
      } else {
        isValid = false;  // Jeżeli brak odpowiedzi, ustawiamy flagę na false
      }
    });

    if (isValid) {
      console.log("Odpowiedzi do wysłania:", answers);  // Dodajemy log, aby zobaczyć dane przed wysłaniem

      fetch('http://localhost:3000/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      })
      .then(response => response.json())
      .then(data => {
        console.log("Odpowiedź z serwera:", data);  // Logujemy odpowiedź z serwera
        scoreSpan.textContent = data.score;
        resultDiv.style.display = 'block';
      })
      .catch(error => {
        console.error("Błąd wysyłania odpowiedzi:", error);  // Log błędu
      });
    } else {
      alert('Proszę odpowiedzieć na wszystkie pytania.');
    }
  });
});