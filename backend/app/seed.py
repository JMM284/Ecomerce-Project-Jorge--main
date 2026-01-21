import sys
import os
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models.product import Product
from datetime import datetime

# Configuración de rutas
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def cargar_datos():
    print("Iniciando creación de base de datos...")
    create_db_and_tables()

    with Session(engine) as session:
        busqueda = select(Product)
        resultado = session.exec(busqueda).first()
        
        if resultado:
            print("La base de datos ya tiene productos. Saltando carga.")
            return

        print("Añadiendo productos...")
        #Product AI generated sample data
        lista_productos = [
            Product(
                title="Móvil Samsung G3", 
                slug="samsung-g3", 
                description="Un móvil básico con buena batería.", 
                price_cents=25000, 
                currency="USD",
                stock=20
            ),
            Product(
                title="iPhone 13", 
                slug="iphone-13", 
                description="Modelo anterior pero muy potente.", 
                price_cents=60000, 
                currency="USD",
                stock=10
            ),
            Product(
                title="Cascos Sony", 
                slug="cascos-sony", 
                description="Auriculares con cable y buen sonido.", 
                price_cents=3000, 
                currency="USD",
                stock=20
            ),
            Product(
                title="Ratón Gaming", 
                slug="raton-gaming", 
                description="Tiene luces RGB y es muy rápido.", 
                price_cents=2500, 
                currency="USD",
                stock=15
            ),
            Product(
                title="Teclado Mecánico", 
                slug="teclado-mec", 
                description="Teclado para escribir cómodo.", 
                price_cents=4500, 
                currency="USD",
                stock=8
            ),
            Product(
                title="Monitor 24 pulgadas", 
                slug="monitor-24", 
                description="Pantalla Full HD para trabajar.", 
                price_cents=12000, 
                currency="USD",
                stock=6
            ),
            Product(
                title="Cargador USB-C", 
                slug="cargador-c", 
                description="Carga rápida para cualquier móvil.", 
                price_cents=1500, 
                currency="USD",
                stock=50
            ),
            Product(
                title="Funda para portátil", 
                slug="funda-laptop", 
                description="Color negro y acolchada.", 
                price_cents=2000, 
                currency="USD",
                stock=12
            ),
            Product(
                title="Altavoz Bluetooth", 
                slug="altavoz-bt", 
                description="Pequeño pero suena muy fuerte.", 
                price_cents=3500, 
                currency="USD",
                stock=4
            ),
            Product(
                title="Webcam HD", 
                slug="webcam-hd", 
                description="Para hacer videollamadas claras.", 
                price_cents=5000, 
                currency="USD",
                stock=0 # Out of stock for testing
            )
        ]

        session.add_all(lista_productos)
        session.commit()
        print(" 10 productos guardados con éxito en database.db")

if __name__ == "__main__":
    cargar_datos()