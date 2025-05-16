"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import FilterSession from "./Components/Filter";
import Tasklist from "./Components/TaskList";
import { Task } from "./types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"todas" | "concluídas" | "pendentes">("todas");
  const [priorityFilter, setPriorityFilter] = useState<"todas" | "baixa" | "média" | "alta" | "urgente">("todas");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies["authFlowToken"];
        if (!token) {
          console.error("Token não encontrado nos cookies");
          return;
        }

        // Decodificar o token para verificar informações do usuário
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decodedToken.exp || decodedToken.exp < currentTime) {
          console.error("Token expirado ou inválido");
          return;
        }

        const userId = decodedToken.sub;

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

    fetchTasks();
  }, []);

  const handleAddTask = (newTask: any) => {
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