"use client";

import { useState } from "react";
import { TodoFormProps } from "../types/todo";

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = title.trim();

    if (!value || adding) return;

    try {
      setAdding(true);

      await onAdd(value);

      setTitle("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="
            w-full
            rounded-2xl
            border border-slate-200
            bg-white
            px-5 py-4
            text-sm text-slate-800
            placeholder:text-slate-400
            shadow-sm
            outline-none
            transition
            focus:border-indigo-400
            focus:ring-4
            focus:ring-indigo-100
          "
        />
      </div>

      <button
        type="submit"
        disabled={!title.trim() || adding}
        className="
          rounded-2xl
          bg-indigo-600
          px-7 py-4
          text-sm font-semibold text-white
          shadow-sm
          transition
          hover:bg-indigo-700
          hover:shadow-md
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:w-auto
        "
      >
        {adding ? "Adding..." : "+ Add Task"}
      </button>
    </form>
  );
}
