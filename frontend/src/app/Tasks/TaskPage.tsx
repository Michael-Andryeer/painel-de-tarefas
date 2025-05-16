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
  }, []);

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      const cookies = parseCookies();
      const token = cookies["authFlowToken"];
      const response = await axios.patch(
        `http://localhost:8000/tasks/${updatedTask.id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? response.data : task))
      );
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const cookies = parseCookies();
      const token = cookies["authFlowToken"];
      await axios.delete(`http://localhost:8000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const cookies = parseCookies();
      const token = cookies["authFlowToken"];
      const response = await axios.patch(
        `http://localhost:8000/tasks/${taskId}`,
        { status: "CONCLUIDO" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Erro ao finalizar tarefa:", error);
    }
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
      <Tasklist
        tasks={filteredTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onCompleteTask={handleCompleteTask}
      />
    </div>
  );
}