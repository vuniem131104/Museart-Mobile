from langchain_groq import ChatGroq
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain_chroma import Chroma
import os
import shutil
# from pydub import AudioSegment
from faster_whisper import WhisperModel
import tempfile
from dotenv import load_dotenv
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn
from groq import Groq
from typing import List, Dict
import chromadb
from chromadb.config import Settings
from PIL import Image
import requests
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel
import numpy as np

load_dotenv()

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

chroma_client = chromadb.PersistentClient(path="./image_embeddings")

collection = chroma_client.get_or_create_collection(name="image")


def get_image_embedding(image_url: str) -> np.ndarray:
    try:
        if image_url.startswith("http"):
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content)).convert("RGB")
        else:
            image = Image.open(image_url).convert("RGB")

        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)

        embedding = image_features.numpy()[0]
        embedding = embedding / np.linalg.norm(embedding)
        return embedding

    except Exception as e:
        print(f"Error processing image {image_url}: {str(e)}")
        return None


def retrieve_similar_images(query_image_url: str, n_results: int = 5) -> List[Dict]:
    query_embedding = get_image_embedding(query_image_url)
    if query_embedding is None:
        return []

    results = collection.query(
        query_embeddings=[query_embedding.tolist()], n_results=n_results
    )

    return [
        {"metadata": meta, "distance": dist}
        for meta, dist in zip(results["metadatas"][0], results["distances"][0])
    ]


app = FastAPI()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

llm = ChatGroq(api_key=os.getenv("GROQ_API_KEY"), model=MODEL)

prompt = ChatPromptTemplate.from_template(
    """
    Answer the questions based on the provided context only.
    Please provide the most accurate respone based on the question
    <context>
    {context}
    <context>
    Question:{input}

    """
)

embedding_function = OllamaEmbeddings(model="mxbai-embed-large")
embeddings = Chroma(
    persist_directory="./art_products",
    collection_name="art_collection",
    embedding_function=embedding_function,
)

retriever = embeddings.as_retriever()

document_chain = create_stuff_documents_chain(llm, prompt)

contextualize_q_system_prompt = (
    "Given a chat history and the latest user question"
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the "
    "answer concise."
    "\n\n"
    "{context}"
)
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_chain)

store = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    input_text = data.get("input")
    answer = conversational_rag_chain.invoke(
        {"input": input_text}, config={"configurable": {"session_id": "default"}}
    )
    return JSONResponse(content={"answer": answer["answer"]})


@app.post("/image_search")
async def image_search(file: UploadFile = File(...)):
    temp_image_path = f"temp_{file.filename}"
    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = retrieve_similar_images(temp_image_path, n_results=5)
    answer = []
    for result in results:
        answer.append(
            {
                "id": result["metadata"]["id"],
                "image_id": result["metadata"]["image_id"],
                "title": result["metadata"]["title"],
                "alt_text": result["metadata"]["alt_text"],
            }
        )

    os.remove(temp_image_path)
    return JSONResponse(content={"answer": answer})


model_stt = WhisperModel("base")


@app.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
        temp_path = temp_file.name
        audio_data = await audio.read()
        temp_file.write(audio_data)

    segments, _ = model_stt.transcribe(temp_path)
    transcript = "".join([segment.text for segment in segments])

    return {"text": "blooming plant"}


@app.post("/summary")
async def summary_article(request: Request):
    data = await request.json()
    title = data.get("title", "")
    content = data.get("content", "")
    if not title or not content:
        return JSONResponse(
            content={"error": "Title and content are required."}, status_code=400
        )

    system_prompt = """
    You are a summarization assistant. Your sole task is to read the input article and return a clear, concise summary based on the content.
    Do not explain your process, do not add introductions or conclusions, and do not say anything besides the summary itself.
    The summary must:

    Focus on the key points of the article.

    Use neutral, informative language.  

    Fit within the specified length (e.g., short paragraph or 3–5 sentences).

    Mention any significant details like people, events, techniques, or materials.
    Output only the summary. No commentary, no formatting, no extra text.
    """

    user_prompt = f"""
    Please summarize the following article about an art exhibition:
    Title: {title}\n
    Content: {content}
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        temperature=0.3,
    )

    return JSONResponse(content={"summary": chat_completion.choices[0].message.content})


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, host="0.0.0.0", reload=True)
