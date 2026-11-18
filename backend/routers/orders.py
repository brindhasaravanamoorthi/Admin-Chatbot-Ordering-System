
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Order
from schemas import OrderCreate

router = APIRouter(prefix="/orders", tags=["Orders"])


# Place customer order
@router.post("/")
def place_order(
    data: OrderCreate,
    db: Session = Depends(get_db)
):

    try:
        product = db.query(Product).filter(
            Product.id == data.product_id
        ).with_for_update().first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        # Check stock availability
        if product.stock < data.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Only {product.stock} {product.name} available"
            )

        # Calculate total price
        total = product.price * data.quantity

        # Deduct stock
        product.stock -= data.quantity

        # Save order
        order = Order(
            product_id=product.id,
            quantity=data.quantity,
            total_price=total,
            status="Confirmed"
        )

        db.add(order)
        db.commit()
        db.refresh(order)

        return {
            "message": "Order confirmed successfully!",
            "order_id": order.id,
            "product": product.name,
            "quantity": data.quantity,
            "total_price": total,
            "remaining_stock": product.stock
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to process order"
        )
