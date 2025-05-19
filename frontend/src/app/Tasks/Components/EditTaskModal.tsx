"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Task, TaskPriority } from "../types";

interface TaskEditDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTask: Task) => void;
}

export default function EditTaskModal({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState<string>(
    task.dueDate ? new Date(task.dueDate).toLocaleDateString("pt-BR") : ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, "");

    const dateWithSlashes = formattedValue
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2");

    setDueDate(dateWithSlashes);

    if (dateWithSlashes.length === 10) {
      const [day, month, year] = dateWithSlashes.split("/").map(Number);
      const isValidDate =
        day > 0 &&
        day <= 31 &&
        month > 0 &&
        month <= 12 &&
        year >= 1900 &&
        year <= 2100;

      if (!isValidDate) {
        setError("Data inválida. Use o formato dd/mm/yyyy.");
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  const handleSaveTask = (): void => {
    if (error) {
      alert("Por favor, corrija os erros antes de salvar.");
      return;
    }

    const [day, month, year] = dueDate.split("/").map(Number);
    const formattedDate = new Date(year, month - 1, day);

    const updatedTask: Task = {
      ...task,
      title,
      description,
      priority,
      dueDate: formattedDate,
    };
    onSave(updatedTask);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-lg p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-800">Editar Tarefa</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Edite os detalhes da tarefa abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="title" className="text-gray-700">Título</Label>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Label htmlFor="description" className="text-gray-700">Descrição</Label>
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-x-4">
            <div className="flex-1 flex flex-col gap-4">
              <Label htmlFor="dueDate" className="text-gray-700">Data de vencimento</Label>
              <Input
                placeholder="dd/mm/yyyy"
                value={dueDate}
                onChange={(e) => handleDateChange(e.target.value)}
                maxLength={10}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <Label htmlFor="priority" className="text-gray-700">Prioridade</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="URGENTE">URGENTE</option>
                <option value="ALTA">ALTA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="BAIXA">BAIXA</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-md py-2"
            onClick={handleSaveTask}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}