"use client";

import { Task } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  CheckCircle2,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface TasklistProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const Tasklist: React.FC<TasklistProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      URGENTE: "text-red-700 bg-red-50",
      ALTA: "text-orange-700 bg-orange-50",
      MEDIA: "text-yellow-700 bg-yellow-50",
      BAIXA: "text-green-700 bg-green-50",
    };
    return colors[priority as keyof typeof colors] || "";
  };

  const getStatusColor = (status: string) => {
    return status === "CONCLUÍDA"
      ? "text-green-700 bg-green-50"
      : "text-yellow-700 bg-yellow-50";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Clock className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Comece adicionando uma nova tarefa usando o botão acima.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Tarefas
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Data de Vencimento
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Prioridade
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right p-4 text-sm font-medium text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-4">
                    <div className="max-w-md">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "Sem Data"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status === "CONCLUIDO" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[160px] p-2 bg-white shadow-lg border border-gray-100"
                      >
                        <DropdownMenuItem
                          onClick={() => onEditTask(task)}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onCompleteTask(task.id)}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Finalizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteTask(task.id)}
                          className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tasklist;