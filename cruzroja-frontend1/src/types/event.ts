export type EventoEstado = "Activo" | "Cerrado" | "Borrador";

export interface Evento {
  id: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: EventoEstado;
  lugar?: string;
}
