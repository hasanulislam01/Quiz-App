export type Role = 'USER' | 'ADMIN';
export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

export interface AuthUser { token: string; name: string; email: string; role: Role; }

export interface Category { id: number; name: string; description: string; questionCount: number; }
export interface ExamSettings { questionCount: number; durationMinutes: number; }

export interface Choice { id: number; text: string; }
export interface ExamQuestion { id: number; text: string; options: Choice[]; }

export interface ReviewOption { id: number; text: string; correct: boolean; }
export interface ReviewItem {
  questionId: number; text: string; options: ReviewOption[];
  selectedOptionId: number | null; correct: boolean;
}

export interface AttemptDetail {
  id: number; categoryId: number; categoryName: string; userName: string;
  status: AttemptStatus; score: number; total: number; startedAt: string;
  remainingSeconds: number;
  questions: ExamQuestion[] | null;
  review: ReviewItem[] | null;
}

export interface AttemptSummary {
  id: number; categoryName: string; userName: string;
  status: AttemptStatus; score: number; total: number; startedAt: string;
}

// admin
export interface OptionDto { id?: number | null; text: string; correct: boolean; }
export interface QuestionDto {
  id?: number; text: string; categoryId: number; categoryName?: string; options: OptionDto[];
}
export interface AdminUser { id: number; name: string; email: string; role: Role; }
export interface CategoryStat { id: number; name: string; questionCount: number; enoughQuestions: boolean; }
export interface Dashboard {
  users: number; categories: number; questions: number; attempts: number;
  examQuestionCount: number; categoryStats: CategoryStat[];
}

export interface PracticePage {
  items: QuestionDto[]; page: number; totalPages: number; totalItems: number;
}