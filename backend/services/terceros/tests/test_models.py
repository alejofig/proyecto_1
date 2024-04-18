from app.models import Alimentacion, Entrenador


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


def test_sesion_entrenador_model():
    entrenador = Entrenador(
        tipoEntrenamiento="Grupal",
        fechaSesion="2024-04-15",
        horaSesion="08:30",
        comentarios="Comentarios"
    )

    assert entrenador.tipoEntrenamiento == "Grupal"
    assert entrenador.fechaSesion == "2024-04-15"
    assert entrenador.horaSesion == "08:30"
    assert entrenador.comentarios == "Comentarios"
