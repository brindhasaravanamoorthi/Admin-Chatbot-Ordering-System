from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import ProductCreate

router = APIRouter(prefix="/products", tags=["Products"])


# Add new product
@router.post("/")
def add_product(data: ProductCreate, db: Session = Depends(get_db)):

    existing = db.query(Product).filter(
        Product.name == data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Product already exists"
        )

    product = Product(
        name=data.name,
        price=data.price,
        stock=data.stock
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "message": "Product added successfully",
        "product": product.id
    }


# View all products
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


# Update product
@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(404, "Product not found")

    duplicate = db.query(Product).filter(
        Product.name == data.name,
        Product.id != product_id
    ).first()

    if duplicate:
        raise HTTPException(400, "Product name already exists")

    product.name = data.name
    product.price = data.price
    product.stock = data.stock

    db.commit()

    return {"message": "Product updated successfully"}


# Delete product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(404, "Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}