export interface Evento {
  id?: number;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
}

export interface EventoPageResponse {
  content: Evento[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
