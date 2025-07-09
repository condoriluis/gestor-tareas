export interface Task {
  id_task: number;
  id_user_task: number;
  user_name: string;
  title_task: string;
  description_task: string;
  priority_task: string;
  status_task: string;
  date_start_task: string | null;
  date_completed_task: string | null;
  date_created_task: string;
}

export interface TaskHistory {
  id_history: number;
  id_task_history: number;
  id_user_history: number;
  user_name: string;
  old_status_history: string;
  new_status_history: string;
  action_history: string;
  description_history: string;
  date_created_history: string;
  date_updated_history: string;
}

export interface User {
  id_user: number;
  name_user: string;
  email_user: string;
  rol_user: string;
  status_user: number;
  date_created_user: string;
}