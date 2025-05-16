"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import FilterSession from "./Components/Filter";
import Tasklist from "./Components/TaskList";
import EditTaskModal from "./Components/EditTaskModal";
import Header from "./Components/Header";
import { Task } from "./types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"todas" | "concluídas" | "pendentes">("todas");
  const [priorityFilter, setPriorityFilter] = useState<"todas" | "baixa" | "média" | "alta" | "urgente">("todas");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
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

    fetchTasks();
  }, []);

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
      setIsEditModalOpen(false);
      setEditingTask(null);
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
      priorityFilter === "todas" || task.priority.toLowerCase() === priorityFilter.toLowerCase();

    return statusMatch && priorityMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogout={() => {
          console.log("Usuário deslogado");
        }}
      />
      <div className="container mx-auto px-4 py-6">
        <FilterSession
          tasks={filteredTasks}
          onAddTask={(newTask) => setTasks((prevTasks) => [...prevTasks, newTask])}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        <div className="overflow-x-auto">
          <Tasklist
            tasks={filteredTasks}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
          />
        </div>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            open={isEditModalOpen}
            onOpenChange={(open) => {
              setIsEditModalOpen(open);
              if (!open) setEditingTask(null);
            }}
            onSave={handleEditTask}
          />
        )}
      </div>
    </div>
  );
}