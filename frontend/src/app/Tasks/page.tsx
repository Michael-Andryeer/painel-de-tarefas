"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { parseCookies } from "nookies";
import FilterSession from "./Components/Filter";
import Tasklist from "./Components/TaskList";
import EditTaskModal from "./Components/EditTaskModal";
import Header from "./Components/Header";
import { Task } from "./types";

export default function TasksPage() {
  const router = useRouter(); 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "todas" | "concluídas" | "pendentes"
  >("todas");
  const [priorityFilter, setPriorityFilter] = useState<
    "todas" | "baixa" | "média" | "alta" | "urgente"
  >("todas");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies["authFlowToken"];

    if (!token) {
      console.error("Token não encontrado nos cookies. Redirecionando...");
      router.push("/Authentication");
    }
  }, [router]); 

  const fetchTasks = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies["authFlowToken"];
      if (!token) {
        console.error("Token não encontrado nos cookies");
        return;
      }

      const response = await axios.get(`http://localhost:8000/tasks`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { tasks: newTasks, total } = response.data;

      setTasks(newTasks || []);
      setTotal(total);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

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
        prevTasks.map((task) =>
          task.id === updatedTask.id ? response.data : task
        )
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
  
      setTotal((prevTotal) => {
        const newTotal = prevTotal - 1;
  
        setTotalPages(Math.ceil(newTotal / limit));
  
        return newTotal;
      });
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

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const statusMatch =
          statusFilter === "todas" ||
          (statusFilter === "pendentes" && task.status === "PENDENTE") ||
          (statusFilter === "concluídas" && task.status === "CONCLUIDO");

        const priorityMatch =
          priorityFilter === "todas" ||
          task.priority.toLowerCase() === priorityFilter.toLowerCase();

        return statusMatch && priorityMatch;
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogout={() => {
          console.log("Usuário deslogado");
        }}
      />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4">Tarefas ({total})</h1>{" "}
        {/* Exibe o total de tarefas */}
        <FilterSession
          tasks={filteredTasks}
          onAddTask={(newTask) => {
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setTotal((prevTotal) => prevTotal + 1);
          }}
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
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="mx-4">
            Página {page} de {totalPages} ({total} tarefas no total)
          </span>
          <button
            onClick={() =>
              setPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Próxima
          </button>
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
