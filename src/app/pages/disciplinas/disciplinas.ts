import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Disciplina } from '../../models/disciplina.model';
import { DisciplinaService } from '../../services/disciplina.service';

@Component({
  selector: 'app-disciplinas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './disciplinas.html',
  styleUrls: ['./disciplinas.scss'],
})
export class Disciplinas {
  disciplinas: Disciplina[] = [];
  carregando = true;
  erro: string | null = null;

  menuAbertoId: number | null = null;
  modalAberto = false;
  criando = false;
  erroCriacao: string | null = null;

  modalEditarAberto = false;
  disciplinaParaEditar: Disciplina | null = null;
  editando = false;
  erroEdicao: string | null = null;
  formularioEditar: FormGroup;

  modalExcluirAberto = false;
  disciplinaParaExcluir: Disciplina | null = null;
  excluindo = false;

  cores = [
    { valor: '#6366f1', nome: 'Índigo' },
    { valor: '#f59e0b', nome: 'Laranja' },
    { valor: '#10b981', nome: 'Verde' },
    { valor: '#ec4899', nome: 'Rosa' },
    { valor: '#ef4444', nome: 'Vermelho' },
    { valor: '#3b82f6', nome: 'Azul' },
    { valor: '#a855f7', nome: 'Roxo' },
  ];

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      cor: [this.cores[0].valor, Validators.required],
    });

    this.formularioEditar = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      cor: ['', Validators.required],
    });

    afterNextRender(() => {
      this.carregarDisciplinas();
    });
  }

  carregarDisciplinas() {
    this.carregando = true;
    this.erro = null;

    this.disciplinaService.listar().subscribe({
      next: (dados) => {
        this.disciplinas = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erro = 'Não foi possível carregar as disciplinas.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  abrirModal() {
    this.formulario.reset({ nome: '', cor: this.cores[0].valor });
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

  selecionarCor(cor: string) {
    this.formulario.patchValue({ cor });
  }

  criarDisciplina() {
    if (this.formulario.invalid || this.criando) return;

    this.criando = true;
    this.erroCriacao = null;

    const { nome, cor } = this.formulario.value;

    this.disciplinaService.criar({ nome: nome.trim(), cor }).subscribe({
      next: (novaDisciplina) => {
        this.disciplinas = [...this.disciplinas, novaDisciplina];
        this.criando = false;
        this.fecharModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroCriacao = 'Erro ao criar disciplina. Tente novamente.';
        this.criando = false;
        this.cdr.markForCheck();
      },
    });
  }

  toggleMenu(id: number) {
    this.menuAbertoId = this.menuAbertoId === id ? null : id;
  }

  fecharMenu() {
    this.menuAbertoId = null;
  }

  abrirModalEditar(disciplina: Disciplina) {
    this.fecharMenu();
    this.disciplinaParaEditar = disciplina;
    this.formularioEditar.reset({ nome: disciplina.nome, cor: disciplina.cor });
    this.erroEdicao = null;
    this.modalEditarAberto = true;
  }

  fecharModalEditar() {
    this.modalEditarAberto = false;
    this.disciplinaParaEditar = null;
    this.editando = false;
    this.erroEdicao = null;
  }

  fecharModalEditarPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModalEditar();
    }
  }

  selecionarCorEditar(cor: string) {
    this.formularioEditar.patchValue({ cor });
  }

  editarDisciplina() {
    if (this.formularioEditar.invalid || this.editando || !this.disciplinaParaEditar) return;

    this.editando = true;
    this.erroEdicao = null;

    const { nome, cor } = this.formularioEditar.value;
    const id = this.disciplinaParaEditar.id;

    this.disciplinaService.editar(id, { nome: nome.trim(), cor }).subscribe({
      next: (atualizada) => {
        this.disciplinas = this.disciplinas.map((d) => (d.id === id ? atualizada : d));
        this.editando = false;
        this.fecharModalEditar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroEdicao = 'Erro ao editar disciplina. Tente novamente.';
        this.editando = false;
        this.cdr.markForCheck();
      },
    });
  }

  abrirModalExcluir(disciplina: Disciplina) {
    this.fecharMenu();
    this.disciplinaParaExcluir = disciplina;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluir() {
    this.modalExcluirAberto = false;
    this.disciplinaParaExcluir = null;
    this.excluindo = false;
  }

  fecharModalExcluirPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModalExcluir();
    }
  }

  abrirDisciplina(disciplina: Disciplina) {
    this.router.navigate(['/disciplinas', disciplina.id]);
  }

  excluirDisciplina() {
    if (!this.disciplinaParaExcluir || this.excluindo) return;

    this.excluindo = true;
    const id = this.disciplinaParaExcluir.id;

    this.disciplinaService.excluir(id).subscribe({
      next: () => {
        this.disciplinas = this.disciplinas.filter((d) => d.id !== id);
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
