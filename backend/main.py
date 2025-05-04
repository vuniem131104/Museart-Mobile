from langchain_groq import ChatGroq
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain_chroma import Chroma
import os 
import shutil
from dotenv import load_dotenv
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn
# from image_retrieval import ImageRetriever
load_dotenv()

# image_retriever = ImageRetriever()

app = FastAPI()

llm = ChatGroq(api_key=os.getenv("GROQ_API_KEY"), model="llama3-70b-8192")

# prompt = ChatPromptTemplate.from_template(
#     """
#     Answer the questions based on the provided context only.
#     Please provide the most accurate respone based on the question
#     <context>
#     {context}
#     <context>
#     Question:{input}

#     """
# )

# embedding_function = OllamaEmbeddings(model="mxbai-embed-large")
# embeddings = Chroma(persist_directory="/home/vuiem/museart/backend/art_products", collection_name="art_collection" , embedding_function=embedding_function)

# retriever = embeddings.as_retriever()

# document_chain = create_stuff_documents_chain(llm, prompt)

# contextualize_q_system_prompt=(
#             "Given a chat history and the latest user question"
#             "which might reference context in the chat history, "
#             "formulate a standalone question which can be understood "
#             "without the chat history. Do NOT answer the question, "
#             "just reformulate it if needed and otherwise return it as is."
#         )

# contextualize_q_prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", contextualize_q_system_prompt),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{input}")
#     ]
# )

# history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

# system_prompt = (
#                 "You are an assistant for question-answering tasks. "
#                 "Use the following pieces of retrieved context to answer "
#                 "the question. If you don't know the answer, say that you "
#                 "don't know. Use three sentences maximum and keep the "
#                 "answer concise."
#                 "\n\n"
#                 "{context}"
#             )
# qa_prompt = ChatPromptTemplate.from_messages(
#         [
#             ("system", system_prompt),
#             MessagesPlaceholder("chat_history"),
#             ("human", "{input}"),
#         ]
#     )

# question_chain = create_stuff_documents_chain(llm, qa_prompt)

# rag_chain = create_retrieval_chain(history_aware_retriever, question_chain)

# store = {}

# def get_session_history(session_id:str)->BaseChatMessageHistory:
#     if session_id not in store:
#         store[session_id]=ChatMessageHistory()
#     return store[session_id]
    
# conversational_rag_chain=RunnableWithMessageHistory(
#     rag_chain,get_session_history,
#     input_messages_key="input",
#     history_messages_key="chat_history",
#     output_messages_key="answer"
# )

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    input_text = data.get("input")
    # answer = conversational_rag_chain.invoke({
    #     "input": input_text
    # }, config={
    #     "configurable": {"session_id": "default"}
    # })
    print(input_text)
    answer = llm.invoke([
        {"role": "user", "content": input_text}
    ])
    # answer = {
    #     "answer": "Hello"
    # }
    return JSONResponse(content={"answer": answer.content})

@app.post("/image_search")
async def image_search(file: UploadFile = File(...)):
    # temp_image_path = f"temp_{file.filename}"
    # with open(temp_image_path, "wb") as buffer:
    #     shutil.copyfileobj(file.file, buffer)

    # Here you would process the image with your image retriever
    # For now, we'll return test data in the correct format
    answer = [
        {   
            "id": 24202,
            "image_id": "e127aa5e-2154-5116-76e1-0c3f0c4a7cb4",
            "title": "The Great Wave off Kanagawa",
            "alt_text": "A beautiful image of a cat"
        },
        {   
            "id": 24202,
            "image_id": "e127aa5e-2154-5116-76e1-0c3f0c4a7cb4",
            "title": "The Great Wave off Kanagawa",
            "alt_text": "A beautiful image of a cat"
        },
        {   
            "id": 24202,
            "image_id": "e127aa5e-2154-5116-76e1-0c3f0c4a7cb4",
            "title": "The Great Wave off Kanagawa",
            "alt_text": "A beautiful image of a cat"
        }
    ]

    # os.remove(temp_image_path)

    # result = []
    # for item in answer:
    #     result.append({
    #         "title": item["metadata"]["title"],
    #         "url": item["url"],
    #         "text": item["metadata"]["text"]
    #     })
    return JSONResponse(content={"answer": answer})

if __name__ == "__main__":
    # uvicorn.run("main:app", port=8000, host="0.0.0.0", reload=True)
    input_text = "Hello"
    print(llm)
    answer = llm.invoke([
        {"role": "user", "content": input_text}
    ])
    print(answer.content)
