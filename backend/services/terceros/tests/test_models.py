from app.models import Alimentacion, Entrenador


def test_alimentacion_model():
    alimentacion = Alimentacion(
        userId="1234",
        proveedor="Cocina Fit",
        proposito="nutricion",
        tipoAlimentacion="Proteina",
        modoRecibir="virtual",
        numeroContacto=321,
        direccionActual="Calle Falsa 123",
        ciudadActual="Lima",
        paisActual="Peru"
    )

    assert alimentacion.userId == "1234"
    assert alimentacion.proveedor == "Cocina Fit"
    assert alimentacion.proposito == "nutricion"
    assert alimentacion.tipoAlimentacion == "Proteina"
    assert alimentacion.modoRecibir == "virtual"
    assert alimentacion.numeroContacto == 321
    assert alimentacion.direccionActual == "Calle Falsa 123"
    assert alimentacion.ciudadActual == "Lima"
    assert alimentacion.paisActual == "Peru"


def test_sesion_entrenador_model():
    entrenador = Entrenador(
        userId="1234",
        proveedor="AlejoFit",
        tipoEntrenamiento="Grupal",
        fechaSesion="2024-04-15",
        horaSesion="08:30",
        comentarios="Comentarios"
    )

    assert entrenador.userId == "1234"
    assert entrenador.proveedor == "AlejoFit"
    assert entrenador.tipoEntrenamiento == "Grupal"
    assert entrenador.fechaSesion == "2024-04-15"
    assert entrenador.horaSesion == "08:30"
    assert entrenador.comentarios == "Comentarios"
