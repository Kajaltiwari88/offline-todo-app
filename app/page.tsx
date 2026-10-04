"use client";

import { useMemo, useState } from "react";
import TodoForm from "./components/TodoForm";
import { useTodos } from "./hooks/useTodos";
import type { Filter, Todo } from "./types/todo";

export default function Home() {
  const { todos, loading, addTodo, editTodo, removeTodo, completeTodo } =
    useTodos();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredTodos = useMemo(() => {
    return todos?.filter((todo) => {
      const matchesSearch = todo?.title
        ?.toLowerCase()
        .includes(search?.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);

      return matchesSearch && matchesFilter;
    });
  }, [todos, search, filter]);

  const completed = todos.filter((todo) => todo.completed).length;
  const active = todos.length - completed;

  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEdit = async (todo: Todo) => {
    const value = editingTitle.trim();

    if (!value) return;

    await editTodo(todo, value);

    cancelEdit();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading your tasks...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-sm">
                  ✓
                </div>

                <span className="text-sm font-semibold tracking-wide text-indigo-600">
                  TODO
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Tasks
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Organize your day and get things done.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Saved offline
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <TodoForm onAdd={addTodo} />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-indigo-900">
              {todos.length}
            </p>

            <p className="mt-1 text-xs text-indigo-500">All your tasks</p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Active
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-900">{active}</p>

            <p className="mt-1 text-xs text-amber-600">Still to do</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {completed}
            </p>

            <p className="mt-1 text-xs text-emerald-600">Great progress</p>
          </div>
        </section>

        <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your tasks..."
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-indigo-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-indigo-50
                "
              />
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1">
              {(["all", "active", "completed"] as Filter[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`
                      flex-1
                      rounded-lg
                      px-3 py-2
                      text-xs font-semibold
                      capitalize
                      transition
                      sm:flex-none
                      sm:px-4
                      ${
                        filter === item
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }
                    `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Your Tasks
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredTodos.length} task
                  {filteredTodos.length !== 1 ? "s" : ""}
                </p>
              </div>

              {completed > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {completed} done
                </span>
              )}
            </div>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-500">
                ✓
              </div>

              <h3 className="text-base font-semibold text-slate-800">
                No tasks found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                {search
                  ? "Try searching for something else."
                  : "Add your first task and start getting things done."}
              </p>
            </div>
          ) : (
            <div>
              {filteredTodos.map((todo, index) => (
                <div
                  key={todo._id}
                  className={`
                    group
                    flex
                    items-center
                    gap-3
                    px-4 py-4
                    transition
                    hover:bg-slate-50
                    sm:gap-4
                    sm:px-6
                    ${
                      index !== filteredTodos.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }
                  `}
                >
                  <button
                    onClick={() => completeTodo(todo)}
                    aria-label={
                      todo.completed ? "Mark as active" : "Mark as completed"
                    }
                    className={`
                      flex
                      h-6 w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      transition
                      ${
                        todo.completed
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 hover:border-indigo-500"
                      }
                    `}
                  >
                    {todo.completed && (
                      <span className="text-xs font-bold">✓</span>
                    )}
                  </button>

                  {editingId === todo._id ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(todo);
                        }

                        if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                      className="
                        min-w-0
                        flex-1
                        rounded-xl
                        border border-indigo-300
                        bg-white
                        px-3 py-2
                        text-sm
                        outline-none
                        ring-4
                        ring-indigo-50
                        text-black
                      "
                    />
                  ) : (
                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          truncate
                          text-sm
                          font-medium
                          sm:text-[15px]
                          ${
                            todo?.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-700"
                          }
                        `}
                      >
                        {todo?.title}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {todo?.completed ? "Completed" : "In progress"}
                      </p>
                    </div>
                  )}

                  {editingId === todo._id ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => saveEdit(todo)}
                        className="
                          rounded-lg
                          bg-indigo-600
                          px-3 py-2
                          text-xs
                          font-semibold
                          text-white
                          hover:bg-indigo-700
                        "
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="
                          rounded-lg
                          px-3 py-2
                          text-xs
                          font-medium
                          text-slate-500
                          hover:bg-slate-100
                        "
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => startEdit(todo)}
                        className="
                          rounded-lg
                          px-2 py-2
                          text-xs
                          font-medium
                          text-slate-400
                          transition
                          hover:bg-indigo-50
                          hover:text-indigo-600
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => removeTodo(todo)}
                        className="
                          rounded-lg
                          px-2 py-2
                          text-xs
                          font-medium
                          text-slate-400
                          transition
                          hover:bg-red-50
                          hover:text-red-500
                        "
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
          <span className="text-xs text-slate-400">
            Your tasks are stored locally
          </span>

          <span className="hidden text-slate-300 sm:block">•</span>

          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Offline ready
          </span>
        </footer>
      </div>
    </main>
  );
}
