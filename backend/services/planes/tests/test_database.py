from app.database import create_plan
from app.models import Plan

from create_plan import generate_random_plan


def test_create_plan():
    plan = Plan(**generate_random_plan())
    created_plan = create_plan(plan)
