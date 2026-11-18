from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=1)
    price: float = Field(gt=0)
    stock: int = Field(ge=0)


class StockUpdate(BaseModel):
    stock: int = Field(ge=0)


class OrderCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)