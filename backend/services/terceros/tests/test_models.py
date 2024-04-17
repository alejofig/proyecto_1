from app.models import Alimentacion


def test_alimentacion_model():
    alimentacion = Alimentacion(
        tipoAlimentacion="Proteina",
        numeroContacto=3214567890,
        paisActual="Peru",
        ciudadActual="Lima",
        direccionActual="Calle Falsa 123"
    )

    assert alimentacion.tipoAlimentacion == "Proteina"
    assert alimentacion.numeroContacto == 3214567890
    assert alimentacion.paisActual == "Peru"
    assert alimentacion.ciudadActual == "Lima"
    assert alimentacion.direccionActual == "Calle Falsa 123"
