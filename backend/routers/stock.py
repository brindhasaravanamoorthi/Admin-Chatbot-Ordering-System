from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import StockUpdate

router = APIRouter(prefix="/stock", tags=["Stock"])


# View all stock details
@router.get("/")
def view_stock(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "stock": p.stock,
            "status": "Low Stock" if p.stock < 5 else "Available"
        }
        for p in products
    ]


# Update stock quantity
@router.put("/{product_id}")
def update_stock(
    product_id: int,
    data: StockUpdate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.stock = data.stock

    db.commit()

    return {
        "message": "Stock updated successfully",
        "product": product.name,
        "remaining_stock": product.stock,
        "status": "Low Stock" if product.stock < 5 else "Available"
    }