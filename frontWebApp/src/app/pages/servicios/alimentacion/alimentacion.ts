export class Alimentacion {
  proveedor: string;
  proposito: string;
  tipoAlimentacion: string;
  modoRecibir: string;
  numeroContacto: number;
  direccionActual: string;
  ciudadActual: string;
  paisActual: string;

  constructor(
    proveedor: string,
    proposito: string,
    tipoAlimentacion: string,
    modoRecibir: string,
    numeroContacto: number,
    direccionActual: string,
    ciudadActual: string,
    paisActual: string,
  ) {
    this.proveedor = proveedor;
    this.proposito = proposito;
    this.tipoAlimentacion = tipoAlimentacion;
    this.modoRecibir = modoRecibir;
    this.numeroContacto = numeroContacto;
    this.direccionActual = direccionActual;
    this.ciudadActual = ciudadActual;
    this.paisActual = paisActual;
  }
}
