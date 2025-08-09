const cards = [
  { name: "Dragon", attack: 8, defense: 5, emoji: "🐉" },
  { name: "Knight", attack: 6, defense: 7, emoji: "🛡️" },
  { name: "Wizard", attack: 5, defense: 9, emoji: "🪄" },
  { name: "Goblin", attack: 4, defense: 4, emoji: "👺" },
  { name: "Archer", attack: 7, defense: 3, emoji: "🏹" }
];

// State
let wins = 0, losses = 0, draws = 0;

const playerCardEl = document.getElementById('playerCard');
const computerCardEl = document.getElementById('computerCard');
const resultEl = document.getElementById('result');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const drawsEl = document.getElementById('draws');
const battleBtn = document.getElementById('battleBtn');

// Pick random card
function pickRandomCard(excludeName) {
  const pool = excludeName ? cards.filter(c => c.name !== excludeName) : cards;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

// Render card info into container
function renderCard(container, card) {
  container.querySelector('.emoji').textContent = card.emoji;
  container.querySelector('.name').textContent = card.name;
  container.querySelector('.stats').innerHTML = `Attack: ${card.attack}<br />Defense: ${card.defense}`;
}

// Compute outcome based on attack/defense
function computeOutcome(player, computer) {
  const pScore = Math.max(0, player.attack - computer.defense);
  const cScore = Math.max(0, computer.attack - player.defense);
  if (pScore > cScore) return 'win';
  if (pScore < cScore) return 'loss';
  return 'draw';
}

// Update scoreboard
function updateScoreboard() {
  winsEl.textContent = wins;
  lossesEl.textContent = losses;
  drawsEl.textContent = draws;
}

// Show result message with color
function showResult(message, outcome) {
  resultEl.textContent = message;
  resultEl.className = 'result'; // reset classes
  if (outcome === 'win') resultEl.classList.add('win');
  else if (outcome === 'loss') resultEl.classList.add('loss');
  else resultEl.classList.add('draw');
}

// Main battle function
function battle() {
  const playerCard = pickRandomCard();
  const computerCard = pickRandomCard(playerCard.name);

  renderCard(playerCardEl, playerCard);
  renderCard(computerCardEl, computerCard);

  const outcome = computeOutcome(playerCard, computerCard);

  if (outcome === 'win') wins++;
  else if (outcome === 'loss') losses++;
  else draws++;

  updateScoreboard();
  showResult(
    outcome === 'win' ? 'You Win!' :
      outcome === 'loss' ? 'You Lose!' :
        'Draw!',
    outcome
  );
}

battleBtn.addEventListener('click', battle);

// Initialize scoreboard
updateScoreboard();
