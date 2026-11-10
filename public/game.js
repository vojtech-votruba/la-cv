const katexOptions = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true }
  ],
  throwOnError: false
};

function renderMath(element) {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(element || document.body, katexOptions);
  }
}

function goToScene(sceneId) {
  document.querySelectorAll('.scene').forEach(scene => {
    scene.classList.remove('active');
  });
  
  const targetScene = document.getElementById(sceneId);
  if (targetScene) {
    targetScene.classList.add('active');
    renderMath(targetScene);
  }
}

function checkAnswer(userChoice, nextSceneId, isCorrectAnswer) {
  const activeScene = document.querySelector('.scene.active');
  if (!activeScene) return;

  const feedbackEl = activeScene.querySelector('.feedback');
  const isCorrect = (userChoice === isCorrectAnswer);

  if (isCorrect) {
    if (feedbackEl) {
      feedbackEl.style.color = '#4CAF50';
      feedbackEl.innerText = activeScene.dataset.feedbackCorrect || 'Správně!';
      renderMath(feedbackEl);
    }
    setTimeout(() => {
      if (feedbackEl) feedbackEl.innerText = '';
      goToScene(nextSceneId);
    }, 1800);
  } else {
    if (feedbackEl) {
      feedbackEl.style.color = '#F44336';
      feedbackEl.innerText = activeScene.dataset.feedbackWrong || 'Vedle! Zkus to znovu.';
      renderMath(feedbackEl);
    }
  }
}

function selectOption(buttonEl, value) {
  const group = buttonEl.closest('.answer-group');
  group.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
  
  buttonEl.classList.add('selected');
  buttonEl.dataset.selectedValue = value;
}

function checkMultiAnswer(nextSceneId) {
  const activeScene = document.querySelector('.scene.active');
  if (!activeScene) return;

  const feedbackEl = activeScene.querySelector('.feedback');
  const items = activeScene.querySelectorAll('.quiz-item');
  
  let allAnswered = true;
  let allCorrect = true;

  items.forEach(item => {
    const selectedBtn = item.querySelector('button.selected');
    if (!selectedBtn) {
      allAnswered = false;
      return;
    }

    const userVal = selectedBtn.dataset.selectedValue === 'true';
    const correctVal = item.dataset.correct === 'true';

    if (userVal !== correctVal) {
      allCorrect = false;
    }
  });

  if (!allAnswered) {
    if (feedbackEl) {
      feedbackEl.style.color = '#E65100';
      feedbackEl.innerText = 'Musíš zodpovědět všechny otázky!';
      renderMath(feedbackEl);
    }
    return;
  }

  if (allCorrect) {
    if (feedbackEl) {
      feedbackEl.style.color = '#4CAF50';
      feedbackEl.innerText = activeScene.dataset.feedbackCorrect || 'Vše správně!';
      renderMath(feedbackEl);
    }
    setTimeout(() => {
      if (feedbackEl) feedbackEl.innerText = '';
      goToScene(nextSceneId);
    }, 1800);
  } else {
    if (feedbackEl) {
      feedbackEl.style.color = '#F44336';
      feedbackEl.innerText = activeScene.dataset.feedbackWrong || 'Některé odpovědi jsou špatně!';
      renderMath(feedbackEl);
    }
  }
}

function initGame() {
  renderMath(document.body);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

window.addEventListener('load', initGame);