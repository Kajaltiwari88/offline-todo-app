"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoCompletion,
  updateTodo,
} from "../lib/todoRepository";

import { getDB } from "../lib/db";

import type { Todo } from "../types/todo";
import { startSync } from "../lib/sync";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Load existing Todos
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 2. Start CouchDB sync
  useEffect(() => {
    let sync: any;

    const start = async () => {
      sync = await startSync();
    };

    start();

    return () => {
      sync?.cancel();
    };
  }, []);

  // Listen for database changes
  useEffect(() => {
    let changes: any;

    const startListening = async () => {
      const db = await getDB();

      changes = db
        .changes({
          since: "now",
          live: true,
          include_docs: true,
        })
        .on("change", () => {
          loadTodos();
        });
    };

    startListening();

    return () => {
      changes?.cancel();
    };
  }, [loadTodos]);

  const addTodo = async (title: string) => {
    const newTodo = await createTodo(title);

    setTodos((current) => [newTodo, ...current]);
  };

  const editTodo = async (todo: Todo, title: string) => {
    const updatedTodo = await updateTodo(todo, title);

    setTodos((current) =>
      current.map((item) =>
        item._id === updatedTodo._id ? updatedTodo : item,
      ),
    );
  };

  const removeTodo = async (todo: Todo) => {
    await deleteTodo(todo);

    setTodos((current) => current.filter((item) => item._id !== todo._id));
  };

  const completeTodo = async (todo: Todo) => {
    const updatedTodo = await toggleTodoCompletion(todo);

    setTodos((current) =>
      current.map((item) =>
        item._id === updatedTodo._id ? updatedTodo : item,
      ),
    );
  };

  return {
    todos,
    loading,
    addTodo,
    editTodo,
    removeTodo,
    completeTodo,
  };
}
