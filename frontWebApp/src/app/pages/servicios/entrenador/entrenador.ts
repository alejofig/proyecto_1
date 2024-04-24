export class Entrenador {
  proveedor: string;
  tipoEntrenamiento: string;
  fechaSesion: string;
  horaSesion: string;
  comentarios: string;

  constructor(
    proveedor: string,
    tipoEntrenamiento: string,
    fechaSesion: string,
    horaSesion: string,
    comentarios: string
  ) {
    this.proveedor = proveedor;
    this.tipoEntrenamiento = tipoEntrenamiento;
    this.fechaSesion = fechaSesion;
    this.horaSesion = horaSesion;
    this.comentarios = comentarios;
  }
}
