from pydantic import BaseModel, EmailStr
from typing import List, Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    


class CheckoutItem(BaseModel):
    product_id: int
    quantity: int


class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]