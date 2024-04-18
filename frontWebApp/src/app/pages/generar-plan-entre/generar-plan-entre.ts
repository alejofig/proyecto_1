export class GenerarPlanEntre {
  deporte: string;
  nombre: string;
  usuario: string;
  cantidadEntrenamientos: number;
  distanciaPorEntrenamientos: number;
  fechas: string;

  constructor(
    deporte: string,
    nombre: string,
    usuario: string,
    cantidadEntrenamientos: number,
    distanciaPorEntrenamientos: number,
    fechas: string
  ) {
    this.deporte = deporte;
    this.nombre = nombre;
    this.usuario = usuario;
    this.cantidadEntrenamientos = cantidadEntrenamientos;
    this.distanciaPorEntrenamientos = distanciaPorEntrenamientos;
    this.fechas = fechas;
  }
}
