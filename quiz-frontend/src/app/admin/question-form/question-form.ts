import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../core/admin.service';
import { Category, OptionDto, QuestionDto } from '../../core/models';

@Component({
  selector: 'app-question-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './question-form.html',
  styleUrl: './question-form.css',
})
export class QuestionForm {
  private fb = inject(FormBuilder);
  private api = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly String = String;

  id = this.route.snapshot.paramMap.get('id');       // null when adding a new question
  categories = signal<Category[]>([]);
  error = signal('');
  saving = signal(false);

  form = this.fb.group({
    text: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    options: new FormArray<FormGroup>([])
  });

  get options() {
    return this.form.controls.options;
  }

  constructor() {
    this.api.categories().subscribe(c => this.categories.set(c));
    if (this.id) {
      this.api.question(Number(this.id)).subscribe(q => {
        this.form.patchValue({ text: q.text, categoryId: q.categoryId });
        q.options.forEach(o => this.options.push(this.optionGroup(o)));
      });
    } else {
      this.addOption();
      this.addOption();
      this.addOption();
      this.addOption();
    }
  }

  private optionGroup(o?: OptionDto) {
    return this.fb.group({
      id: [o?.id ?? null],
      text: [o?.text ?? '', Validators.required],
      correct: [o?.correct ?? false]
    });
  }

  addOption() {
    this.options.push(this.optionGroup());
  }

  removeOption(i: number) {
    if (this.options.length > 2) this.options.removeAt(i);
  }

  setCorrect(index: number) {
    this.options.controls.forEach((g, i) => g.get('correct')!.setValue(i === index));
  }

  save() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please choose a category and fill in the question and every option.');
      return;
    }
    const v = this.form.getRawValue();
    const options = v.options as OptionDto[];
    if (options.length < 2) {
      this.error.set('A question needs at least 2 options.');
      return;
    }
    if (options.filter(o => o.correct).length !== 1) {
      this.error.set('Select exactly one correct option.');
      return;
    }

    const body: QuestionDto = {
      text: v.text ?? '',
      categoryId: v.categoryId!,
      options: options.map(o => ({ id: o.id ?? null, text: o.text, correct: o.correct }))
    };
    this.saving.set(true);
    const request = this.id
      ? this.api.updateQuestion(Number(this.id), body)
      : this.api.createQuestion(body);
    request.subscribe({
      next: () => this.router.navigate(['/admin/questions']),
      error: e => {
        this.error.set(e.error?.message ?? 'Could not save the question');
        this.saving.set(false);
      }
    });
  }
}
