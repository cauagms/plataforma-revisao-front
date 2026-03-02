import { Component } from '@angular/core';
import { Disciplina } from '../../models/disciplina.model';

@Component({
  selector: 'app-disciplinas',
  standalone: true,
  templateUrl: './disciplinas.html',
  styleUrls: ['./disciplinas.scss'],
})
export class Disciplinas {
  disciplinas: Disciplina[] = [];

  menuAbertoId: number | null = null;

  toggleMenu(id: number) {
    this.menuAbertoId = this.menuAbertoId === id ? null : id;
  }

  fecharMenu() {
    this.menuAbertoId = null;
  }
}