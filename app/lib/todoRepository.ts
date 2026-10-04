import { Todo } from "../types/todo";
import { getDB } from "./db";

export const getTodos = async (): Promise<Todo[]> => {
  const db = await getDB();

  const response = await db.allDocs({
    include_docs: true,
  });

  return response.rows
    .map((row) => row.doc as Todo)
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const createTodo = async (title: string): Promise<Todo> => {
  const db = await getDB();

  const now = new Date().toISOString();

  const todo: Todo = {
    _id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  await db.put(todo);

  return todo;
};

export const updateTodo = async (todo: Todo, title: string): Promise<Todo> => {
  const db = await getDB();

  const updatedTodo: Todo = {
    ...todo,
    title,
    updatedAt: new Date().toISOString(),
  };

  await db.put(updatedTodo);

  return updatedTodo;
};

export const deleteTodo = async (todo: Todo): Promise<void> => {
  const db = await getDB();

  await db.remove(todo as Required<Todo>);
};

export const toggleTodoCompletion = async (todo: Todo): Promise<Todo> => {
  const db = await getDB();

  const updatedTodo: Todo = {
    ...todo,
    completed: !todo.completed,
    updatedAt: new Date().toISOString(),
  };

  await db.put(updatedTodo);

  return updatedTodo;
};

// In case you want to clear the database, you can use this function
export const clearDatabase = async () => {
  const db = await getDB();

  await db.destroy();

  window.location.reload();
};
