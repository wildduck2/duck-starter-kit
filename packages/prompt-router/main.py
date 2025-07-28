import uvicorn
from fastapi import FastAPI, Request
from pydantic import BaseModel

from model.predict import classify

app = FastAPI()


class PromptRequest(BaseModel):
    prompt: str = ""


@app.post("/classify")
async def classify_route(data: PromptRequest):
    label = classify(data.prompt)
    return {"tools": label}


def main() -> None:
    uvicorn.run(app, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
