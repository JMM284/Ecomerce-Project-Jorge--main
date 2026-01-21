from fastapi import APIRouter
from sqlmodel import Session, select
from app.models.order_item import OrderItem
from app.db import engine

router = APIRouter(prefix="/order-items", tags=["order-items"])

@router.get("/")
def get_order_items():
    with Session(engine) as session:
        items = session.exec(select(OrderItem)).all()
        return items

@router.post("/")
def create_order_item(item: OrderItem):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
        return item
