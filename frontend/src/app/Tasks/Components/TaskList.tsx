"use client";

import { Task } from "../types"; // Importando o tipo centralizado
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TasklistProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const Tasklist: React.FC<TasklistProps> = ({ tasks, onEditTask, onDeleteTask, onCompleteTask }) => {
  return (
    <div className="py-4 space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">Nenhuma tarefa encontrada</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2">Tarefas</th>
              <th className="text-left p-2">Data de Vencimento</th>
              <th className="text-left p-2">Prioridade</th>
              <th className="text-left p-2">Status</th>
              <th className="text-right p-2">Menu</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-2">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                  </div>
                </td>
                <td className="p-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Sem Data"}</td>
                <td className="p-2">{task.priority}</td>
                <td className="p-2">{task.status}</td>
                <td className="p-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white shadow-md border border-gray-200 rounded-md">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCompleteTask(task.id)}>Finalizar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteTask(task.id)}>Deletar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tasklist;