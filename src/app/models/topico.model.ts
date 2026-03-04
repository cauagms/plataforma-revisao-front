export interface Topico {
  id: number;
  titulo: string;
  conteudo: string | null;
  disciplina_id: number;
  status: string;
  ultima_revisao_em: string | null;
  total_revisoes: number;
  criado_em: string;
  atualizado_em: string;
}
