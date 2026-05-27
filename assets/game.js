const TOTAL_QUESTIONS = 20;
const MIN_VALUE = 0;
const MAX_VALUE = 40;

const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  labValue: 0,
  selectedOption: null,
  isLocked: false,
};

const elements = {
  progressText: document.getElementById('progressText'),
  scoreText: document.getElementById('scoreText'),
  questionEquation: document.getElementById('questionEquation'),
  dropZone: document.getElementById('dropZone'),
  feedbackText: document.getElementById('feedbackText'),
  optionsContainer: document.getElementById('optionsContainer'),
  optionsSection: document.getElementById('optionsSection'),
  goldenVisual: document.getElementById('goldenVisual'),
  goldenSection: document.getElementById('goldenSection'),
  labVisual: document.getElementById('labVisual'),
  labValueText: document.getElementById('labValueText'),
  summaryCard: document.getElementById('summaryCard'),
  summaryText: document.getElementById('summaryText'),
  restartButton: document.getElementById('restartButton'),
};

function emitPlatformEvent(type, payload = {}) {
  window.parent.postMessage(
    {
      source: 'edulab-game',
      type,
      payload,
      timestamp: new Date().toISOString(),
    },
    '*'
  );
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOperand(preferTens) {
  if (preferTens && Math.random() < 0.6) {
    const candidates = [10, 11, 12, 13, 14, 15, 18, 20, 22, 24, 25, 30];
    return candidates[randomInt(0, candidates.length - 1)];
  }

  return randomInt(0, 20);
}

function buildQuestion(index) {
  const preferTens = index > 6;
  const operation = Math.random() < 0.5 ? '+' : '-';
  const format = Math.random() < 0.5 ? 'missing_term' : 'missing_result';

  let left = chooseOperand(preferTens);
  let right = chooseOperand(preferTens);

  if (operation === '+') {
    while (left + right > MAX_VALUE) {
      left = chooseOperand(preferTens);
      right = chooseOperand(preferTens);
    }
  } else {
    if (right > left) {
      [left, right] = [right, left];
    }
  }

  const result = operation === '+' ? left + right : left - right;

  const unknownField = format === 'missing_term' ? (Math.random() < 0.5 ? 'left' : 'right') : 'result';

  const correctAnswer = unknownField === 'left' ? left : unknownField === 'right' ? right : result;

  return {
    left,
    right,
    result,
    operation,
    unknownField,
    correctAnswer,
    options: buildOptions(correctAnswer),
  };
}

function buildOptions(correct) {
  const optionSet = new Set([correct]);
  const offsets = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10, 4, -4];

  for (const offset of offsets) {
    const candidate = correct + offset;
    if (candidate >= MIN_VALUE && candidate <= MAX_VALUE) {
      optionSet.add(candidate);
    }
    if (optionSet.size >= 8) {
      break;
    }
  }

  while (optionSet.size < 8) {
    optionSet.add(randomInt(MIN_VALUE, MAX_VALUE));
  }

  const all = Array.from(optionSet).filter((value) => value !== correct);
  const incorrect = shuffle(all).slice(0, 3);
  return shuffle([correct, ...incorrect]);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createQuestions() {
  state.questions = Array.from({ length: TOTAL_QUESTIONS }, (_, index) => buildQuestion(index));
}

function equationParts(question) {
  const leftText = question.unknownField === 'left' ? '?' : String(question.left);
  const rightText = question.unknownField === 'right' ? '?' : String(question.right);
  const resultText = question.unknownField === 'result' ? '?' : String(question.result);
  return [leftText, question.operation, rightText, '=', resultText];
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  if (!question) {
    return;
  }

  state.selectedOption = null;
  state.isLocked = false;
  elements.progressText.textContent = `Questão ${state.currentIndex + 1} de ${TOTAL_QUESTIONS}`;
  elements.scoreText.textContent = `Pontuação: ${state.score}`;
  elements.feedbackText.textContent = '';
  elements.dropZone.textContent = 'Solte a resposta aqui';
  elements.dropZone.classList.remove('success', 'error');

  elements.questionEquation.innerHTML = '';
  equationParts(question).forEach((part) => {
    const node = document.createElement('span');
    node.textContent = part;
    elements.questionEquation.appendChild(node);
  });

  renderOptions(question.options);
  renderGoldenMaterial(question);
}

function renderOptions(options) {
  elements.optionsContainer.innerHTML = '';
  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.textContent = String(option);
    button.draggable = true;
    button.dataset.value = String(option);

    button.addEventListener('dragstart', (event) => {
      event.dataTransfer?.setData('text/plain', String(option));
    });

    button.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      state.selectedOption = option;
    });

    elements.optionsContainer.appendChild(button);
  });
}

function createGoldenCard(label, value) {
  const card = document.createElement('div');
  card.className = 'value-card';

  const title = document.createElement('div');
  title.className = 'value-title';
  title.textContent = `${label}: ${value}`;

  const blocks = document.createElement('div');
  blocks.className = 'blocks';

  const tens = Math.floor(value / 10);
  const units = value % 10;

  for (let i = 0; i < tens; i += 1) {
    const block = document.createElement('span');
    block.className = 'ten-block';
    blocks.appendChild(block);
  }

  for (let i = 0; i < units; i += 1) {
    const block = document.createElement('span');
    block.className = 'unit-block';
    blocks.appendChild(block);
  }

  card.appendChild(title);
  card.appendChild(blocks);

  return card;
}

function renderGoldenMaterial(question) {
  elements.goldenVisual.innerHTML = '';

  const showLeft = question.unknownField !== 'left';
  const showRight = question.unknownField !== 'right';
  const showResult = question.unknownField !== 'result';

  if (showLeft) {
    elements.goldenVisual.appendChild(createGoldenCard('Termo 1', question.left));
  }

  if (showRight) {
    elements.goldenVisual.appendChild(createGoldenCard('Termo 2', question.right));
  }

  if (showResult) {
    elements.goldenVisual.appendChild(createGoldenCard('Resultado', question.result));
  }

  renderLab();
}

function renderLab() {
  elements.labVisual.innerHTML = '';
  elements.labValueText.textContent = `Valor montado: ${state.labValue}`;
  elements.labVisual.appendChild(createGoldenCard('Montagem livre', state.labValue));
}

function goToNextQuestion() {
  state.currentIndex += 1;

  if (state.currentIndex >= TOTAL_QUESTIONS) {
    finishGame();
    return;
  }

  renderQuestion();
}

function answerCurrentQuestion(value) {
  if (state.isLocked) {
    return;
  }

  state.isLocked = true;
  const question = state.questions[state.currentIndex];
  const isCorrect = Number(value) === question.correctAnswer;

  elements.dropZone.textContent = String(value);

  if (isCorrect) {
    state.score += 1;
    elements.feedbackText.textContent = '✅ Muito bem! Você acertou.';
    elements.dropZone.classList.add('success');
    elements.dropZone.classList.remove('error');
  } else {
    elements.feedbackText.textContent = `❌ Quase! A resposta correta era ${question.correctAnswer}.`;
    elements.dropZone.classList.add('error');
    elements.dropZone.classList.remove('success');
  }

  elements.scoreText.textContent = `Pontuação: ${state.score}`;

  emitPlatformEvent('question_answered', {
    index: state.currentIndex + 1,
    correct: isCorrect,
    answer: Number(value),
    expected: question.correctAnswer,
    operation: question.operation,
  });

  emitPlatformEvent('score_updated', {
    score: state.score,
    answered: state.currentIndex + 1,
    total: TOTAL_QUESTIONS,
  });

  window.setTimeout(() => {
    goToNextQuestion();
  }, 900);
}

function finishGame() {
  document.querySelector('.question-card')?.classList.add('hidden');
  elements.optionsSection?.classList.add('hidden');
  elements.goldenSection?.classList.add('hidden');
  elements.summaryCard.classList.remove('hidden');
  elements.progressText.textContent = `Questão ${TOTAL_QUESTIONS} de ${TOTAL_QUESTIONS}`;
  elements.summaryText.textContent = `Você acertou ${state.score} de ${TOTAL_QUESTIONS} questões.`;

  emitPlatformEvent('game_finished', {
    score: state.score,
    total: TOTAL_QUESTIONS,
    percentage: Math.round((state.score / TOTAL_QUESTIONS) * 100),
  });
}

function restartGame() {
  state.currentIndex = 0;
  state.score = 0;
  state.labValue = 0;
  state.selectedOption = null;

  document.querySelector('.question-card')?.classList.remove('hidden');
  elements.optionsSection?.classList.remove('hidden');
  elements.goldenSection?.classList.remove('hidden');
  elements.summaryCard.classList.add('hidden');

  createQuestions();
  renderQuestion();
  emitPlatformEvent('game_started', { total_questions: TOTAL_QUESTIONS, restarted: true });
}

function setupInteractions() {
  elements.dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  elements.dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    const value = event.dataTransfer?.getData('text/plain');
    if (value !== undefined && value !== '') {
      answerCurrentQuestion(Number(value));
    }
  });

  elements.dropZone.addEventListener('click', () => {
    if (state.selectedOption !== null) {
      answerCurrentQuestion(state.selectedOption);
    }
  });

  elements.dropZone.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && state.selectedOption !== null) {
      answerCurrentQuestion(state.selectedOption);
    }
  });

  document.querySelectorAll('.lab-controls button').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'plus10') state.labValue = Math.min(MAX_VALUE, state.labValue + 10);
      if (action === 'minus10') state.labValue = Math.max(MIN_VALUE, state.labValue - 10);
      if (action === 'plus1') state.labValue = Math.min(MAX_VALUE, state.labValue + 1);
      if (action === 'minus1') state.labValue = Math.max(MIN_VALUE, state.labValue - 1);
      renderLab();
    });
  });

  elements.restartButton.addEventListener('click', restartGame);
}

function bootstrap() {
  createQuestions();
  setupInteractions();
  renderQuestion();

  emitPlatformEvent('game_started', {
    total_questions: TOTAL_QUESTIONS,
    mode: 'solo',
  });
}

bootstrap();
