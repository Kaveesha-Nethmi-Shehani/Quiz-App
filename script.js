const optionsContainer = document.querySelector(".options-container")

const quizContainer = document.querySelector(".quiz-container");
const answerOption = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-quoins-btn");
const questionStatus = document.querySelector(".question-status-btn");
const timerDisplay = document.querySelector(".quiz-duration");
const resultContainer = document.querySelector(".result-container");

//Quiz variables state
const QUIZ_TIMER_LIMIT = 10;
let currentTime = QUIZ_TIMER_LIMIT;
let timer = null;
let quizCategory = "HTML";
let numberOfQuestion = 10;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;


//Display the quiz result and hide the quiz container //
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestion}</b> questions correctly.Great effort!--> </p>`;
  document.querySelector(".result-massages").innerHTML = resultText;

}

//Clear and reset and timer //  
const resetTimer = () =>{
  clearInterval(timer);
  currentTime = QUIZ_TIMER_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;


}


//Initialize and start the time for the current question//
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;

    if(currentTime <= 0){
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

        
      // all answer option after one option is selected //
      answerOption.querySelectorAll(".answer-options").forEach(option => option.style.pointerEvents = "none");
      }
  },1000);

}

//Random question select category//
const getRandomQuestions =() => {
  const categoryQuestions = question.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).question
  ||[];


  //Show  the result question have been used //
  if(questionIndexHistory.length >= Math.min( categoryQuestions.length, numberOfQuestion)) {
    return showQuizResult();

  }


  //Filter out ready asked question and choose a random one //

  const availableQuestion = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
  const randomQuestion = categoryQuestions[Math.floor(Math.random()*categoryQuestions.length)]

  questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
}


//Highlight the correct answer option //
const highlightCorrectAnswer = () => {
  const correctOption = answerOption.querySelectorAll(".answer-options")[currentQuestion.correctAnswer];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbol-round">${isCorrect ? 'check_circle' : 'cancel'}</span>`
  correctOption.insertAdjacentHTML("beforeend",iconHTML);
}


//Handle the user's answer question//
const handleAnswer =(option, answerIndex) => {
  clearInterval(timer);

  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? 'correct' : 'incorrect');
  !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

  //Insert icon correctness //
  const iconHTML = `<span class="material-symbol-round">${isCorrect ? 'check_circle' : 'cancel'}</span>`
  option.insertAdjacentHTML("beforeend",iconHTML);

  //One option is selected//
  answerOption.querySelectorAll(".answer-options").forEach(option => option.style.pointerEvents = "none");
  nextQuestionBtn.style.visibility = "visible";


} 
//Current question and its option in the  piz//
const renderQuestion =() => {
  currentQuestion = getRandomQuestions();
  if(!currentQuestion) return;
 // console.log(currentQuestion);//

  resetTimer();
  startTimer();

//Update UI//
  answerOption.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
  document.querySelector(".quiz-quoins").textContent = currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestion}</b> Questions`;

//Create  option <li> element and add Event Listener//
  currentQuestion.options.forEach((option,index) => {
    const li = document.createElement("li");
    li.classList.add("answer-options");
    li.textContent = option;
    answerOption.appendChild(li)
    li.addEventListener("click",() => handleAnswer(li, index));

  });
}


//Start the quiz & random question //
const startQuiz = () =>{
  optionsContainer.style.display = "none";
  quizContainer.style.display = "block";

  //Update the quiz category and number of question // 

  quizCategory = configContainer.querySelector(".category.active").textContent;
  numberOfQuestion = parseInt(configContainer.querySelector(".questions.active").textContent);

  renderQuestion();
}


//selected option click   or no of question //
document.querySelectorAll(".category, .questions").forEach(option => {
  option.addEventListener("click", () =>{
    option.parentNode.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});

//Reset the quiz and return configuration container //
const resetQuiz = () => {
  resetTimer();
  correctAnswerCount = 0;
  questionIndexHistory.length = 0;
  optionsContainer.style.display = "block";
  resultContainer.style.display = "none";
} 

 

nextQuestionBtn.addEventListener("click",renderQuestion);
document.querySelector(".try-again-button").addEventListener("click",resetQuiz);
document.querySelector(".quiz-btn").addEventListener("click",startQuiz);

 









/*const end = Date.now() + 15 * 1e3;
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
  if (Date.now() < end) requestAnimationFrame(frame);
})();*/
