import os
from typing import List, Dict
import chromadb
from chromadb.config import Settings
from PIL import Image
import requests
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel
import numpy as np
import requests 
from tqdm.auto import tqdm 


def call_api(page):
    url = f"https://api.artic.edu/api/v1/artworks?page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['data']
    else:
        return None 
    
total_pages = 5000
ids = []
titles = []
alt_texts = []
image_ids = []
for page in tqdm(range(1, total_pages + 1)):
    data = call_api(page)
    if not data:
        break 
    
    for item in data:
        aw_id = item.get('id', None)
        image_id = item.get('image_id', None)
        title = item.get('title', None)
        thumbnail = item.get('thumbnail', None)
        if image_id and image_id and thumbnail and title:
            titles.append(title)
            alt_texts.append(thumbnail.get('alt_text', 'No alternative text'))
            image_ids.append(image_id)
            ids.append(aw_id)

# len(ids), len(titles), len(alt_texts), len(image_ids)


import os
from typing import List, Dict
import chromadb
from chromadb.config import Settings
from PIL import Image
import requests
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel
import numpy as np
import time

class ImageRetriever:
    def __init__(self):
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        self.chroma_client = chromadb.PersistentClient(
            path='image_embeddings'
        )
        
        self.collection = self.chroma_client.get_or_create_collection(
            name="image"
        )
    
    def get_image_embedding(self, image_url: str) -> np.ndarray:
        """Get embedding for a single image from URL"""
        try:
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content)).convert("RGB")
            
            inputs = self.processor(images=image, return_tensors="pt")
            with torch.no_grad():
                image_features = self.model.get_image_features(**inputs)
            
            embedding = image_features.numpy()[0]
            embedding = embedding / np.linalg.norm(embedding)
            return embedding
            
        except Exception as e:
            print(f"Error processing image {image_url}: {str(e)}")
            return None
    
    def add_images(self, ids: List[int], image_ids: List[str], titles: List[str], alt_texts: List[str]):
        """Add images to the database with associated titles"""
        embeddings = []
        valid_metadata = []
        valid_ids = []
        
        for _id, image_id, title, alt_text in zip(ids, image_ids, titles, alt_texts):
            url = f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg"
            embedding = self.get_image_embedding(url)
            if embedding is not None:
                embeddings.append(embedding.tolist())
                valid_metadata.append({"id": _id, "image_id": image_id, "title": title, "alt_text": alt_text})
                valid_ids.append(_id)
        
        if embeddings:
            self.collection.add(
                embeddings=embeddings,
                metadatas=valid_metadata,
                ids=[f"img_{i}" for i in range(len(valid_ids))]
            )
    
    def retrieve_similar_images(self, query_image_url: str, n_results: int = 5) -> List[Dict]:
        """Retrieve similar images based on a query image"""
        query_embedding = self.get_image_embedding(query_image_url)
        if query_embedding is None:
            return []
        
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=n_results
        )
        
        return [{"metadata": meta} for meta in results["metadatas"][0]]


# retriever = ImageRetriever()

# retriever.add_images(ids, image_ids, titles, alt_texts)

# query_url = 'https://www.artic.edu/iiif/2/a76844cc-cec8-6026-5609-50d3961aed4c/full/843,/0/default.jpg'
# similar_images = retriever.retrieve_similar_images(query_url, n_results=5)

# print("Similar images found:")
# for img in similar_images:
#     print(f"ID: {img['metadata'].get('id')}, Image_ID: {img['metadata'].get('image_id')}, Title: {img['metadata'].get('title')}, ALT_Text: {img['metadata'].get('title')}")
