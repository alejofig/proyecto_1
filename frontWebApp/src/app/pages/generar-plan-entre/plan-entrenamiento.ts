export class PlanEntrenamiento {
  deporte: string;
  nombre: string;
  cantidadEntrenamientos: number;
  distanciaPorEntrenamientos: number;
  fechas: string;

  constructor(
    deporte: string,
    nombre: string,
    cantidadEntrenamientos: number,
    distanciaPorEntrenamientos: number,
    fechas: string
  ) {
    this.deporte = deporte;
    this.nombre = nombre;
    this.cantidadEntrenamientos = cantidadEntrenamientos;
    this.distanciaPorEntrenamientos = distanciaPorEntrenamientos;
    this.fechas = fechas;
  }
}
