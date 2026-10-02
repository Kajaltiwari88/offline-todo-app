export interface Todo {
  _id: string;
  _rev?: string;

  title: string;
  completed: boolean;

  createdAt: string;
  updatedAt: string;
}
