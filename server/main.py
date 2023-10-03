from fastapi import FastAPI

from models import DictionaryResponse
from words import load_words

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    app.state.dictionary = await load_words()


@app.get("/dictionary")
async def get_dictionary() -> DictionaryResponse:
    return app.state.dictionary