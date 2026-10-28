import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  auth = inject(AuthService);

  features = [
    { title: 'Random questions', text: 'Every exam is a fresh random set of questions from the category you choose.' },
    { title: 'Timed exams', text: 'A countdown timer keeps each exam fair, and it submits automatically when time is up.' },
    { title: 'Answer review', text: 'See your score and check every question with the correct answer afterwards.' }
  ];

  categories = [
    { name: 'General Knowledge', text: 'Everyday facts about the world.' },
    { name: 'Current Affairs', text: 'News and world organisations.' },
    { name: 'Sports', text: 'Games, athletes and tournaments.' },
    { name: 'IQ', text: 'Logic, patterns and numbers.' }
  ];
}
