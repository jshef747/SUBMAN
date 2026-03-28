from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from supabase import Client

from app.dependencies import get_current_user_id, get_supabase_client

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


# --- Pydantic Models ---

class SubscriptionCreate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    name: str = Field(min_length=1)
    price_per_cycle: float = Field(gt=0)
    currency: str = "USD"
    pay_cycle: str = Field(min_length=1)
    renewal_date: datetime
    is_active: bool = True


class SubscriptionUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    name: Optional[str] = Field(default=None, min_length=1)
    price_per_cycle: Optional[float] = Field(default=None, gt=0)
    currency: Optional[str] = None
    pay_cycle: Optional[str] = None
    renewal_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class SubscriptionResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: int
    user_id: str
    name: str
    price_per_cycle: float
    currency: str
    pay_cycle: str
    renewal_date: datetime
    is_active: bool
    created_at: datetime
    updated_at: datetime


# --- Helpers ---

def _not_found(sub_id: int):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Subscription {sub_id} not found",
    )


# --- Routes ---

@router.post(
    "/",
    response_model=SubscriptionResponse,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
def create_subscription(
    body: SubscriptionCreate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client),
):
    data = body.model_dump()
    data["user_id"] = user_id
    data["renewal_date"] = data["renewal_date"].isoformat()
    result = supabase.table("subscriptions").insert(data).execute()
    return result.data[0]


@router.get("/", response_model=list[SubscriptionResponse], response_model_by_alias=True)
def list_subscriptions(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client),
):
    result = (
        supabase.table("subscriptions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/{sub_id}", response_model=SubscriptionResponse, response_model_by_alias=True)
def get_subscription(
    sub_id: int,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client),
):
    result = (
        supabase.table("subscriptions")
        .select("*")
        .eq("id", sub_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if result.data is None:
        _not_found(sub_id)
    return result.data


@router.patch("/{sub_id}", response_model=SubscriptionResponse, response_model_by_alias=True)
def update_subscription(
    sub_id: int,
    body: SubscriptionUpdate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client),
):
    existing = (
        supabase.table("subscriptions")
        .select("id")
        .eq("id", sub_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if existing.data is None:
        _not_found(sub_id)

    update_data = body.model_dump(exclude_none=True)
    if "renewal_date" in update_data:
        update_data["renewal_date"] = update_data["renewal_date"].isoformat()

    result = (
        supabase.table("subscriptions")
        .update(update_data)
        .eq("id", sub_id)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0]


@router.delete("/{sub_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subscription(
    sub_id: int,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client),
):
    existing = (
        supabase.table("subscriptions")
        .select("id")
        .eq("id", sub_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if existing.data is None:
        _not_found(sub_id)

    supabase.table("subscriptions").delete().eq("id", sub_id).eq("user_id", user_id).execute()
