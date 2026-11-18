# Admin & Chatbot Ordering System

## Project Overview
The Admin & Chatbot Ordering System is a web-based application that helps manage drink products, stock quantities, and customer orders through a chatbot.

## Technologies Used
- Python
- FastAPI
- SQLite
- HTML
- CSS
- JavaScript
- Web Speech API

## Main Modules

### 1. Admin Module
- Add new drinks
- View available products
- Edit product details
- Delete products

### 2. Stock Management
- View stock quantities
- Update stock manually
- Display low-stock warnings when quantity is below 5
- Automatically reduce stock after successful orders

### 3. Customer Chatbot
- View available drinks and prices
- Select drinks using text or voice
- Enter order quantity
- Check product availability
- Receive order confirmation
- Voice responses from the chatbot

## How to Run

1. Open the backend folder in the terminal.
2. Activate the Python virtual environment.
3. Install dependencies using `pip install -r requirements.txt`.
4. Start the server:

```bash
uvicorn main:app --reload
```

5. Open the frontend HTML files using VS Code Live Server.

## Database
SQLite is used to store product, stock, and order information.

## Project Status
Core project features implemented and tested.