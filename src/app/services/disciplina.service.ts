import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { Disciplina } from '../models/disciplina.model';

export interface CriarDisciplinaRequest {
  nome: string;
  cor: string;
}

export interface EditarDisciplinaRequest {
  nome: string;
  cor: string;
}

@Injectable({ providedIn: 'root' })
export class DisciplinaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(`${this.apiUrl}/disciplinas`);
  }

  criar(dados: CriarDisciplinaRequest): Observable<Disciplina> {
    return this.http.post<Disciplina>(`${this.apiUrl}/disciplinas`, dados);
  }

  editar(id: number, dados: EditarDisciplinaRequest): Observable<Disciplina> {
    return this.http.put<Disciplina>(`${this.apiUrl}/disciplinas/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/disciplinas/${id}`);
  }
}
