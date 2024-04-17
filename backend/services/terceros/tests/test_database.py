from app.database import solicitar_servicio_alimentacion
from app.models import Alimentacion

from create_alimentacion import generate_random_alimentacion


def test_create_alimentacion():
    alimentacion = Alimentacion(**generate_random_alimentacion())
    created_alimentacion = solicitar_servicio_alimentacion(alimentacion)
