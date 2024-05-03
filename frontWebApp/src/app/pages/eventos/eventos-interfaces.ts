export interface PlanEntrenamientoUser {
  id: number;
  usuario: string;
  cantidadEntrenamientos: string;
  deporte: "Atletismo";
  distanciaPorEntrenamientos: "5";
  fechas: String;
  nombre: string;
}

export interface ListCalendar {
  titulo: string;
  descripcion: string;
  fecha: string;
}

export interface SesionesEntrenador {
  id: number;
  proveedor: string;
  tipoEntrenamiento: string;
  fechaSesion: String;
  horaSesion: string;
  comentarios: string;
}

export interface Entrenamiento {
id: number;
fecha: string;
sport_type: string;
total_calories: number;
distance: number;
duration: number;
user_id: number;
calories_active: number;
fcm: number;
}
