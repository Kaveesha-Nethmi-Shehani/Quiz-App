const configContainer = document.querySelector(".container");
const quizContainer = document.querySelector(".quiz-container");
const resultContainer = document.querySelector(".result-container");

const answerOption = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-quoins-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".quiz-duration");

const QUIZ_TIMER_LIMIT = 10;

let currentTime = QUIZ_TIMER_LIMIT;
let timer = null;
let quizCategory = "HTML";
let numberOfQuestion = 10;
let currentQuestion = null;
let correctAnswerCount = 0;
let currentQuestionIndex = 0;

// Timer Reset
function resetTimer() {
    clearInterval(timer);
    currentTime = QUIZ_TIMER_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
}

// Highlight Correct Answer
function highlightCorrectAnswer() {
    const options =
        answerOption.querySelectorAll(".answer-option");

    const correctOption =
        options[currentQuestion.correctAnswer];

    if (correctOption) {
        correctOption.classList.add("correct");
    }
}

// Timer Start
function startTimer() {

    timer = setInterval(() => {

        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if (currentTime <= 0) {

            clearInterval(timer);

            highlightCorrectAnswer();

            answerOption
                .querySelectorAll(".answer-option")
                .forEach(option => {
                    option.style.pointerEvents = "none";
                });

            nextQuestionBtn.style.visibility = "visible";
        }

    }, 1000);
}

// Render Question
function renderQuestion() {

    const categoryData = question.find(
        q => q.category === quizCategory
    );

    if (!categoryData) return;

    if (
        currentQuestionIndex >= categoryData.questions.length ||
        currentQuestionIndex >= numberOfQuestion
    ) {
        showQuizResult();
        return;
    }

    currentQuestion =
        categoryData.questions[currentQuestionIndex];

    resetTimer();
    startTimer();

    answerOption.innerHTML = "";

    nextQuestionBtn.style.visibility = "hidden";

    document.querySelector(".quiz-quoins").textContent =
        currentQuestion.question;

    questionStatus.innerHTML =
        `<b>${currentQuestionIndex + 1}</b> of <b>${numberOfQuestion}</b> Questions`;

    currentQuestion.options.forEach((option, index) => {

        const li = document.createElement("li");

        li.classList.add("answer-option");
        li.textContent = option;

        li.addEventListener("click", () => {
            handleAnswer(li, index);
        });

        answerOption.appendChild(li);
    });
}

// Handle Answer
function handleAnswer(option, answerIndex) {

    clearInterval(timer);

    const isCorrect =
        answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
        option.classList.add("correct");
        correctAnswerCount++;
    } else {
        option.classList.add("incorrect");
        highlightCorrectAnswer();
    }

    answerOption
        .querySelectorAll(".answer-option")
        .forEach(opt => {
            opt.style.pointerEvents = "none";
        });

    nextQuestionBtn.style.visibility = "visible";
}

// Show Result
function showQuizResult() {

    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    document.querySelector(".result-massages").innerHTML =
        `You answered <b>${correctAnswerCount}</b> out of <b>${Math.min(numberOfQuestion, currentQuestionIndex)}</b> questions correctly!`;

         // Confetti Animation
    const end = Date.now() + 15 * 1000;
    const colors = ["#bb0000", "#ffffff"];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors
        });

        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}


// Start Quiz
function startQuiz() {

    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    quizCategory =
        configContainer.querySelector(".category.active").textContent;

    numberOfQuestion =
        parseInt(
            configContainer.querySelector(".questions.active").textContent
        );

    currentQuestionIndex = 0;
    correctAnswerCount = 0;

    renderQuestion();
}

// Next Question
nextQuestionBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    renderQuestion();
});

// Category Selection
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

// Reset Quiz
function resetQuiz() {

    clearInterval(timer);

    currentQuestionIndex = 0;
    correctAnswerCount = 0;

    resultContainer.style.display = "none";
    configContainer.style.display = "block";
}

document
    .querySelector(".try-again-button")
    .addEventListener("click", resetQuiz);

document
    .querySelector(".quiz-btn")
    .addEventListener("click", startQuiz);