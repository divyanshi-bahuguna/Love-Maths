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
}
