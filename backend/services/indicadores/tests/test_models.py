from app.models import Indicador


def test_indicador_model():
    indicador = Indicador(
        userId="1234",
        nombreIndicador="Potencia",
        deporte="Atletismo",
        sensor="Optico",
        unidadMedida="Watts",
        calculoRealizar="EMC",
        detallesAdicionales="Potencia"
    )

    assert indicador.userId == "1234"
    assert indicador.nombreIndicador == "Potencia"
    assert indicador.deporte == "Atletismo"
    assert indicador.sensor == "Optico"
    assert indicador.unidadMedida == "Watts"
    assert indicador.calculoRealizar == "EMC"
    assert indicador.detallesAdicionales == "Potencia"
