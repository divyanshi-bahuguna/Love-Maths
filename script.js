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
}
