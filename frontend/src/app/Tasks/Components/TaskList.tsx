"use client";

import { format } from "date-fns";
import React from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "../types"; // Importando o tipo centralizado

interface TasklistProps {
  tasks: Task[];
}

const Tasklist: React.FC<TasklistProps> = ({ tasks }) => {
  return (
    <div className="py-4 space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">Nenhuma tarefa encontrada</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefas</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Menu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                  </div>
                </TableCell>
                <TableCell>{task.dueDate ? format(new Date(task.dueDate), "dd/MM/yyyy") : "Sem Data"}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell className="text-right">...</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
            
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
};

export default Tasklist;