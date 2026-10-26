import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from './api';
import {
  AdminUser, AttemptSummary, Category, Dashboard, ExamSettings, QuestionDto
} from './models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${API_URL}/admin`;

  dashboard() { return this.http.get<Dashboard>(`${this.base}/dashboard`); }

  // categories
  categories() { return this.http.get<Category[]>(`${this.base}/categories`); }
  createCategory(body: { name: string; description: string }) {
    return this.http.post<Category>(`${this.base}/categories`, body);
  }
  updateCategory(id: number, body: { name: string; description: string }) {
    return this.http.put<Category>(`${this.base}/categories/${id}`, body);
  }
  deleteCategory(id: number) { return this.http.delete<void>(`${this.base}/categories/${id}`); }

  // questions
  questions(categoryId?: number | null) {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<QuestionDto[]>(`${this.base}/questions`, { params });
  }
  question(id: number) { return this.http.get<QuestionDto>(`${this.base}/questions/${id}`); }
  createQuestion(body: QuestionDto) { return this.http.post<QuestionDto>(`${this.base}/questions`, body); }
  updateQuestion(id: number, body: QuestionDto) {
    return this.http.put<QuestionDto>(`${this.base}/questions/${id}`, body);
  }
  deleteQuestion(id: number) { return this.http.delete<void>(`${this.base}/questions/${id}`); }

  // settings, users, attempts
  settings() { return this.http.get<ExamSettings>(`${this.base}/settings`); }
  updateSettings(body: ExamSettings) { return this.http.put<ExamSettings>(`${this.base}/settings`, body); }
  users() { return this.http.get<AdminUser[]>(`${this.base}/users`); }
  attempts(categoryId?: number | null, userId?: number | null) {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId);
    if (userId) params = params.set('userId', userId);
    return this.http.get<AttemptSummary[]>(`${this.base}/attempts`, { params });
  }
}