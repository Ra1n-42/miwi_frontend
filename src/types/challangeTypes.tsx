export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  subchallenges: Subtask[];
}

export interface Section {
  id: string;
  title: string;
  items: Task[];
}

export interface ChallengeHeader {
  title: string;
  description: string;
  created_at: string;
  challange_end: string;
}

export interface Challenge {
  id?: string;
  header: ChallengeHeader;
  sections: Section[];
}
