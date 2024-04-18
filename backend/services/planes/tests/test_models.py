from app.models import Plan


def test_plan_model():
    plan = Plan(
        deporte="Atletismo",
        nombre="Maraton",
        usuario="Juan",
        cantidadEntrenamientos="1",
        distanciaPorEntrenamientos="5",
        fechas="2024/04/15"
    )

    assert plan.deporte == "Atletismo"
    assert plan.nombre == "Maraton"
    assert plan.usuario == "Juan"
    assert plan.cantidadEntrenamientos == "1"
    assert plan.distanciaPorEntrenamientos == "5"
    assert plan.fechas == "2024/04/15"
