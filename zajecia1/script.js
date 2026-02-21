document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  const scoreSpan = document.getElementById('score');
  const totalSpan = document.getElementById('total');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const answers = [];

    const questions = document.querySelectorAll('.question');
    questions.forEach((questionDiv) => {
      const questionId = parseInt(questionDiv.querySelector('label').textContent.split(" ")[0]);
      const selectedOption = questionDiv.querySelector('input[type="radio"]:checked');

      if (selectedOption) {
        answers.push({
          id: questionId,
          answer: selectedOption.value
        });
      }
    });

    if (answers.length === questions.length) {
      fetch('http://localhost:3000/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      })
      .then(response => response.json())
      .then(data => {
        scoreSpan.textContent = data.score;
        resultDiv.style.display = 'block';
      });
    } else {
      alert('Proszę odpowiedzieć na wszystkie pytania.');
    }
  });
});