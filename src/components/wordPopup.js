import { db } from "../db";



/**
 * 
 * @param {HTMLDivElement} root The root of the word popup
 */
export const WordPopup = (root) => {
    // Properties
    const self = {
        root,
        stagedWord: '',
        stagedX: 0,
        stagedY: 0,
        dbConnection: db(),
    }

    const xToScreenX = (x) => x + window.scrollX;
    const yToScreenY = (y) => y + window.scrollY;
    const classToPopupClass = (className) => `tech-translator-word-popup-${className}`

    const stageMove = (x, y) => {
        self.stagedX = xToScreenX(x);
        self.stagedY = yToScreenY(y);
    }

    const move = (x, y) => {
        self.root.style.top = `${y}px`;
        self.root.style.left = `${x}px`;
    };

    const show = () => {
        self.root.classList.remove(classToPopupClass('hidden'));
    };

    const hide = () => {
        self.root.classList.add(classToPopupClass('hidden'));
    };

    const has = (elem) => {
        return self.root.contains(elem);
    }

    const stageWord = (word) => {
        self.stagedWord = word;
    };

    const createTranslationSection = (english, japanese, exampleSentence) => {
        const container = document.createElement('div');
        container.classList.add(classToPopupClass('translation-container'));

        const englishSpan = document.createElement('span');
        englishSpan.classList.add(classToPopupClass('english'));
        englishSpan.innerText = english;

        const japaneseSpan = document.createElement('span');
        japaneseSpan.classList.add(classToPopupClass('japanese'));
        japaneseSpan.innerText = japanese;

        const exampleSentenceSpan = document.createElement('span');
        exampleSentenceSpan.classList.add(classToPopupClass('example-sentence'));
        exampleSentenceSpan.innerText = `【例文】${exampleSentence}`;

        const addTangoCardButton = document.createElement('button');
        addTangoCardButton.classList.add(classToPopupClass('add-tango-card-button'));
        addTangoCardButton.innerText = '単語カードに追加';

        container.appendChild(englishSpan);
        container.appendChild(japaneseSpan);
        container.appendChild(exampleSentenceSpan);
        container.appendChild(addTangoCardButton);

        return container;
    };

    const clearTranslations = () => {
        self.root.replaceChildren();
    }

    const pushWord = async () => {
        const result = await self.dbConnection.getEnglish(self.stagedWord);

        clearTranslations();

        if (result === undefined) {
            return;
        }

        const translationSection = createTranslationSection(
            self.stagedWord,
            result.japanese,
            result.exampleSentence,
        );

        self.root.appendChild(translationSection);
    };

    return {
        stageMove,
        move: () => { move(self.stagedX, self.stagedY) },
        show,
        hide,
        has,
        stageWord,
        pushWord,
        get word() {
            return wordSpan.innerHTML;
        },
        get stagedWord() {
            return self.stagedWord;
        },
        get x() {
            return self.root.style.left;
        },
        get y() {
            return self.root.style.top;
        },
        get visible() {
            return !self.root.classList.contains(classToPopupClass('hidden'));
        }
    }
};