from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select, col
from typing import Optional
from app.db import engine
from app.models.product import Product

router = APIRouter(prefix="/products", tags=["products"])

# Get all products or filter them by title
@router.get("/")
def get_products(q: Optional[str] = None):
    with Session(engine) as db:
        statement = select(Product)
        if q:
            statement = statement.where(Product.title.contains(q))
        return db.exec(statement).all()
    
# Retrieve a single product by its ID
@router.get("/{product_id}")
def get_product(product_id: int):
    with Session(engine) as db:
        product = db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

# Decrease the stock of a product after a successful purchase
@router.patch("/{product_id}/reduce_stock")
def reduce_stock(product_id: int, quantity: int):
    with Session(engine) as db:
        product = db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product.stock < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock available")
        
        product.stock -= quantity
        db.add(product)
        db.commit()
        db.refresh(product)

        return {"message": "Stock updated", "new_stock": product.stock}