import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';
import { AttemptDetail, AttemptSummary, Category, ExamSettings } from './models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);

  categories() { return this.http.get<Category[]>(`${API_URL}/categories`); }
  settings() { return this.http.get<ExamSettings>(`${API_URL}/settings`); }

  start(categoryId: number) {
    return this.http.post<AttemptDetail>(`${API_URL}/attempts/start`, { categoryId });
  }

  getAttempt(id: number, admin = false) {
    return this.http.get<AttemptDetail>(`${API_URL}/${admin ? 'admin/' : ''}attempts/${id}`);
  }

  submit(id: number, answers: { questionId: number; optionId: number }[]) {
    return this.http.post<AttemptDetail>(`${API_URL}/attempts/${id}/submit`, { answers });
  }

  myAttempts() { return this.http.get<AttemptSummary[]>(`${API_URL}/attempts/my`); }
}