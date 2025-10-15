let currentQuestionIndex = 0;
let questions = [];
const flag = "FLAG{CYBER_TRIVIA_MASTER}"; // hidden flag

window.onload = async () => {
    const response = await fetch('questions.json');
    questions = await response.json();
    showQuestion();
};

function showQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = q.question;
    document.getElementById('answer').value = '';
    document.getElementById('hint').textContent = '';
    document.getElementById('flag').textContent = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            alert("Correct! Next question...");
            showQuestion();
        } else {
            document.getElementById('flag').textContent = flag;
            document.getElementById('question').textContent = "Congratulations! You answered all questions.";
            document.getElementById('answer').style.display = 'none';
            document.querySelector('button').style.display = 'none';
        }
    } else {
        document.getElementById('hint').textContent = questions[currentQuestionIndex].hint;
    }
}
