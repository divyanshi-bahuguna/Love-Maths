<<<<<<< HEAD
// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentQuestion = null;
let points = 0;
let level = 0;
let progress = 0;
const progressMax = 10;

// ===== LOGIN / REGISTER =====
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const userData = localStorage.getItem(email);
    if (userData) {
        currentUser = JSON.parse(userData);
        localStorage.setItem("loggedInUser", email);
        window.location.href = "game.html";
    } else {
        alert('User not found! Please register.');
    }
}

function register() {
    const name = document.getElementById('regName').value.trim();
    const age = document.getElementById('regAge').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;

    if (!name || !age || !email || !gender || !difficulty) {
        alert('Please fill all fields!');
        return;
    }

    const newUser = { name, age, email, gender, difficulty, points: 0, level: 0, progress: 0 };
    localStorage.setItem(email, JSON.stringify(newUser));
    localStorage.setItem("loggedInUser", email);
    window.location.href = "game.html";
}

// ===== GAME PAGE INIT =====
window.onload = function() {
    if (document.body.classList.contains('game-page')) {
        const email = localStorage.getItem("loggedInUser");
        if (!email) {
            window.location.href = "index.html";
            return;
        }
        currentUser = JSON.parse(localStorage.getItem(email));
        points = currentUser.points || 0;
        level = currentUser.level || 0;
        progress = currentUser.progress || 0;
        document.getElementById('userGreeting').textContent = `👋 ${currentUser.name}`;
        document.getElementById('points').textContent = points;
        document.getElementById('level').textContent = level;
        document.getElementById('progressBar').value = progress;
    }
};

// ===== LOGOUT =====
function logout() {
    if (currentUser) {
        localStorage.setItem(currentUser.email, JSON.stringify({ ...currentUser, points, level, progress }));
    }
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// ===== QUIZ =====
async function generateQuizFromAPI() {
    try {
        const res = await fetch("http://localhost:5000/questions");

        const questions = await res.json();
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        document.getElementById('quizArea').textContent = currentQuestion.question;
        document.getElementById('answerInput').classList.remove('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
        document.getElementById('feedback').textContent = '';
        document.getElementById('answerInput').value = '';
    } catch (err) {
        alert('Error fetching quiz.');
    }
}

function submitAnswer() {
    const userAnswer = document.getElementById('answerInput').value.trim();
    if (!currentQuestion) return;

    if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
        points += 10;
        progress += 1;
        document.getElementById('feedback').textContent = '✅ Correct! 🎉';
        if (progress >= progressMax) {
            level++;
            progress = 0;
            alert(`🏆 Level Up! Now at Level ${level}`);
        }
    } else {
        document.getElementById('feedback').textContent = `❌ Oops! Correct: ${currentQuestion.answer}`;
    }

    document.getElementById('points').textContent = points;
    document.getElementById('level').textContent = level;
    document.getElementById('progressBar').value = progress;

    currentUser.points = points;
    currentUser.level = level;
    currentUser.progress = progress;
    localStorage.setItem(currentUser.email, JSON.stringify(currentUser));

    document.getElementById('answerInput').classList.add('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
}

// ===== FORM TOGGLE =====
function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}
function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
=======
let currentUser = null;
let quizzes = {
  beginner: ['2 + 2', '5 - 3'],
  intermediate: ['12 / 4', '9 * 2'],
  advanced: ['5 * (2 + 3)', '18 / 3 + 1']
};
let currentAnswer = '';

function register() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const age = document.getElementById('regAge').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

  const user = { name, email, age, gender, difficulty, points: 0, level: 0 };
  localStorage.setItem(email, JSON.stringify(user));
  alert('Registered! Now login.');
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const data = localStorage.getItem(email);
  if (data) {
    currentUser = JSON.parse(data);
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('userGreeting').textContent = `Hello, ${currentUser.name}`;
    updateStats();
  } else {
    alert('User not found!');
  }
}

function updateStats() {
  document.getElementById('points').textContent = currentUser.points;
  document.getElementById('level').textContent = currentUser.level;
  document.getElementById('progressBar').value = currentUser.points % 10;
}

function generateQuiz() {
  const quizList = quizzes[currentUser.difficulty];
  const quiz = quizList[Math.floor(Math.random() * quizList.length)];
  currentAnswer = eval(quiz);
  document.getElementById('quizArea').textContent = quiz;
  document.getElementById('answerInput').classList.remove('hidden');
  document.getElementById('submitBtn').classList.remove('hidden');
}

function submitAnswer() {
  const ans = document.getElementById('answerInput').value;
  if (parseInt(ans) === currentAnswer) {
    currentUser.points++;
    document.getElementById('feedback').textContent = '✅ Correct!';
    if (currentUser.points % 10 === 0) currentUser.level++;
  } else {
    document.getElementById('feedback').textContent = '❌ Try Again.';
  }
  localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
  updateStats();
}

function openSettings() {
  document.getElementById('settingsPopup').classList.remove('hidden');
  document.getElementById('settingsName').textContent = currentUser.name;
}

function logout() {
  localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
  location.reload();
}

function openLevels() {
  const grid = document.getElementById('levelsGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= 20; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = i > currentUser.level + 1;
    grid.appendChild(btn);
  }
  document.getElementById('levelsModal').classList.remove('hidden');
}

function closeLevels() {
  document.getElementById('levelsModal').classList.add('hidden');
>>>>>>> bfe2560dd28f1a3a05bdbf6d767b806c041252b0
}
