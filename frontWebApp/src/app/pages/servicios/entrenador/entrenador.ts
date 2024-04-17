export class Entrenador {
  tipoEntrenamiento: string;
  fechaSesion: string;
  horaSesion: string;
  comentarios: string;

  constructor(
    tipoEntrenamiento: string,
    fechaSesion: string,
    horaSesion: string,
    comentarios: string
  ) {
    this.tipoEntrenamiento = tipoEntrenamiento;
    this.fechaSesion = fechaSesion;
    this.horaSesion = horaSesion;
    this.comentarios = comentarios;
  }
}
