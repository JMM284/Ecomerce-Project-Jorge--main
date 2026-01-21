from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import create_db_and_tables 
from app.routes import user, product, order, order_item, health
from app.auth import router as auth_router
from app.seed import cargar_datos

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    cargar_datos()
    yield

app = FastAPI(title="Backend E-commerce", lifespan=lifespan, redirect_slashes=False)
origins = [
    "http://localhost:5173",          
    "https://ecomerce-project-jorge-main.vercel.app", 
]
# Cors Configuration for conections to react frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registering routers
app.include_router(user.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(order_item.router)
app.include_router(health.router)
app.include_router(auth_router)


@app.get("/")
def index():
    return {"status": "ok", "message": "API working properly"}