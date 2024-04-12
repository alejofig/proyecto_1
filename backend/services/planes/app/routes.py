from app.database import create_plan
from app.models import Plan
from fastapi import APIRouter

router = APIRouter()


@router.post("generate/")
async def generate_plan(plan: Plan):
    create_plan(plan)
    return {"message": "Plan generated successfully"}
