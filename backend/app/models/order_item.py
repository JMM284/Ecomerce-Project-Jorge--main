from sqlmodel import SQLModel, Field
from typing import Optional


class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Relationships
    order_id: int = Field(foreign_key="order.id")
    product_id: int = Field(foreign_key="product.id")

    # Order details
    unit_price_cents: int
    quantity: int = Field(gt=0)
