from pydantic import BaseModel

class DictionaryItem(BaseModel):
    japanese: str
    exampleSentence: str

class DictionaryResponse(BaseModel):
    words: dict[str, list[DictionaryItem]]