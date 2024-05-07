from app.database import crear_nuevo_indicador
from app.models import Indicador

from tests.create_indicador import generate_random_indicador


def test_crear_indicador():
    indicador = Indicador(**generate_random_indicador())
    created_indicador = crear_nuevo_indicador(indicador)
