export interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  status: string;
  dataCriacao: Date;
  dataConclusao: Date;
  responsavel: string;
}

export interface TarefaPageResponse {
  content: Tarefa[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ErroResponse {
  path: string;
  message: string;
  error: string;
  status: number;
}
