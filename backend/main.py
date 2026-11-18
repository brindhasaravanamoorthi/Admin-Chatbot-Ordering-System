
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import products, stock, orders

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Admin and Chatbot Ordering System")

# Allow frontend to connect with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all modules
app.include_router(products.router)
app.include_router(stock.router)
app.include_router(orders.router)


@app.get("/")
def home():
    return {
        "message": "Admin and Chatbot Ordering System API is running"
    }
