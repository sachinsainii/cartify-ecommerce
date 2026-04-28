# 🛒 Cartify - E-commerce Web Application

A full-stack e-commerce platform built with Django (backend) and React (frontend), supporting authentication, product management, cart management, and order processing.

## 🚀 Features
- JWT Authentication (Login/Signup)
- Product Listing & Category Filtering
- Add to Cart & Order Placement
- REST API Integration
- Responsive UI

## 🛠 Tech Stack
**Backend:** Django, Django REST Framework  
**Frontend:** React (Vite), Tailwind CSS  
**Database:** PostgreSQL / SQLite  

## 📁 Project Structure
ecommerce-app/
│── backend(ecom)/          # Django project
│── frontend/               # React app
│── requirements.txt
│── README.md
│── .gitignore


## ⚙️ Setup Instructions

### Backend:
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver

### Frontend:
cd frontend
npm install
npm run dev

## Clean .gitignore
__pycache__/
*.pyc
.env
db.sqlite3
node_modules/
dist/
