from app.models import Plan

from tests.create_plan import generate_random_plan
from app.database import create_plan

def test_create_plan():
    plan = Plan(**generate_random_plan())
    created_plan = create_plan(plan)
