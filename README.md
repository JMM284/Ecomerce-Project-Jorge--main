# Ecomerce-Project-Jorge-

## Project Overview

This project is my e-commerce web application developed.
It allows users to browse a product catalog, manage a shopping cart, register and log in, place orders,and view their order history.

The application is composed of two parts:
- The Backend that is built with FastAPI and SQLModel.
- The Frontend built with React and TypeScript.

## Setup Instructions

### Backend
1. Navigate to the `/backend` folder.
2. Install the dependencies: `pip install -r requirements.txt`.
3. Start the virtual environment: `.\venv\Scripts\Activate.ps1` and activate it.
4. Run the server: `fastapi dev main.py`

### Frontend
1. Navigate to the `/frontend` folder.
2. Install the dependencies: `yarn install`.
3. Run the application: `yarn dev`.

## Tech used on each part 

### Backend
- Python
- FastAPI
- SQLModel
- JWT for authentication

### Frontend
- React
- TypeScript

## Project Structure

Ecomerce-Project-Jorge--main/
│
├── backend/ # FastAPI backend
│ ├── models/ # Database models
│ ├── routers/ # API routes
│ ├── services/ # Business logic
│ ├── main.py # The entry point of the application
│ └── ...
│
├── frontend/
│ └── react-router/ # React + TypeScript frontend
│ ├── src/
│ │ ├── pages/ # Application views
│ │ ├── api/   # Functions to communicate with the backend 
│ │ ├── models/ # Data models
│ │ ├── components/# Reusable components
│ │ ├── services/ # API communication
│ │ └── ...
│ └── ...

##  Data Models

### User
- id (int, primary key)
- email (string, unique)
- password_hash (string)
- is_admin (boolean)
- created_at (datetime)

### Product
- id (int, primary key)
- title (string)
- slug (string, unique)
- description (text)
- price_cents (int)
- currency (string)
- stock (int)
- created_at (datetime)
- updated_at (datetime)

### Order
- id (int, primary key)
- user_id (foreign key)
- status (pending, paid, cancelled)
- total_cents (int)
- currency (string)
- created_at (datetime)

### OrderItem
- id (int, primary key)
- order_id (foreign key)
- product_id (foreign key)
- unit_price_cents (int)
- quantity (int)

## API Structure

The backend exposes an API with this routes groups:

| Route Group | Prefix      | Purpose                               |
|------------|-------------|--------------------------------------- |
| Health     | /health     | Basic API health check                 |
| Auth       | /auth       | Control User registration and login     |
| Products  | /products   | Product catalog and detail view         |
| Checkout  | /checkout   | Cart validation before ordering         |
| Orders    | /orders     | Create and view orders                  |

## Frontend Views

### Product Catalog
- Displays products retrieved from the backend
- Includes basic search for searching products by their name 
### Product Detail
- Displays product information 
- Allows adding products to the cart and you can selected quantity

## Cart
- Shows added products that the user wants to buy
- Allows quantity modification and removal of items 
- Displays total price
### Checkout
- Validates cart data with the backend
- Allows order confirmation for logged-in users

### Authentication
- Login and registration pages

### Orders History
- Displays previous orders that the user do. It's for authenticated users

## Authentication
Authentication is handled using JSON Web Tokens (JWT):
- Users can register and log in.
- Protected endpoints require a valid JWT.
- Only authenticated users can buy items in the chart and access  to the order history.

## Design and Architecture Decisions
- Price Handling: Prices are stored as price_cents to avoid floating-point and precision errors during calculations.
- Database Choice: I migrated from SQLite to PostgreSQL on Render to ensure data persistence.
- Security: Implementation of JWT-based authentication ensures that only logged-in users can access to the checkout and order history views.

## Deployment
This project could be used in local storages using fast api and yarn. Also it could be deployed in this links: 

### Deployment Links
Frontend URL: https://ecomerce-project-jorge-main.vercel.app

Backend URL: https://ecomerce-project-jorge-main.onrender.com

### Backend Deployment

Relational Database: I have used PostgreSQL, which is managed in Render, for data storage. This ensures that user, product, and order information is not lost when the server is restarted.

Data Initialisation: I have developed a seeds.py script that populates the database with products. This allows the application to have data to demonstrate how it works.

## Documentation

The following official documentation resources were used during the development of this project:

- FastAPI Documentation  
  https://fastapi.tiangolo.com/

- SQLModel Documentation  
  https://sqlmodel.tiangolo.com/

- React Documentation  
  https://react.dev/

- TypeScript Documentation  
  https://www.typescriptlang.org/docs/

- JSON Web Tokens (JWT)  
  https://jwt.io/introduction

- Render (Backend deployment)  
  https://render.com/docs/deploy-fastapi

- Vercel (Frontend deployment)  
  https://vercel.com/docs