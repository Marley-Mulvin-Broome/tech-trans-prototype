import json

from models import DictionaryResponse

async def load_words() -> DictionaryResponse:
    with open("dictionary.json", encoding='utf-8') as f:
        j = json.load(f)

        return DictionaryResponse(words=j["words"])