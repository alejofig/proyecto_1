export class Alimentacion {
  tipoAlimentacion: string;
  numeroContacto: number;
  paisActual: string;
  ciudadActual: string;
  direccionActual: string;

  constructor(
    tipoAlimentacion: string,
    numeroContacto: number,
    paisActual: string,
    ciudadActual: string,
    direccionActual: string
  ) {
    this.tipoAlimentacion = tipoAlimentacion;
    this.numeroContacto = numeroContacto;
    this.paisActual = paisActual;
    this.ciudadActual = ciudadActual;
    this.direccionActual = direccionActual;
  }
}
