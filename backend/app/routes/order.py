from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import engine
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.auth import get_current_user 
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/orders", tags=["orders"])

class CartItemSchema(BaseModel):
    product_id: int
    quantity: int

# Validate if the items in the cart are available and calculate the price
@router.post("/checkout")
def validate_checkout(cart_items: List[CartItemSchema]):
    with Session(engine) as db:
        total_cents = 0
        validated_items = []
        errors = []

        for item in cart_items:
            product = db.get(Product, item.product_id)
            if not product:
                errors.append(f"Product {item.product_id} not found")
                continue
            
            is_valid = product.stock >= item.quantity
            if not is_valid:
                errors.append(f"Insufficient stock for: {product.title}")

            total_cents += product.price_cents * item.quantity
            validated_items.append({
                "product_id": product.id,
                "valid": is_valid,
                "price": product.price_cents
            })

        return {
            "total_cents": total_cents,
            "items": validated_items,
            "errors": errors,
            "can_proceed": len(errors) == 0
        }

# Process the final purchase, update stock, and save the order in the database
@router.post("/")
def create_order(cart_items: List[CartItemSchema], user=Depends(get_current_user)):
    with Session(engine) as db:
        total_cents = 0
        
        # Initialize order
        new_order = Order(user_id=user, status="paid", total_cents=0)
        db.add(new_order)
        db.flush() # Get order ID before committing for order_id in OrderItem

        for item in cart_items:
            product = db.get(Product, item.product_id)
            
            # Stock validation
            if not product or product.stock < item.quantity:
                raise HTTPException(status_code=400, detail="Stock validation failed")
            
            # Update inventory
            product.stock -= item.quantity
            db.add(product)
            
            # Create order line item
            total_cents += product.price_cents * item.quantity
            db.add(OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                unit_price_cents=product.price_cents,
                quantity=item.quantity
            ))
            
        # Update final order total
        new_order.total_cents = total_cents
        db.add(new_order)
        
        db.commit()
        db.refresh(new_order)
        return {"order_id": new_order.id, "total": total_cents}

# Retrieve the order history
@router.get("/my-orders")
def get_my_orders(user=Depends(get_current_user)):
    with Session(engine) as db:
        # Retrieve all orders belonging to the authenticated user
        statement = select(Order).where(Order.user_id == user)
        results = db.exec(statement).all()
        return results