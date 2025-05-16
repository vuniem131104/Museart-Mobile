from typing import List, Dict
import chromadb
from chromadb.config import Settings
from PIL import Image
import requests
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel
import numpy as np

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

chroma_client = chromadb.PersistentClient(
    path='image_embeddings'
)

collection = chroma_client.get_or_create_collection(
    name="image"
)

def get_image_embedding(image_url: str) -> np.ndarray:
    """Get embedding for a single image from URL"""
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
    """Retrieve similar images based on a query image"""
    query_embedding = get_image_embedding(query_image_url)
    if query_embedding is None:
        return []
    
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results
    )
    
    return [
        {
            "metadata": meta,
            "distance": dist
        }
        for meta, dist in zip(
            results["metadatas"][0],
            results["distances"][0]
        )
    ]


# query_url = 'test.png'
# similar_images = retrieve_similar_images(query_url, n_results=5)

# print("Similar images found:")
# for img in similar_images:
#     print(f"ID: {img['metadata'].get('id')}, Image_ID: {img['metadata'].get('image_id')}, Title: {img['metadata'].get('title')}, ALT_Text: {img['metadata'].get('alt_text')}")
