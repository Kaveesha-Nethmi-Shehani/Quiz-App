const configContainer = document.querySelector(".container");
const quizContainer = document.querySelector(".quiz-container");
const answerOption = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-quoins-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".quiz-duration");
const resultContainer = document.querySelector(".result-container");

// Quiz Variables
const QUIZ_TIMER_LIMIT = 10;
let currentTime = QUIZ_TIMER_LIMIT;
let timer = null;
let quizCategory = "HTML";
let numberOfQuestion = 10;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;

// Show Result
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `
    You answered <b>${correctAnswerCount}</b> out of
    <b>${numberOfQuestion}</b> questions correctly.
  `;

  document.querySelector(".result-massages").innerHTML = resultText;
};

// Reset Timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIMER_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

// Highlight Correct Answer
const highlightCorrectAnswer = () => {
  const correctOption =
    answerOption.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];

  if (!correctOption) return;

  correctOption.classList.add("correct");

  const iconHTML =
    `<span class="material-symbols-rounded">check_circle</span>`;

  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Start Timer
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;

    if (currentTime <= 0) {
      clearInterval(timer);

      highlightCorrectAnswer();

      nextQuestionBtn.style.visibility = "visible";

      answerOption
        .querySelectorAll(".answer-option")
        .forEach(option => option.style.pointerEvents = "none");
    }
  }, 1000);
};

// Get Random Question
const getRandomQuestions = () => {

  const selectedCategory = question.find(
    cat => cat.category.toLowerCase() === quizCategory.toLowerCase()
  );

  if (!selectedCategory) return null;

  const categoryQuestions = selectedCategory.questions || [];

  if (
    questionIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestion)
  ) {
    showQuizResult();
    return null;
  }

  const availableQuestion = categoryQuestions.filter(
    (_, index) => !questionIndexHistory.includes(index)
  );

  const randomQuestion =
    availableQuestion[
      Math.floor(Math.random() * availableQuestion.length)
    ];

  questionIndexHistory.push(
    categoryQuestions.indexOf(randomQuestion)
  );

  return randomQuestion;
};

// Handle Answer
const handleAnswer = (option, answerIndex) => {

  clearInterval(timer);

  const isCorrect =
    currentQuestion.correctAnswer === answerIndex;

  option.classList.add(
    isCorrect ? "correct" : "incorrect"
  );

  if (isCorrect) {
    correctAnswerCount++;
  } else {
    highlightCorrectAnswer();
  }

  const iconHTML = `
    <span class="material-symbols-rounded">
      ${isCorrect ? "check_circle" : "cancel"}
    </span>
  `;

  option.insertAdjacentHTML("beforeend", iconHTML);

  answerOption
    .querySelectorAll(".answer-option")
    .forEach(option =>
      option.style.pointerEvents = "none"
    );

  nextQuestionBtn.style.visibility = "visible";
};

// Render Question
const renderQuestion = () => {

  currentQuestion = getRandomQuestions();

  if (!currentQuestion) return;

  resetTimer();
  startTimer();

  answerOption.innerHTML = "";

  nextQuestionBtn.style.visibility = "hidden";

  document.querySelector(".quiz-quoins").textContent =
    currentQuestion.question;

  questionStatus.innerHTML = `
    <b>${questionIndexHistory.length}</b>
    of
    <b>${numberOfQuestion}</b>
    Questions
  `;

  currentQuestion.options.forEach(
    (option, index) => {

      const li = document.createElement("li");

      li.classList.add("answer-option");

      li.textContent = option;

      answerOption.appendChild(li);

      li.addEventListener(
        "click",
        () => handleAnswer(li, index)
      );
    }
  );
};

// Start Quiz
const startQuiz = () => {

  configContainer.style.display = "none";
  quizContainer.style.display = "block";

  quizCategory =
    configContainer.querySelector(".category.active").textContent;

  numberOfQuestion =
    parseInt(
      configContainer.querySelector(".questions.active").textContent
    );

  renderQuestion();
};

// Reset Quiz
const resetQuiz = () => {

  resetTimer();

  correctAnswerCount = 0;

  questionIndexHistory.length = 0;

  resultContainer.style.display = "none";

  configContainer.style.display = "block";
};

// Category & Question Selection
document
  .querySelectorAll(".category, .questions")
  .forEach(option => {

    option.addEventListener("click", () => {

      option.parentNode
        .querySelector(".active")
        .classList.remove("active");

      option.classList.add("active");
    });
  });

// Events
nextQuestionBtn.addEventListener(
  "click",
  renderQuestion
);

document
  .querySelector(".try-again-button")
  ?.addEventListener(
    "click",
    resetQuiz
  );

document
  .querySelector(".quiz-btn")
  .addEventListener(
    "click",
    startQuiz
  );