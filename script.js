let score = 0;
let timeLeft = 30;
let timer;
let correctAnswer = 0;
let allowAnswer = true;
const totalTime = 60;

// DOM Elements
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const submitBtn = document.getElementById("submit");
const progressBar = document.getElementById("progress-bar");

startGame();

function startGame() {
  score = 0;
  timeLeft = totalTime;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  answerInput.disabled = false;
  submitBtn.disabled = false;
  feedbackEl.textContent = "";
  feedbackEl.className = '';
  allowAnswer = true;
  updateProgressBar();
  generateQuestion();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    updateProgressBar();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function generateQuestion() {
  const a = getRand(1, 10);
  const b = getRand(1, 10);
  const c = getRand(1, 10);
  const d = getRand(1, 10);
  const e = getRand(1, 9); 

  const ops = ['+', '-', '*', '/'];
  const op1 = ops[getRand(0, 3)];
  const op2 = ops[getRand(0, 3)];
  const op3 = ops[getRand(0, 3)];
  const op4 = ops[getRand(0, 3)];

  const expression = `((${a} ${op1} ${b}) ${op2} ${c}) ${op3} (${d} ${op4} ${e})`;

  try {
    let result = eval(expression);
    result = Math.round(result * 100) / 100; 
    correctAnswer = result;

    questionEl.textContent = `What is ${expression}?`;
    answerInput.value = '';
    feedbackEl.textContent = '';
    feedbackEl.className = '';
    allowAnswer = true;
  } catch (e) {
    generateQuestion(); // coba jika salah
  }
}

submitBtn.addEventListener("click", () => {
  if (!allowAnswer || timeLeft <= 0) return;

  const userInput = answerInput.value.trim();
  if (userInput === "") return showFeedback("⚠️ Please enter your answer.");

  const userAnswer = parseFloat(userInput);
  if (isNaN(userAnswer)) return showFeedback("❌ Input must be a number.");

  allowAnswer = false;

  if (userAnswer === correctAnswer) {
    score++;
    scoreEl.textContent = score;
    showFeedback("✅ Correct!", true);
  } else {
    showFeedback(`❌ Incorrect! The correct answer was ${correctAnswer}`, false);
  }

  setTimeout(() => {
    if (timeLeft > 0) generateQuestion();
  }, 1500);
});

function showFeedback(message, isCorrect = null) {
  feedbackEl.textContent = message;
  feedbackEl.className = '';
  if (isCorrect === true) {
    feedbackEl.classList.add('correct');
  } else if (isCorrect === false) {
    feedbackEl.classList.add('incorrect');
  }
}

function updateProgressBar() {
  const percent = (timeLeft / totalTime) * 100;
  progressBar.style.width = `${percent}%`;
}

function endGame() {
  questionEl.textContent = "⏰ Time's up!";
  showFeedback(`Game Over! Final score: ${score}`);
  answerInput.disabled = true;
  submitBtn.disabled = true;
}

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
