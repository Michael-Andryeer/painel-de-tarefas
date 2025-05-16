"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import FilterSession from "./Components/Filter";
import Tasklist from "./Components/TaskList";
import { Task } from "./types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"todas" | "concluídas" | "pendentes">("todas");
  const [priorityFilter, setPriorityFilter] = useState<"todas" | "baixa" | "média" | "alta" | "urgente">("todas");

  const fetchTasks = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies["authFlowToken"];
      if (!token) {
        console.error("Token não encontrado nos cookies");
        return;
      }

      const response = await axios.get(`http://localhost:8000/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === "todas" ||
      (statusFilter === "pendentes" && task.status === "PENDENTE") ||
      (statusFilter === "concluídas" && task.status === "CONCLUIDO");

    const priorityMatch =
      priorityFilter === "todas" || task.priority.toLowerCase() === priorityFilter;

    return statusMatch && priorityMatch;
  });

  return (
    <div className="p-4">
      <FilterSession
        tasks={filteredTasks}
        onAddTask={handleAddTask}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      <Tasklist tasks={filteredTasks} />
    </div>
  );
}