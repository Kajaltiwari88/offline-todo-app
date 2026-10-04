export interface Todo {
  _id: string;
  _rev?: string;

  title: string;
  completed: boolean;

  createdAt: string;
  updatedAt: string;
}

export type Filter = "all" | "active" | "completed";

export interface TodoFormProps {
  onAdd: (title: string) => Promise<void>;
}
