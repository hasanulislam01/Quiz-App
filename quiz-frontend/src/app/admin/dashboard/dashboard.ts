import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { Dashboard } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboard {
  private api = inject(AdminService);
  data = signal<Dashboard | null>(null);

  constructor() {
    this.api.dashboard().subscribe(d => this.data.set(d));
  }

  getReadyCategoriesCount(): number {
  return this.data()?.categoryStats.filter(
    c => c.enoughQuestions
  ).length ?? 0;
  }

  getCategoriesNeedingQuestionsCount(): number {
    return this.data()?.categoryStats.filter(
      c => !c.enoughQuestions
    ).length ?? 0;
  }

}
