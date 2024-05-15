from app.models import Indicador


def test_indicador_model():
    indicador = Indicador(
        userId="1234",
        nombreIndicador="Potencia",
        deporte="Atletismo",
        visible=True,
        detallesAdicionales="Potencia"
    )

    assert indicador.userId == "1234"
    assert indicador.nombreIndicador == "Potencia"
    assert indicador.deporte == "Atletismo"
    assert indicador.visible == True
    assert indicador.detallesAdicionales == "Potencia"
