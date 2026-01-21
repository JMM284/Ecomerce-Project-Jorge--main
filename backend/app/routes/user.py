from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.db import get_session 
from app.models.user import User
from app.schemas import UserCreate, UserRead, Token
from app.auth import get_password_hash, verify_password, create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])

# Register a new user
@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_session)): 
    # Check if the email already exists in the database
    statement = select(User).where(User.email == user_in.email)
    res = db.exec(statement).first()
    if res:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create the new user
    nuevo_usuario = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        is_admin=False
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

# Authenticate user and return a JWT access token
@router.post("/login", response_model=Token)
def login(user_in: UserCreate, db: Session = Depends(get_session)): 
    # Search user
    user = db.exec(select(User).where(User.email == user_in.email)).first()
    
    #Verify password
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password incorrect")
    
    # Create the JWT token
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}