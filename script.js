let quizData = {};
let selectedCategory = "";
let questions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswers = new Array(questions.length).fill(null); // fill on quiz start

// Load JSON on page load
window.onload = async function () {
  const res = await fetch("quiz_data.json");
  quizData = await res.json();
};

function showCategorySelection() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("categoryScreen").classList.remove("hidden");
  const keys = Object.keys(quizData);
//   const randomCategories = keys.sort(() => 0.5 - Math.random()).slice(0, 3);
  const container = document.getElementById("categories");
  container.innerHTML = "";
  keys.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className =
      "bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700";
    btn.onclick = () => startQuiz(cat);
    container.appendChild(btn);
  });
}

function goBack() {
  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

function startQuiz(category) {
  selectedCategory = category;
  questions = quizData[category];
  selectedAnswers = new Array(questions.length).fill(null); // NEW
  currentIndex = 0;
  score = 0;
  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  document.getElementById("totalQ").textContent = questions.length;
  showQuestion();
}

function showQuestion() {
  const currentQ = questions[currentIndex];
  document.getElementById("currentQ").textContent = currentIndex + 1;
  document.getElementById("questionText").textContent = currentQ.question;
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  currentQ.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className =
      "w-full bg-[blueviolet] text-white text-left px-4 py-2 rounded hover:bg-pink-300";

    if (selectedAnswers[currentIndex] === index) {
      btn.classList.add("bg-pink-400","hover:bg-pink-400","border-[2px]","border-pink-500");
    }

    btn.onclick = () => {
      selectedAnswers[currentIndex] = index;
      showQuestion(); // re-render to highlight selected
    };
    optionsContainer.appendChild(btn);
  });

  updateNavigationButtons();
}

function selectAnswer(selectedIndex) {
  if (selectedIndex === questions[currentIndex].answer) {
    score++;
  }
  nextQuestion();
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  prevBtn.disabled = currentIndex === 0;
  if (currentIndex === questions.length - 1) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

function submitQuiz() {
  score = 0;
  questions.forEach((q, i) => {
    if (selectedAnswers[i] === q.answer) score++;
  });

  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("scoreScreen").classList.remove("hidden");
  document.getElementById("scoreDisplay").textContent = score;
  document.getElementById("totalDisplay").textContent = questions.length;
}

function restartQuiz() {
  selectedAnswers = [];
  document.getElementById("scoreScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}
