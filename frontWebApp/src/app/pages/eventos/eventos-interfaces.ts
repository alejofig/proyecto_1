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