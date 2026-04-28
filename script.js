// 🔊 SOUNDS
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const finishSound = new Audio("sounds/finish.mp3");

// 🏆 LEADERBOARD
function saveScore(name, score, total) {
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];

  board.push({
    name,
    score,
    total,
    percent: Math.round((score / total) * 100)
  });

  board.sort((a, b) => b.percent - a.percent);
  board = board.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(board));
}

// 🌙 DARK MODE
document.getElementById("dark-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 🔥 STREAK SYSTEM
let streak = 0;

// 🧠 PYTHON QUESTIONS (20)
const pythonQuestions = [
  { question: "What keyword defines a function in Python?", answers: ["func", "def", "function"], correct: "def" },
  { question: "Which type stores text?", answers: ["int", "str", "bool"], correct: "str" },
  { question: "How do you comment in Python?", answers: ["//", "#", "<!--"], correct: "#" },
  { question: "Which is a list?", answers: ["{}", "[]", "()"], correct: "[]" },
  { question: "Which is used for output?", answers: ["echo()", "print()", "log()"], correct: "print()" },

  { question: "Which loop is used in Python?", answers: ["for", "repeat", "loop"], correct: "for" },
  { question: "Boolean type?", answers: ["bool", "int", "str"], correct: "bool" },
  { question: "Exponent operator?", answers: ["^", "**", "//"], correct: "**" },
  { question: "Input function?", answers: ["input()", "scan()", "read()"], correct: "input()" },
  { question: "File extension?", answers: [".py", ".pt", ".python"], correct: ".py" },

  { question: "Dictionary uses?", answers: ["{}", "[]", "()"], correct: "{}" },
  { question: "Condition keyword?", answers: ["if", "when", "check"], correct: "if" },
  { question: "Loop type?", answers: ["for", "while", "do"], correct: "for" },
  { question: "Equality operator?", answers: ["=", "==", "==="], correct: "==" },
  { question: "Error handling?", answers: ["try", "catch", "error"], correct: "try" },

  { question: "Math library?", answers: ["math", "calc", "number"], correct: "math" },
  { question: "Ordered structure?", answers: ["list", "set", "dict"], correct: "list" },
  { question: "Stop loop?", answers: ["break", "stop", "exit"], correct: "break" },
  { question: "NOT keyword?", answers: ["function", "def", "class"], correct: "function" },
  { question: "Indentation language?", answers: ["Python", "C", "Java"], correct: "Python" }
];

// 💻 CODING QUESTIONS (20)
const codingQuestions = [
  { question: "HTML stands for?", answers: ["Hyper Text Markup Language", "High Text", "None"], correct: "Hyper Text Markup Language" },
  { question: "CSS is for?", answers: ["Styling", "Logic", "Data"], correct: "Styling" },
  { question: "JS runs in?", answers: ["Browser", "Server", "Database"], correct: "Browser" },
  { question: "Link tag?", answers: ["<a>", "<p>", "<link>"], correct: "<a>" },
  { question: "Color property?", answers: ["color", "font", "bg"], correct: "color" },

  { question: "HTML extension?", answers: [".html", ".ht", ".web"], correct: ".html" },
  { question: "CSS extension?", answers: [".css", ".style", ".cs"], correct: ".css" },
  { question: "JS variable?", answers: ["var", "int", "let"], correct: "var" },
  { question: "Image tag?", answers: ["<img>", "<image>", "<pic>"], correct: "<img>" },
  { question: "Paragraph tag?", answers: ["<p>", "<para>", "<text>"], correct: "<p>" },

  { question: "JS ends with?", answers: [";", ":", "."], correct: ";" },
  { question: "Frontend?", answers: ["HTML", "Python", "SQL"], correct: "HTML" },
  { question: "Backend?", answers: ["Node.js", "HTML", "CSS"], correct: "Node.js" },
  { question: "Button tag?", answers: ["<button>", "<btn>", "<click>"], correct: "<button>" },
  { question: "Framework?", answers: ["Bootstrap", "React", "Node"], correct: "Bootstrap" },

  { question: "DOM stands for?", answers: ["Document Object Model", "Data Object", "Display Model"], correct: "Document Object Model" },
  { question: "JS type?", answers: ["Scripting", "Markup", "Database"], correct: "Scripting" },
  { question: "NOT language?", answers: ["HTML", "CSS", "HTTP"], correct: "HTTP" },
  { question: "CSS used for?", answers: ["Design", "Logic", "Database"], correct: "Design" },
  { question: "JS framework?", answers: ["React", "Laravel", "Django"], correct: "React" }
];

// STATE
let questions = [];
let current = 0;
let score = 0;
let answered = false;
let timer;
let timeLeft = 0;

// ELEMENTS
const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");

const username = document.getElementById("username");
const category = document.getElementById("category");
const qCount = document.getElementById("question-count");
const timeInput = document.getElementById("time-input");

const userDisplay = document.getElementById("user-display");
const timerEl = document.getElementById("timer");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");

// 🚀 START QUIZ
startBtn.onclick = () => {
  const name = username.value.trim();
  const cat = category.value;
  let count = parseInt(qCount.value) || 20;
  let time = parseInt(timeInput.value) || 120;

  if (!name || !cat) return alert("Fill all fields");

  const bank = cat === "python" ? pythonQuestions : codingQuestions;

  questions = [...bank].sort(() => 0.5 - Math.random()).slice(0, count);

  userDisplay.textContent = name;

  startScreen.style.display = "none";
  quizScreen.style.display = "block";

  current = 0;
  score = 0;
  streak = 0;

  startTimer(time);
  showQuestion();
};

// ⏱ TIMER
function startTimer(seconds) {
  clearInterval(timer);

  timeLeft = seconds;
  timerEl.textContent = `⏱ ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

// ❗ QUESTION
function showQuestion() {
  answered = false;

  const q = questions[current];
  if (!q) return showResults();

  // slide animation
  questionEl.classList.remove("slide");
  void questionEl.offsetWidth;
  questionEl.classList.add("slide");

  questionEl.textContent = q.question;
  answersEl.innerHTML = "";

  q.answers.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a;

    btn.onclick = () => {
      if (answered) return;
      answered = true;

      const all = answersEl.querySelectorAll("button");

      all.forEach(b => {
        if (b.textContent === q.correct) {
          b.style.background = "green";
          b.style.color = "white";
        }
      });

      if (a === q.correct) {
        score++;
        streak++;

        correctSound.play();

        if (streak === 3) showStreak("🔥 3x STREAK!");

      } else {
        streak = 0;
        btn.style.background = "red";
        wrongSound.play();
      }
    };

    answersEl.appendChild(btn);
  });

  updateProgress();
}

// 📊 PROGRESS
function updateProgress() {
  progressFill.style.width = (current / questions.length) * 100 + "%";
}

// ➡ NEXT
nextBtn.onclick = () => {
  if (!answered) return alert("Select answer");

  current++;
  if (current < questions.length) showQuestion();
  else showResults();
};

// 🏆 RESULTS
function showResults() {
  clearInterval(timer);

  finishSound.play();

  questionEl.textContent = "Finished 🎉";
  answersEl.innerHTML = "";

  progressFill.style.width = "100%";

  saveScore(userDisplay.textContent, score, questions.length);

  answersEl.innerHTML = `
    <h3>Score: ${score}/${questions.length}</h3>
    <h2>Grade: ${getGrade(score, questions.length)}</h2>
    <button onclick="location.reload()">Restart</button>
  `;

  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

// 🏆 GRADE
function getGrade(score, total) {
  let p = (score / total) * 100;
  if (p >= 90) return "A+";
  if (p >= 75) return "B";
  if (p >= 60) return "C";
  if (p >= 40) return "D";
  return "F";
}

// 🔥 STREAK POPUP
function showStreak(text) {
  const el = document.createElement("div");
  el.textContent = text;
  el.style.position = "fixed";
  el.style.top = "80px";
  el.style.left = "50%";
  el.style.transform = "translateX(-50%)";
  el.style.background = "#ff4d8d";
  el.style.color = "white";
  el.style.padding = "10px 20px";
  el.style.borderRadius = "20px";
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 2000);
}

// 💬 QUOTES
const quotes = [
  "Success is built one question at a time.",
  "Keep going.",
  "You are learning.",
  "Discipline wins.",
  "Focus and win."
];

let last = -1;

function showQuote() {
  const box = document.getElementById("quote-box");
  if (!box) return;

  let i;
  do {
    i = Math.floor(Math.random() * quotes.length);
  } while (i === last);

  last = i;

  box.textContent = quotes[i];
}

setInterval(showQuote, 5000);
showQuote();