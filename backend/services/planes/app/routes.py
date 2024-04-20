from app.database import create_plan, consultar_planes, reset_planes, consultar_planes_usuario
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


@router.get("/planes/{email}")
async def get_plan_user(email: str):
    planes = consultar_planes_usuario(email)
    return planes


@router.get("/planes")
async def get_plan():
    planes = consultar_planes()
    return planes


@router.post("/reset")
async def resetPlanes():
    num_total = reset_planes()
    return num_total
