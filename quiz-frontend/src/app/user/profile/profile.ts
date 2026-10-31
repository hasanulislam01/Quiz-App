import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/quiz.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private api = inject(QuizService);

  profile = signal<UserProfile | null>(null);
  message = signal('');
  error = signal('');
  saving = signal(false);
  current = '';
  next = '';
  confirm = '';

  constructor() {
    this.api.profile().subscribe(p => this.profile.set(p));
  }

  changePassword() {
    this.message.set('');
    this.error.set('');
    if (!this.current || !this.next || !this.confirm) {
      this.error.set('Please fill in all three fields.');
      return;
    }
    if (this.next.length < 6) {
      this.error.set('The new password must be at least 6 characters.');
      return;
    }
    if (this.next !== this.confirm) {
      this.error.set('The new password and the confirmation do not match.');
      return;
    }
    this.saving.set(true);
    this.api.changePassword(this.current, this.next).subscribe({
      next: () => {
        this.message.set('Your password has been updated.');
        this.current = '';
        this.next = '';
        this.confirm = '';
        this.saving.set(false);
      },
      error: e => {
        this.error.set(e.error?.message ?? 'Could not update the password');
        this.saving.set(false);
      }
    });
  }
}
