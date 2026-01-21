from passlib.context import CryptContext
from jose import jwt

from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session

from app.db import get_session
from app.models.user import User
from dotenv import load_dotenv
import os 


load_dotenv()


# Technical Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Security Configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto",truncate_backends=[])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")



def get_password_hash(password: str) -> str:
    # Hash the password using bcryp
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    #Check if the plain password matches the hashed one
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    #Generate a JWT token with expiration time
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session)):
    #Login route.
    
    
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Validate existence and password
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or passwords",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create the JWT token 
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    # Decodes the JWT 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
        
    return user.id
