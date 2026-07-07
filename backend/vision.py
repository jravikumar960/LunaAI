import base64
import requests

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"


def analyze_image(image_path, prompt):

    with open(image_path, "rb") as f:
        image = base64.b64encode(f.read()).decode("utf-8")

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llava:7b",
            "prompt": prompt,
            "images": [image],
            "stream": False,
        },
    )

    return response.json()["response"]