import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../core/quiz.service';
import { AttemptDetail } from '../core/models';

@Component({
  selector: 'app-quiz',
  template: `
    @if (error()) { <p class="error">{{ error() }}</p> }
    @if (attempt(); as a) {
      <div class="card">
        <div class="row" style="margin-top:0">
          <h2 style="margin:0">{{ a.categoryName }}</h2>
          <span class="spacer"></span>
          <span class="timer" [class.warn]="remaining() < 60">{{ display() }}</span>
        </div>
        <p class="muted">Question {{ index() + 1 }} of {{ questions().length }} - answered {{ answeredCount() }}</p>
        <div class="pills">
          @for (q of questions(); track q.id; let i = $index) {
            <button class="pill" [class.done]="answers()[q.id]" [class.active]="i === index()"
                    (click)="index.set(i)">{{ i + 1 }}</button>
          }
        </div>
      </div>

      @if (current(); as q) {
        <div class="card">
          <h3>{{ index() + 1 }}. {{ q.text }}</h3>
          @for (o of q.options; track o.id) {
            <label class="choice" [class.selected]="answers()[q.id] === o.id">
              <input type="radio" [name]="'q' + q.id" [checked]="answers()[q.id] === o.id"
                     (change)="select(q.id, o.id)">
              {{ o.text }}
            </label>
          }
          <div class="row">
            <button class="btn secondary" (click)="index.set(index() - 1)" [disabled]="index() === 0">Previous</button>
            @if (index() < questions().length - 1) {
              <button class="btn" (click)="index.set(index() + 1)">Next</button>
            }
            <span class="spacer"></span>
            <button class="btn success" (click)="submit(false)" [disabled]="submitting()">
              {{ submitting() ? 'Submitting...' : 'Submit exam' }}
            </button>
          </div>
        </div>
      }
    }
  `
})
export class QuizComponent implements OnDestroy {
  private api = inject(QuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  private storageKey = `quiz-answers-${this.id}`;
  private timer?: ReturnType<typeof setInterval>;

  attempt = signal<AttemptDetail | null>(null);
  index = signal(0);
  answers = signal<Record<number, number>>({});
  remaining = signal(0);
  submitting = signal(false);
  error = signal('');

  questions = computed(() => this.attempt()?.questions ?? []);
  current = computed(() => this.questions()[this.index()] ?? null);
  answeredCount = computed(() => Object.keys(this.answers()).length);
  display = computed(() => {
    const s = this.remaining();
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  });

  constructor() {
    this.api.getAttempt(this.id).subscribe({
      next: a => {
        if (a.status !== 'IN_PROGRESS') {
          this.router.navigate(['/result', a.id]);
          return;
        }
        this.attempt.set(a);
        this.restoreAnswers();
        this.startTimer(a.remainingSeconds);
      },
      error: e => this.error.set(e.error?.message ?? 'Could not load the exam')
    });
  }

  select(questionId: number, optionId: number) {
    this.answers.update(a => ({ ...a, [questionId]: optionId }));
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.answers()));   // survives a page refresh
  }

  submit(auto: boolean) {
    if (this.submitting()) return;
    const unanswered = this.questions().length - this.answeredCount();
    if (!auto && unanswered > 0 && !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
      return;
    }
    this.submitting.set(true);
    this.stopTimer();
    const payload = Object.entries(this.answers())
      .map(([q, o]) => ({ questionId: Number(q), optionId: o }));
    this.api.submit(this.id, payload).subscribe({
      next: a => {
        sessionStorage.removeItem(this.storageKey);
        this.router.navigate(['/result', a.id]);
      },
      error: e => {
        this.error.set(e.error?.message ?? 'Submit failed. Click Submit exam to try again.');
        this.submitting.set(false);
      }
    });
  }

  private restoreAnswers() {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (raw) this.answers.set(JSON.parse(raw));
    } catch { /* ignore */ }
  }

  // The server sends the remaining seconds, so a wrong clock on the user's computer does not matter.
  private startTimer(seconds: number) {
    const endAt = Date.now() + seconds * 1000;
    const tick = () => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      this.remaining.set(left);
      if (left === 0) {
        this.stopTimer();
        this.submit(true);   // time is up: submit automatically
      }
    };
    tick();
    if (this.remaining() > 0) {
      this.timer = setInterval(tick, 1000);
    }
  }

  private stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}