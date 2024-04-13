from app.database import create_plan, consultar_planes
from app.models import Plan
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health():
    return {"status": "ok"}

@router.post("/plan")
async def generate_plan(plan: Plan):
    plan = create_plan(plan)
    return {"message": "Plan generated successfully"}


@router.get("/planes")
async def get_plan():
    planes = consultar_planes()
    return planes
    