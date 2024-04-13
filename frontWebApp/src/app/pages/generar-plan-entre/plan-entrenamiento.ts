export class PlanEntrenamiento {
  id: number;
  deporte: string;
  nombre: string;
  numeroEntrenamientosSemana: number;
  objetivoDistanciaEntrenamiento: number;

  constructor(
    id: number,
    deporte: string,
    nombre: string,
    numeroEntrenamientosSemana: number,
    objetivoDistanciaEntrenamiento: number,
  ) {
    this.id = id;
    this.deporte = deporte;
    this.nombre = nombre;
    this.numeroEntrenamientosSemana = numeroEntrenamientosSemana;
    this.objetivoDistanciaEntrenamiento = objetivoDistanciaEntrenamiento;
  }
}
