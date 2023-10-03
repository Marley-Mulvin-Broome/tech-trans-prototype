'use strict';

import { WordPopup } from "./components/wordPopup";
import { getWordAtPoint } from "./util";

/**
 * @type {WordPopup}
 */
let wordPopup = null;
let wordPopupElement = null;

const setupWordPopup = () => {
  fetch(chrome.runtime.getURL('/components/wordPopup.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    // not using innerHTML as it would break js event listeners of the page
    wordPopupElement = document.getElementById('tech-translator-word-popup');
    wordPopup = WordPopup(wordPopupElement);
    wordPopup.hide();
  });
};

setupWordPopup();

document.addEventListener('mousemove', (e) => {
  wordPopup?.stageMove(e.clientX + 10, e.clientY - 10);

  const word = getWordAtPoint(e.target, e.x, e.y);
  
  wordPopup?.stageWord(word);
});

document.addEventListener('keypress', async (e) => {
  if (e.key !== 'Q') {
    return;
  }

  if (wordPopup?.stagedWord === null) {
    wordPopup?.hide();
    return;
  }

  wordPopup?.move();
  await wordPopup?.pushWord();
  wordPopup?.show();
});

document.addEventListener('click', (e) => {
  if (wordPopup?.has(e.target)) {
    return;
  }

  wordPopup?.hide();
});