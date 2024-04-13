export class PlanEntrenamiento {
  id: number;
  deporte: string;
  nombre: string;
  cantidadEntrenamientos: number;
  distanciaPorEntrenamientos: number;
  fechas: string;

  constructor(
    id: number,
    deporte: string,
    nombre: string,
    cantidadEntrenamientos: number,
    distanciaPorEntrenamientos: number,
    fechas: string
  ) {
    this.id = id;
    this.deporte = deporte;
    this.nombre = nombre;
    this.cantidadEntrenamientos = cantidadEntrenamientos;
    this.distanciaPorEntrenamientos = distanciaPorEntrenamientos;
    this.fechas = fechas;
  }
}
