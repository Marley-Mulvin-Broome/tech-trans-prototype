const databaseUrl = 'http://127.0.0.1:8000/dictionary'

/**
 * Database of English words with their Japanese translations
 */
export const db = () => {
    const initialise = async () => {
        const result = await chrome.storage.local.get(['db']);

        if ('db' in result) {
            return;
        }

        const response = await fetch(databaseUrl);

        const data = await response.json();

        await chrome.storage.local.set({ db: {...data} });
    }

    /**
     * Gets the database object
     * @returns {Object}
     */
    const getDb = async () => {
        const result = await chrome.storage.local.get(['db']);

        if (!('db' in result)) {
            await initialise();
        }

        console.log(result.db);

        return result.db;
    }

    const insert = async (english, japanese, exampleSentence) => {
        const db = await getDb();

        db[english.toLowerCase()] = {
            japanese,
            exampleSentence,
        };

        await chrome.storage.local.set({ db });
    }

    /**
     * Gets an English word from the database
     * @param {string} english English word to get
     * @returns 
     */
    const getEnglish = async (english) => {
        const db = await getDb();

        return db[english.toLowerCase().trim()];
    }

    return {
        initialise,
        insert,
        getEnglish,
    }
}