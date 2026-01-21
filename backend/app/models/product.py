from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    title: str
    slug: str = Field(unique=True, index=True)
    description: str

    price_cents: int
    currency: str = Field(default="USD")

    stock: int

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
