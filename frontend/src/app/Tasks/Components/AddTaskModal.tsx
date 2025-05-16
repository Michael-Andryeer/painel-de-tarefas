"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { parse, isBefore, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { parseCookies } from "nookies";
import { Task } from "../types"; // Importando o tipo centralizado

export default function CreateTaskModal({ onTaskAdd }: { onTaskAdd: (newTask: Task) => void }) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(""); 
  const [startDate, setStartDate] = useState<string>(""); 
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setDueDate("");
    setStartDate("");
  };

  const formatDate = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); 
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (!match) return value;
    const [, day, month, year] = match;

    const limitedYear = year?.slice(0, 4);

    return [day, month, limitedYear].filter(Boolean).join("/");
  };

  const handleAddTask = async () => {
    try {
      const parsedStartDate = parse(startDate, "dd/MM/yyyy", new Date());
      const parsedDueDate = parse(dueDate, "dd/MM/yyyy", new Date());
      const today = new Date();
  
      if (isBefore(parsedStartDate, today) && !isToday(parsedStartDate)) {
        throw new Error("A data de início não pode ser anterior ao dia atual.");
      }
  
      if (isBefore(parsedDueDate, parsedStartDate)) {
        throw new Error("A data de vencimento não pode ser anterior à data de início.");
      }
  
      const isoStartDate = parsedStartDate.toISOString();
      const isoDueDate = parsedDueDate.toISOString();
  
      const { authFlowToken } = parseCookies();
  
      if (!authFlowToken) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
      }
  
      const response = await axios.post(
        "http://localhost:8000/tasks",
        {
          title,
          description,
          priority,
          dueDate: isoDueDate,
          startDate: isoStartDate,
          status: "PENDENTE",
        },
        {
          headers: {
            Authorization: `Bearer ${authFlowToken}`,
          },
        }
      );
  
      if (typeof onTaskAdd === "function") {
        onTaskAdd(response.data);
      }
      clearFields();
      setIsOpen(false);
      toast.success(`Tarefa "${response.data.title}" criada com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao adicionar tarefa:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Erro ao adicionar tarefa. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
          <Plus className="h-4 w-4" /> Criar Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-lg rounded-md">
        <DialogHeader className="mb-2">
          <DialogTitle>Criar Tarefa</DialogTitle>
          <DialogDescription>Adicione uma nova tarefa</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="title">Título</Label>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Label htmlFor="description">Descrição</Label>
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Label htmlFor="startDate">Data de início</Label>
          <Input
            placeholder="dd/MM/yyyy"
            value={startDate}
            onChange={(e) => setStartDate(formatDate(e.target.value))}
          />
          <Label htmlFor="dueDate">Data de vencimento</Label>
          <Input
            placeholder="dd/MM/yyyy"
            value={dueDate}
            onChange={(e) => setDueDate(formatDate(e.target.value))}
          />
          <Label htmlFor="priority">Prioridade</Label>
          <Select onValueChange={(value) => setPriority(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecione a prioridade" />
  </SelectTrigger>
  <SelectContent className="bg-white text-black">
    <SelectGroup>
      <SelectLabel>Prioridades</SelectLabel>
      <SelectItem value="URGENTE">Urgente</SelectItem>
      <SelectItem value="ALTA">Alta</SelectItem>
      <SelectItem value="MEDIA">Média</SelectItem>
      <SelectItem value="BAIXA">Baixa</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
        </div>
        <DialogFooter className="mt-4 w-full">
          <Button
            type="button"
            className="max-w-xs w-full mx-auto cursor-pointer"
            onClick={handleAddTask}
          >
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}