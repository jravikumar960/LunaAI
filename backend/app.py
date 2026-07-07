from fastapi import FastAPI, Body, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from reminder import start_reminder_service
from database import clear_messages
from documents import clear_documents
from vision import analyze_image
import requests

from automation import (
    init_automation,
    add_automation,
    get_automation,
    delete_automation,
)

from database import (
    init_database,
    save_message,
    get_messages,
)

from memory import (
    init_memory,
    save_memory,
    get_memory,
    get_all_memory,
    delete_memory,
    clear_memory,
)

from pdf import (
    save_pdf,
    extract_text,
)

from documents import (
    init_documents,
    save_document,
    get_documents,
    get_document,
    delete_document,
)

from files import (
    search_files,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

import config


class ChatRequest(BaseModel):
    message: str


@app.on_event("startup")
def startup():
    init_database()
    init_memory()
    init_documents()
    init_automation()
    start_reminder_service()

@app.get("/")
def home():
    return {
        "message": "Luna Backend Running"
    }


@app.get("/history")
def history():

    rows = get_messages()

    messages = []

    for role, content in rows:
        messages.append({
            "role": role,
            "content": content
        })

    return messages


@app.post("/chat")
def chat(data: ChatRequest):

    # Save user message
    save_message("user", data.message)
    # -------------------------
# Internet Search Detection
# -------------------------

    # -------------------------
    # Auto Save User Name
    # -------------------------
    text = data.message.strip()

    if text.lower().startswith("my name is "):
        name = text[11:].strip()
        save_memory("name", name)

    elif text.lower().startswith("i am "):
        name = text[5:].strip()
        save_memory("name", name)

    # -------------------------
    # Load Memory
    # -------------------------
    user_name = get_memory("name")
    pdf_text = get_memory("pdf_text")

    # Detect PDF-related questions
    pdf_keywords = [
        "pdf",
        "document",
        "resume",
        "summarize",
        "summary",
        "skills",
        "experience",
        "education",
        "project",
        "projects",
        "certification",
        "certifications",
    ]

    is_pdf_question = any(
        word in data.message.lower()
        for word in pdf_keywords
    )

    # -------------------------
    # Build Prompt
    # -------------------------
    if is_pdf_question:

        if not pdf_text:
            return {
                "response": "No PDF has been uploaded. Please upload a PDF first."
            }

        prompt = f"""
You are Luna.

You are a helpful AI assistant.

Answer ONLY using the following PDF.

PDF:

{pdf_text}

Question:

{data.message}
"""

    else:

        prompt = f"""
You are Luna.

You are a local desktop AI assistant.

Never introduce yourself as Qwen.

Always introduce yourself as Luna.

Current user's name:
{user_name if user_name else "Unknown"}

User:

{data.message}
"""

    # -------------------------
    # Call Ollama
    # -------------------------
    response = requests.post(
    OLLAMA_URL,
    json={
        "model": config.MODEL,
        "prompt": prompt,
        "stream": False,
    },
    timeout=120
)

    result = response.json()
    if "response" not in result:
        return {
            "response": "Luna couldn't generate a response."
        }
    ai_text = result["response"]

    # Save AI response
    save_message("assistant", ai_text)

    return result


# -------------------------
# Memory API
# -------------------------

@app.post("/memory")
def add_memory(data: dict = Body(...)):

    save_memory(
        data["key"],
        data["value"]
    )

    return {
        "success": True
    }


@app.get("/memory")
def memories():
    return get_all_memory()


@app.get("/memory/{key}")
def memory(key: str):

    value = get_memory(key)

    return {
        "key": key,
        "value": value
    }
@app.delete("/memory/{key}")
def delete_memory_api(key: str):

    delete_memory(key)

    return {
        "success": True
    }


@app.delete("/memory")
def clear_memory_api():

    clear_memory()

    return {
        "success": True
    }

# -------------------------
# PDF Upload API
# -------------------------

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    filepath = save_pdf(file)

    text = extract_text(filepath)

    save_memory(
        "pdf_text",
        text
    )

    save_document(
        file.filename,
        text
    )

    return {
        "success": True,
        "filename": file.filename,
        "characters": len(text)
    }

# -------------------------
# Vision API
# -------------------------

@app.post("/vision")
async def vision(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):

    import os

    os.makedirs("uploads", exist_ok=True)

    image_path = os.path.join(
        "uploads",
        image.filename
    )

    with open(image_path, "wb") as f:
        f.write(await image.read())

    answer = analyze_image(
        image_path,
        prompt
    )

    return {
        "response": answer
    }
# -------------------------
# Documents API
# -------------------------

@app.get("/documents")
def documents():
    docs = get_documents()
    return docs


@app.get("/documents/{doc_id}")
def document(doc_id: int):

    doc = get_document(doc_id)

    if doc is None:
        return {
            "error": "Document not found"
        }

    return doc


@app.delete("/documents/{doc_id}")
def remove_document(doc_id: int):

    delete_document(doc_id)

    return {
        "success": True
    }
@app.delete("/memory/{key}")
def delete_memory_api(key: str):
    delete_memory(key)
    return {"success": True}
# -------------------------
# Files API
# -------------------------

@app.get("/files/{keyword}")
def files(keyword: str):

    return search_files(keyword)

# -------------------------
# Automation API
# -------------------------

class AutomationRequest(BaseModel):
    title: str
    remind_at: str


@app.post("/automation")
def create_automation(data: AutomationRequest):

    add_automation(
        data.title,
        data.remind_at
    )

    return {
        "success": True
    }


@app.get("/automation")
def automations():

    return get_automation()


@app.delete("/automation/{automation_id}")
def remove_automation(automation_id: int):

    delete_automation(
        automation_id
    )

    return {
        "success": True
    }

# -------------------------
# Privacy API
# -------------------------

@app.delete("/privacy/all")
def clear_everything():

    clear_messages()
    clear_memory()
    clear_documents()

    return {
        "success": True
    }

# -------------------------
# Model APIs
# -------------------------

from pydantic import BaseModel


class ModelRequest(BaseModel):
    model: str


@app.get("/model")
def get_model():
    return {
        "model": config.MODEL
    }


@app.post("/model")
def change_model(data: ModelRequest):
    config.MODEL = data.model

    return {
        "success": True,
        "model": config.MODEL
    }

@app.delete("/history")
def clear_history():
    clear_messages()
    return {
        "success": True
    }
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
    )