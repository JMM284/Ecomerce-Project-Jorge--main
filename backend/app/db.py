from sqlmodel import Session, SQLModel, create_engine
from pathlib import Path

# Database path configuration
BASE_DIR = Path(__file__).resolve().parent
sqlite_file_path = BASE_DIR / "database.db"
sqlite_url = f"sqlite:///{sqlite_file_path}"

# SQLite arguments
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    # Creates database tables.
    from app.models.user import User
    from app.models.product import Product
    from app.models.order import Order
    from app.models.order_item import OrderItem
    
    SQLModel.metadata.create_all(engine)

def get_session():
    
    with Session(engine) as session:
        yield session