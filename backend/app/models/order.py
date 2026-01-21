from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")

    status: str = Field(default="pending")
    total_cents: int
    currency: str = Field(default="USD")

    created_at: datetime = Field(default_factory=datetime.utcnow)
