export class PlanEntrenamiento {
  id: number;
  deporte: string;
  nombre: string;
  numeroEntrenamientosSemana: number;
  objetivoDistanciaEntrenamiento: number;
  fechas: string;

  constructor(
    id: number,
    deporte: string,
    nombre: string,
    numeroEntrenamientosSemana: number,
    objetivoDistanciaEntrenamiento: number,
    fechas: string
  ) {
    this.id = id;
    this.deporte = deporte;
    this.nombre = nombre;
    this.numeroEntrenamientosSemana = numeroEntrenamientosSemana;
    this.objetivoDistanciaEntrenamiento = objetivoDistanciaEntrenamiento;
    this.fechas = fechas;
  }
}
