from app.database import create_plan
from app.models import Plan
from sqlalchemy.exc import IntegrityError

from create_plan import generate_random_plan


def test_create_plan():
    plan = Plan(**generate_random_plan())

    try:
        created_plan = create_plan(plan)
    except IntegrityError as e:
        assert False, f"Error al crear plan: {e}"

    # assert created_plan.id is not None
    # assert created_plan.deporte == plan.deporte
    # assert created_plan.nombre == plan.nombre
    # assert created_plan.usuario == plan.usuario
    # assert created_plan.cantidadEntrenamientos == plan.cantidadEntrenamientos
    # assert created_plan.distanciaPorEntrenamientos == plan.distanciaPorEntrenamientos
    # assert created_plan.fechas == plan.fechas
