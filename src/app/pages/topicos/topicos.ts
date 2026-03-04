import { Component, ChangeDetectorRef, afterNextRender, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Disciplina } from '../../models/disciplina.model';
import { Topico } from '../../models/topico.model';
import { DisciplinaService } from '../../services/disciplina.service';
import { TopicoService } from '../../services/topico.service';

@Component({
  selector: 'app-topicos',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './topicos.html',
  styleUrls: ['./topicos.scss', './topicos.responsivo.scss'],
})
export class TopicosPage {
  disciplina: Disciplina | null = null;
  topicos: Topico[] = [];
  buscaTopico = '';
  carregando = true;
  erro: string | null = null;

  modalAberto = false;
  criando = false;
  erroCriacao: string | null = null;
  formulario: FormGroup;

  menuAbertoId: number | null = null;

  modalEditarAberto = false;
  topicoParaEditar: Topico | null = null;
  editando = false;
  erroEdicao: string | null = null;
  formularioEditar: FormGroup;

  modalExcluirAberto = false;
  topicoParaExcluir: Topico | null = null;
  excluindo = false;

  get topicosFiltrados(): Topico[] {
    if (!this.buscaTopico.trim()) return this.topicos;
    const termo = this.buscaTopico.trim().toLowerCase();
    return this.topicos.filter((t) => t.titulo.toLowerCase().includes(termo));
  }

  get percentualRevisados(): number {
    if (this.topicos.length === 0) return 0;
    const revisados = this.topicos.filter((t) => t.status === 'Revisado').length;
    return Math.round((revisados / this.topicos.length) * 100);
  }

  formatarRevisoes(total: number): string {
    if (total === 0) return 'Nenhuma revisão';
    if (total === 1) return '1 revisão';
    return `${total} revisões`;
  }

  formatarData(data: string | null): string {
    if (!data) return '—';
    const date = new Date(data);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (date.toDateString() === hoje.toDateString()) return `Hoje, ${hora}`;
    if (date.toDateString() === ontem.toDateString()) return `Ontem, ${hora}`;
    return `${date.toLocaleDateString('pt-BR')}, ${hora}`;
  }

  private disciplinaId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private topicoService: TopicoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
    });

    this.formularioEditar = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
    });

    afterNextRender(() => {
      this.disciplinaId = Number(this.route.snapshot.paramMap.get('id'));
      this.carregarDados();
    });
  }

  carregarDados() {
    this.carregando = true;
    this.erro = null;

    this.disciplinaService.listar().subscribe({
      next: (disciplinas) => {
        this.disciplina = disciplinas.find((d) => d.id === this.disciplinaId) ?? null;

        if (!this.disciplina) {
          this.erro = 'Disciplina não encontrada.';
          this.carregando = false;
          this.cdr.markForCheck();
          return;
        }

        this.topicoService.listarPorDisciplina(this.disciplinaId).subscribe({
          next: (topicos) => {
            this.topicos = topicos;
            this.carregando = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.topicos = [];
            this.carregando = false;
            this.cdr.markForCheck();
          },
        });
      },
      error: () => {
        this.erro = 'Não foi possível carregar a disciplina.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  // ─── Modal criar ─────────────────────────────────────
  abrirModal() {
    this.formulario.reset({ titulo: '' });
    this.erroCriacao = null;
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  fecharModalPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModal();
    }
  }

  criarTopico() {
    if (this.formulario.invalid || this.criando) return;

    this.criando = true;
    this.erroCriacao = null;

    const { titulo } = this.formulario.value;

    this.topicoService.criar(this.disciplinaId, { titulo: titulo.trim() }).subscribe({
      next: (novoTopico) => {
        this.topicos = [...this.topicos, novoTopico];
        this.criando = false;
        this.fecharModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroCriacao = 'Erro ao criar tópico. Tente novamente.';
        this.criando = false;
        this.cdr.markForCheck();
      },
    });
  }

  // ─── Menu de ações ───────────────────────────────────
  @HostListener('document:keydown.enter')
  onEnterExcluir() {
    if (this.modalExcluirAberto) {
      this.excluirTopico();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.menuAbertoId === null) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-wrapper')) {
      this.fecharMenu();
    }
  }

  menuDirecao: 'baixo' | 'cima' = 'baixo';

  toggleMenu(id: number, event: MouseEvent) {
    if (this.menuAbertoId === id) {
      this.menuAbertoId = null;
      return;
    }

    const btn = (event.currentTarget as HTMLElement);
    const rect = btn.getBoundingClientRect();
    const espacoAbaixo = window.innerHeight - rect.bottom;
    this.menuDirecao = espacoAbaixo < 120 ? 'cima' : 'baixo';
    this.menuAbertoId = id;
  }

  fecharMenu() {
    this.menuAbertoId = null;
  }

  // ─── Modal editar ────────────────────────────────────
  abrirModalEditar(topico: Topico) {
    this.fecharMenu();
    this.topicoParaEditar = topico;
    this.formularioEditar.reset({ titulo: topico.titulo });
    this.erroEdicao = null;
    this.modalEditarAberto = true;
  }

  fecharModalEditar() {
    this.modalEditarAberto = false;
    this.topicoParaEditar = null;
    this.editando = false;
    this.erroEdicao = null;
  }

  fecharModalEditarPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModalEditar();
    }
  }

  editarTopico() {
    if (this.formularioEditar.invalid || this.editando || !this.topicoParaEditar) return;

    this.editando = true;
    this.erroEdicao = null;

    const { titulo } = this.formularioEditar.value;
    const id = this.topicoParaEditar.id;

    this.topicoService
      .editar(this.disciplinaId, id, { titulo: titulo.trim() })
      .subscribe({
        next: (atualizado) => {
          this.topicos = this.topicos.map((t) => (t.id === id ? atualizado : t));
          this.editando = false;
          this.fecharModalEditar();
          this.cdr.markForCheck();
        },
        error: () => {
          this.erroEdicao = 'Erro ao editar tópico. Tente novamente.';
          this.editando = false;
          this.cdr.markForCheck();
        },
      });
  }

  // ─── Modal excluir ───────────────────────────────────
  abrirModalExcluir(topico: Topico) {
    this.fecharMenu();
    this.topicoParaExcluir = topico;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluir() {
    this.modalExcluirAberto = false;
    this.topicoParaExcluir = null;
    this.excluindo = false;
  }

  fecharModalExcluirPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModalExcluir();
    }
  }

  excluirTopico() {
    if (!this.topicoParaExcluir || this.excluindo) return;

    this.excluindo = true;
    const id = this.topicoParaExcluir.id;

    this.topicoService.excluir(this.disciplinaId, id).subscribe({
      next: () => {
        this.topicos = this.topicos.filter((t) => t.id !== id);
        this.fecharModalExcluir();
        this.cdr.markForCheck();
      },
      error: () => {
        this.excluindo = false;
        this.cdr.markForCheck();
      },
    });
  }
}
