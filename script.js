const cards = [
  { id: 1, name: "Dragon", attack: 8, defense: 5, emoji: "🐉" },
  { id: 2, name: "Knight", attack: 6, defense: 7, emoji: "🛡️" },
  { id: 3, name: "Wizard", attack: 5, defense: 9, emoji: "🪄" },
  { id: 4, name: "Goblin", attack: 4, defense: 4, emoji: "👺" },
  { id: 5, name: "Archer", attack: 7, defense: 3, emoji: "🏹" }
];

const appState = {
  playerCard: null,
  computerCard: null,
  wins: 0,
  losses: 0,
  draws: 0
};

const $ = id => document.getElementById(id);
const drawBtn = $('drawBtn');
const playerSlot = $('playerSlot');
const computerSlot = $('computerSlot');
const resultEl = $('result');
const winsEl = $('wins');
const lossesEl = $('losses');
const drawsEl = $('draws');
const resetScoreBtn = $('resetScoreBtn');

function randInt(max) { return Math.floor(Math.random() * max); }
function pickRandomCard(excludeId) {
  let pool = cards.slice();
  if (excludeId) pool = pool.filter(c => c.id !== excludeId);
  return pool[randInt(pool.length)];
}

function renderCard(container, card) {
  container.innerHTML = '';
  if (!card) {
    const ph = document.createElement('div');
    ph.className = 'card-placeholder';
    ph.textContent = 'No card';
    container.appendChild(ph);
    return;
  }
  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  cardEl.setAttribute('role', 'group');
  cardEl.setAttribute('aria-label', card.name + ' card');
  cardEl.innerHTML = `
    <div class="emoji" aria-hidden="true" style="font-size:34px">${card.emoji || '🎴'}</div>
    <div class="meta">
      <div class="name">${card.name}</div>
      <div class="stats">
        <div class="stat" title="Attack">⚔ ${card.attack}</div>
        <div class="stat" title="Defense">🛡 ${card.defense}</div>
      </div>
    </div>
  `;
  container.appendChild(cardEl);
}

// battle logic
function computeOutcome(player, computer) {
  const pScore = Math.max(0, player.attack - computer.defense);
  const cScore = Math.max(0, computer.attack - player.defense);
  if (pScore > cScore) return 'win';
  if (pScore < cScore) return 'loss';
  return 'draw';
}

const gradients = {
  win: 'linear-gradient(135deg, #34d399 0%, #10b981 35%, #059669 100%)',
  loss: 'linear-gradient(135deg, #f87171 0%, #ef4444 35%, #b91c1c 100%)',
  draw: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #b45309 100%)'
};

function showResult(message, kind) {
  resultEl.textContent = message;
  resultEl.style.background = gradients[kind];
  resultEl.style.display = 'inline-block';
}

function updateScoreUI() {
  winsEl.textContent = appState.wins;
  lossesEl.textContent = appState.losses;
  drawsEl.textContent = appState.draws;
}

function saveScore() {
  try {
    localStorage.setItem('tcb_score', JSON.stringify({ w: appState.wins, l: appState.losses, d: appState.draws }));
  } catch (e) { }
}

function loadScore() {
  try {
    const s = JSON.parse(localStorage.getItem('tcb_score') || 'null');
    if (s) { appState.wins = s.w; appState.losses = s.l; appState.draws = s.d; updateScoreUI(); }
  } catch (e) { }
}

function resetBattle() {
  appState.playerCard = null;
  appState.computerCard = null;
  renderCard(playerSlot, null);
  renderCard(computerSlot, null);
  resultEl.style.display = 'none';
}

drawBtn.addEventListener('click', () => {
  appState.playerCard = pickRandomCard();
  appState.computerCard = pickRandomCard(appState.playerCard.id);
  renderCard(playerSlot, appState.playerCard);

  setTimeout(() => {
    renderCard(computerSlot, appState.computerCard);
    const outcome = computeOutcome(appState.playerCard, appState.computerCard);

    if (outcome === 'win') {
      appState.wins++;
      showResult('You Win!', 'win');
    } else if (outcome === 'loss') {
      appState.losses++;
      showResult('You Lose!', 'loss');
    } else {
      appState.draws++;
      showResult('Draw!', 'draw');
    }

    updateScoreUI();
    saveScore();
  }, 500);
});

// keyboard accessibility
playerSlot.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') drawBtn.click();
});

// reset score
resetScoreBtn.addEventListener('click', () => {
  appState.wins = appState.losses = appState.draws = 0;
  saveScore();
  updateScoreUI();
});

// Custom card dialog
const customDialog = document.getElementById('customCardDialog');
const customizeBtn = document.getElementById('customizeBtn');
const customForm = document.getElementById('customForm');
const customName = document.getElementById('customName');
const customAttack = document.getElementById('customAttack');
const customDefense = document.getElementById('customDefense');
const cancelCustom = document.getElementById('cancelCustom');

customizeBtn.addEventListener('click', () => {
  try { customDialog.showModal(); } catch (e) { alert('Your browser may not support dialog element.'); }
});

cancelCustom.addEventListener('click', () => customDialog.close());

customForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = customName.value.trim() || 'Custom';
  const attack = Number(customAttack.value) || 5;
  const defense = Number(customDefense.value) || 5;
  const newCard = { id: Date.now(), name, attack, defense, emoji: '✨' };
  cards.push(newCard);
  customDialog.close();

  appState.playerCard = newCard;
  appState.computerCard = pickRandomCard(newCard.id);
  renderCard(playerSlot, appState.playerCard);

  setTimeout(() => {
    renderCard(computerSlot, appState.computerCard);
    const outcome = computeOutcome(appState.playerCard, appState.computerCard);

    if (outcome === 'win') {
      appState.wins++;
      showResult('You Win!', 'win');
    } else if (outcome === 'loss') {
      appState.losses++;
      showResult('You Lose!', 'loss');
    } else {
      appState.draws++;
      showResult('Draw!', 'draw');
    }

    updateScoreUI();
    saveScore();
  }, 500);
});

// init
loadScore();
resetBattle();
