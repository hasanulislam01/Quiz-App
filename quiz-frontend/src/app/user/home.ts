// import { Component, inject, signal } from '@angular/core';
// import { Router } from '@angular/router';
// import { QuizService } from '../core/quiz.service';
// import { Category, ExamSettings } from '../core/models';

// @Component({
//   selector: 'app-home',
//   template: `
//     <h2>Choose a quiz</h2>
//     @if (settings(); as s) {
//       <p class="muted">Each exam has {{ s.questionCount }} random questions and a time limit of {{ s.durationMinutes }} minutes.</p>
//     }
//     @if (error()) { <p class="error">{{ error() }}</p> }
//     <div class="grid">
//       @for (c of categories(); track c.id) {
//         <div class="card">
//           <h3>{{ c.name }}</h3>
//           <p class="muted">{{ c.description }}</p>
//           <p class="muted">{{ c.questionCount }} questions available</p>
//           <button class="btn" (click)="start(c)" [disabled]="starting() !== null">
//             {{ starting() === c.id ? 'Starting...' : 'Start' }}
//           </button>
//         </div>
//       }
//     </div>
//   `
// })
// export class HomeComponent {
//   private api = inject(QuizService);
//   private router = inject(Router);

//   categories = signal<Category[]>([]);
//   settings = signal<ExamSettings | null>(null);
//   starting = signal<number | null>(null);
//   error = signal('');

//   constructor() {
//     this.api.categories().subscribe(c => this.categories.set(c));
//     this.api.settings().subscribe(s => this.settings.set(s));
//   }

//   start(c: Category) {
//     this.error.set('');
//     this.starting.set(c.id);
//     this.api.start(c.id).subscribe({
//       next: attempt => this.router.navigate(['/quiz', attempt.id]),
//       error: e => {
//         this.error.set(e.error?.message ?? 'Could not start the exam');
//         this.starting.set(null);
//       }
//     });
//   }
// }


import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../core/quiz.service';
import { Category, ExamSettings } from '../core/models';

@Component({
  selector: 'app-home',
  template: `
    <main class="quiz-home">

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">
            <span class="live-dot"></span>
            YOUR LEARNING JOURNEY STARTS HERE
          </span>

          <h1>
            Challenge your mind.<br />
            <span>Discover your potential.</span>
          </h1>

          <p class="hero-description">
            Test your knowledge, sharpen your skills, and track your
            progress with interactive quizzes designed for you.
          </p>

          @if (settings(); as s) {
            <div class="exam-info">
              <div class="info-item">
                <div class="info-icon purple">?</div>
                <div>
                  <strong>{{ s.questionCount }}</strong>
                  <small>Questions per exam</small>
                </div>
              </div>

              <div class="info-divider"></div>

              <div class="info-item">
                <div class="info-icon orange">◷</div>
                <div>
                  <strong>{{ s.durationMinutes }} min</strong>
                  <small>Time limit</small>
                </div>
              </div>
            </div>
          }

          <a class="hero-link" href="#categories">
            Explore quizzes <span>↓</span>
          </a>
        </div>

        <div class="hero-art" aria-hidden="true">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>

          <div class="floating-card floating-top">
            <span class="floating-icon">✦</span>
            <div>
              <strong>Keep learning</strong>
              <small>One quiz at a time</small>
            </div>
          </div>

          <div class="brain-circle">
            <div class="brain-glow"></div>
            <svg viewBox="0 0 200 200" fill="none">
              <path
                d="M100 43
                   C87 26 62 35 62 55
                   C43 53 32 73 42 89
                   C26 102 34 125 49 131
                   C45 150 65 166 83 155
                   L100 145
                   M100 43
                   C113 26 138 35 138 55
                   C157 53 168 73 158 89
                   C174 102 166 125 151 131
                   C155 150 135 166 117 155
                   L100 145
                   M100 43 L100 145
                   M62 76 C81 76 83 94 100 94
                   M138 76 C119 76 117 94 100 94
                   M49 113 C69 105 82 120 83 141
                   M151 113 C131 105 118 120 117 141"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="100" cy="94" r="7" fill="#A78BFA" />
            </svg>
          </div>

          <div class="floating-card floating-bottom">
            <span class="trophy">🏆</span>
            <div>
              <strong>Ready to shine?</strong>
              <small>Your next challenge awaits</small>
            </div>
          </div>

          <span class="sparkle sparkle-one">✦</span>
          <span class="sparkle sparkle-two">✧</span>
          <span class="sparkle sparkle-three">✦</span>
        </div>
      </section>

      <!-- Category Section -->
      <section class="categories-section" id="categories">
        <div class="section-heading">
          <div>
            <span class="section-label">PICK YOUR CHALLENGE</span>
            <h2>Explore quiz categories</h2>
            <p>Choose a subject and see what you know.</p>
          </div>

          <div class="category-count">
            <span>{{ categories().length }}</span>
            {{ categories().length === 1 ? 'category' : 'categories' }}
          </div>
        </div>

        @if (error()) {
          <div class="error-message">
            <span>!</span>
            {{ error() }}
          </div>
        }

        @if (categories().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>Getting your quizzes ready</h3>
            <p>Available categories will appear here.</p>
          </div>
        } @else {
          <div class="category-grid">
            @for (c of categories(); track c.id; let i = $index) {
              <article class="category-card" [class]="'category-card theme-' + (i % 6)">
                <div class="card-top">
                  <div class="category-icon">
                    @switch (i % 6) {
                      @case (0) { <span>🧠</span> }
                      @case (1) { <span>💻</span> }
                      @case (2) { <span>🔬</span> }
                      @case (3) { <span>📐</span> }
                      @case (4) { <span>🌍</span> }
                      @case (5) { <span>📚</span> }
                    }
                  </div>

                  <span class="card-arrow">↗</span>
                </div>

                <h3>{{ c.name }}</h3>
                <p class="category-description">{{ c.description }}</p>

                <div class="card-meta">
                  <span>▤ {{ c.questionCount }} questions available</span>
                </div>

                <button
                  class="start-button"
                  (click)="start(c)"
                  [disabled]="starting() !== null"
                >
                  <span>
                    {{ starting() === c.id ? 'Starting exam...' : 'Start quiz' }}
                  </span>
                  @if (starting() !== c.id) {
                    <span class="button-arrow">→</span>
                  } @else {
                    <span class="button-spinner"></span>
                  }
                </button>
              </article>
            }
          </div>
        }

        <div class="bottom-note">
          <span class="note-check">✓</span>
          <span>Every attempt is an opportunity to learn something new.</span>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
      color: #20213a;
      font-family: Inter, "Segoe UI", Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    .quiz-home {
      width: 100%;
      min-height: 100vh;
      padding: 30px clamp(16px, 4vw, 52px) 44px;
      background: #f7f8fc;
    }

    /* Hero */

    .hero {
      position: relative;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      min-height: 390px;
      padding: 44px clamp(24px, 5vw, 64px);
      overflow: hidden;
      border-radius: 28px;
      color: white;
      background:
        radial-gradient(ellipse at 85% 20%, rgba(140, 117, 255, 0.38), transparent 38%),
        linear-gradient(120deg, #171633 0%, #292354 55%, #443578 100%);
      box-shadow: 0 18px 50px rgba(42, 35, 94, 0.13);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 600px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      margin-bottom: 22px;
      color: #d2caff;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #a5f3c2;
      box-shadow: 0 0 12px rgba(165, 243, 194, 0.7);
    }

    .hero h1 {
      margin: 0;
      font-size: clamp(30px, 3.5vw, 46px);
      font-weight: 800;
      letter-spacing: -1.8px;
      line-height: 1.19;
    }

    .hero h1 span {
      color: #c4b5fd;
    }

    .hero-description {
      max-width: 440px;
      margin: 18px 0 24px;
      color: #d0cee4;
      font-size: 14px;
      line-height: 1.9;
    }

    .exam-info {
      display: flex;
      align-items: center;
      gap: 23px;
      margin-bottom: 23px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .info-icon {
      display: grid;
      place-items: center;
      width: 39px;
      height: 39px;
      border-radius: 12px;
      font-size: 21px;
      font-weight: 700;
    }

    .purple {
      color: #d9ccff;
      background: rgba(167, 139, 250, 0.19);
    }

    .orange {
      color: #ffd1a5;
      background: rgba(251, 146, 60, 0.18);
    }

    .info-item strong,
    .info-item small {
      display: block;
    }

    .info-item strong {
      font-size: 14px;
    }

    .info-item small {
      margin-top: 4px;
      color: #c3c0dc;
      font-size: 11px;
    }

    .info-divider {
      width: 1px;
      height: 35px;
      background: rgba(255, 255, 255, 0.2);
    }

    .hero-link {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
    }

    .hero-link span {
      display: grid;
      place-items: center;
      width: 25px;
      height: 25px;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transition: transform 0.2s ease;
    }

    .hero-link:hover span {
      transform: translateY(3px);
    }

    /* Hero illustration */

    .hero-art {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 310px;
    }

    .brain-circle {
      position: relative;
      z-index: 1;
      display: grid;
      place-items: center;
      width: 205px;
      height: 205px;
      color: #e7ddff;
      border: 1px solid rgba(221, 214, 254, 0.35);
      border-radius: 50%;
      background: radial-gradient(circle, #6c58a8 0%, #40316f 67%, #33265e 100%);
      box-shadow: 0 0 65px rgba(167, 139, 250, 0.25),
                  inset 0 0 35px rgba(221, 214, 254, 0.12);
    }

    .brain-circle svg {
      position: relative;
      z-index: 1;
      width: 142px;
      height: 142px;
    }

    .orbit {
      position: absolute;
      border: 1px solid rgba(221, 214, 254, 0.16);
      border-radius: 50%;
    }

    .orbit-one {
      width: 270px;
      height: 270px;
    }

    .orbit-two {
      width: 335px;
      height: 335px;
      border-style: dashed;
    }

    .floating-card {
      position: absolute;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 13px 16px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 10px 35px rgba(14, 10, 43, 0.18);
      backdrop-filter: blur(15px);
    }

    .floating-card strong,
    .floating-card small {
      display: block;
      white-space: nowrap;
    }

    .floating-card strong {
      font-size: 11px;
    }

    .floating-card small {
      margin-top: 5px;
      color: #d3cee9;
      font-size: 10px;
    }

    .floating-icon {
      color: #fcd34d;
      font-size: 25px;
    }

    .trophy {
      font-size: 25px;
    }

    .floating-top {
      top: 30px;
      right: -5px;
    }

    .floating-bottom {
      bottom: 24px;
      left: -10px;
    }

    .sparkle {
      position: absolute;
      color: #d8ccff;
    }

    .sparkle-one {
      top: 28px;
      left: 20%;
      font-size: 22px;
    }

    .sparkle-two {
      top: 47%;
      right: 0;
      font-size: 30px;
    }

    .sparkle-three {
      bottom: 25px;
      right: 20%;
      color: #fcd34d;
      font-size: 20px;
    }

    /* Categories */

    .categories-section {
      padding-top: 43px;
      scroll-margin-top: 24px;
    }

    .section-heading {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    .section-label {
      color: #7965cf;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }

    .section-heading h2 {
      margin: 9px 0 7px;
      color: #20213a;
      font-size: clamp(23px, 2.5vw, 30px);
      font-weight: 800;
      letter-spacing: -0.8px;
    }

    .section-heading p {
      margin: 0;
      color: #85869a;
      font-size: 13px;
    }

    .category-count {
      flex-shrink: 0;
      padding: 10px 14px;
      border: 1px solid #e9e7f4;
      border-radius: 12px;
      color: #77758e;
      background: white;
      font-size: 12px;
    }

    .category-count span {
      color: #6551bd;
      font-weight: 800;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }

    .category-card {
      --accent: #8066dc;
      --soft: #f0ebff;
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 275px;
      padding: 23px;
      overflow: hidden;
      border: 1px solid #ececf4;
      border-radius: 20px;
      background: white;
      box-shadow: 0 5px 20px rgba(32, 33, 58, 0.025);
      transition: transform 0.25s ease, box-shadow 0.25s ease,
                  border-color 0.25s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
      border-color: #dcd4ff;
      box-shadow: 0 18px 35px rgba(51, 43, 100, 0.09);
    }

    .theme-1 { --accent: #278bba; --soft: #e6f6fc; }
    .theme-2 { --accent: #25977d; --soft: #e3f8f0; }
    .theme-3 { --accent: #d58b32; --soft: #fff2df; }
    .theme-4 { --accent: #d15e91; --soft: #ffebf4; }
    .theme-5 { --accent: #5d77d5; --soft: #eaf0ff; }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .category-icon {
      display: grid;
      place-items: center;
      width: 53px;
      height: 53px;
      border-radius: 16px;
      background: var(--soft);
      font-size: 26px;
      transition: transform 0.25s ease;
    }

    .category-card:hover .category-icon {
      transform: rotate(-6deg) scale(1.07);
    }

    .card-arrow {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border: 1px solid #efeff5;
      border-radius: 10px;
      color: #8c8ca0;
      font-size: 17px;
      transition: color 0.2s, background 0.2s;
    }

    .category-card:hover .card-arrow {
      color: white;
      border-color: var(--accent);
      background: var(--accent);
    }

    .category-card h3 {
      margin: 0 0 9px;
      color: #26263f;
      font-size: 18px;
      font-weight: 750;
      overflow-wrap: anywhere;
    }

    .category-description {
      display: -webkit-box;
      min-height: 42px;
      margin: 0 0 15px;
      overflow: hidden;
      color: #85869a;
      font-size: 12px;
      line-height: 1.75;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .card-meta {
      margin-bottom: 19px;
      color: #85869a;
      font-size: 11px;
    }

    .start-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: 43px;
      margin-top: auto;
      padding: 0 15px;
      border: 1px solid transparent;
      border-radius: 11px;
      color: var(--accent);
      background: var(--soft);
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      font-weight: 750;
      transition: color 0.2s ease, background 0.2s ease,
                  transform 0.2s ease;
    }

    .start-button:hover:not(:disabled) {
      color: white;
      background: var(--accent);
    }

    .start-button:disabled {
      cursor: wait;
      opacity: 0.75;
    }

    .button-arrow {
      font-size: 18px;
      transition: transform 0.2s ease;
    }

    .start-button:hover .button-arrow {
      transform: translateX(3px);
    }

    .button-spinner {
      width: 15px;
      height: 15px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding: 13px 16px;
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #b91c1c;
      background: #fef2f2;
      font-size: 13px;
    }

    .error-message span {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      color: white;
      background: #dc2626;
      font-weight: 800;
    }

    .empty-state {
      padding: 55px 20px;
      border: 1px dashed #dcdbea;
      border-radius: 20px;
      text-align: center;
      background: white;
    }

    .empty-icon {
      font-size: 35px;
    }

    .empty-state h3 {
      margin: 14px 0 8px;
      font-size: 18px;
    }

    .empty-state p {
      color: #85869a;
      font-size: 13px;
    }

    .bottom-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      margin-top: 30px;
      color: #85869a;
      font-size: 12px;
      text-align: center;
    }

    .note-check {
      display: grid;
      place-items: center;
      width: 21px;
      height: 21px;
      border-radius: 50%;
      color: #278b73;
      background: #e3f8f0;
      font-size: 12px;
      font-weight: 800;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (min-width: 1500px) {
      .category-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    @media (max-width: 1050px) {
      .hero {
        grid-template-columns: 1fr 0.7fr;
        padding: 36px 30px;
      }

      .hero-art {
        transform: scale(0.85);
      }

      .category-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .quiz-home {
        padding: 16px 14px 30px;
      }

      .hero {
        grid-template-columns: 1fr;
        padding: 34px 24px 20px;
        border-radius: 22px;
      }

      .hero h1 {
        font-size: clamp(30px, 7vw, 40px);
        letter-spacing: -1.2px;
      }

      .hero-description {
        font-size: 13px;
      }

      .hero-art {
        min-height: 245px;
        margin-top: 12px;
        transform: scale(0.85);
      }

      .floating-top {
        right: 0;
      }

      .floating-bottom {
        left: 0;
      }

      .categories-section {
        padding-top: 33px;
      }

      .section-heading {
        align-items: flex-start;
      }

      .category-count {
        margin-top: 15px;
        padding: 8px 10px;
      }

      .category-grid {
        grid-template-columns: 1fr;
        gap: 14px;
      }

      .category-card {
        min-height: 255px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class HomeComponent {
  private api = inject(QuizService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  settings = signal<ExamSettings | null>(null);
  starting = signal<number | null>(null);
  error = signal('');

  constructor() {
    this.api.categories().subscribe({
      next: c => this.categories.set(c),
      error: () => this.error.set('Could not load quiz categories. Please refresh the page.')
    });

    this.api.settings().subscribe({
      next: s => this.settings.set(s),
      error: () => this.error.set('Could not load exam settings.')
    });
  }

  start(c: Category) {
    this.error.set('');
    this.starting.set(c.id);

    this.api.start(c.id).subscribe({
      next: attempt => this.router.navigate(['/quiz', attempt.id]),
      error: e => {
        this.error.set(e.error?.message ?? 'Could not start the exam');
        this.starting.set(null);
      }
    });
  }
}
