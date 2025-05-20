import { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { Task, TaskPriority } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parse, isBefore, isToday } from "date-fns";
import axios from "axios";
import { parseCookies } from "nookies";
import { toast } from "sonner";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdd: (newTask: Task) => void;
}

export default function CreateTaskModal({
  open,
  onOpenChange,
  onTaskAdd,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<TaskPriority>("URGENTE");
  const [dueDate, setDueDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setPriority("URGENTE");
      setDueDate("");
      setStartDate("");
      setDateError(null);
      setFormTouched(false);
      setFocused(null);
    }
  }, [open]);

  const handleDateChange = (value: string, setDate: (date: string) => void) => {
    const formattedValue = value.replace(/\D/g, "");
    const dateWithSlashes = formattedValue
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2");

    setDate(dateWithSlashes);
    setFormTouched(true);

    if (dateWithSlashes.length === 10) {
      validateDate(dateWithSlashes);
    } else if (dateWithSlashes.length > 0) {
      setDateError("Complete a data no formato dd/mm/aaaa");
    } else {
      setDateError(null);
    }
  };

  const validateDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const isValidDate =
      day > 0 &&
      day <= 31 &&
      month > 0 &&
      month <= 12 &&
      year >= 1900 &&
      year <= 2100;

    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLengths[1] = 29;
    }

    const isValidDay = day <= monthLengths[month - 1];

    if (!isValidDate || !isValidDay) {
      setDateError("Data inválida. Use o formato dd/mm/aaaa.");
    } else {
      setDateError(null);
    }
  };

  const handleSaveTask = async (): Promise<void> => {
    setFormTouched(true);

    if (!title.trim() || dateError) {
      return;
    }

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
      onOpenChange(false);
      toast.success(`Tarefa "${response.data.title}" criada com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao adicionar tarefa:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Erro ao adicionar tarefa. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  const getPriorityColor = (priorityValue: TaskPriority) => {
    const colors = {
      URGENTE: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      ALTA: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      MEDIA: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      BAIXA: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    };
    return colors[priorityValue] || "";
  };

  const getPriorityGradient = (priorityValue: TaskPriority) => {
    const gradients = {
      URGENTE: "from-red-500 to-red-600",
      ALTA: "from-orange-500 to-orange-600",
      MEDIA: "from-yellow-500 to-yellow-600",
      BAIXA: "from-green-500 to-green-600",
    };
    return gradients[priorityValue] || "from-indigo-500 to-purple-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white p-0 overflow-hidden rounded-xl border-none shadow-2xl">
        <div
          className={`bg-gradient-to-r ${
            priority ? getPriorityGradient(priority) : "from-indigo-500 to-purple-500"
          } p-6 transition-all duration-300`}
        >
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl font-bold text-white">
              Criar Nova Tarefa
            </DialogTitle>
            <p className="text-white/80 text-sm mt-1">
              Preencha os detalhes da tarefa conforme necessário
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 bg-white">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <div
              className={`relative overflow-hidden rounded-lg border transition-all duration-200 ${
                focused === "title" ? "ring-2 ring-indigo-500/50 border-indigo-500" : "border-gray-200"
              } ${formTouched && !title.trim() ? "border-red-400 ring-red-200" : ""}`}
            >
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFormTouched(true);
                }}
                onFocus={() => setFocused("title")}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 focus:outline-none bg-white"
                placeholder="Adicione um título para a tarefa"
              />
            </div>
            {formTouched && !title.trim() && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                O título é obrigatório
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <div
              className={`relative overflow-hidden rounded-lg border transition-all duration-200 ${
                focused === "description" ? "ring-2 ring-indigo-500/50 border-indigo-500" : "border-gray-200"
              }`}
            >
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFormTouched(true);
                }}
                onFocus={() => setFocused("description")}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 focus:outline-none min-h-[80px] resize-y bg-white"
                placeholder="Descreva os detalhes da tarefa"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Data de início
              </label>
              <div
                className={`relative flex items-center overflow-hidden rounded-lg border transition-all duration-200 bg-white ${
                  focused === "startDate" ? "ring-2 ring-indigo-500/50 border-indigo-500" : "border-gray-200"
                } ${dateError ? "border-red-400 ring-red-200" : ""}`}
              >
                <div className="pl-3 text-gray-400">
                  <Calendar size={18} />
                </div>
                <input
                  id="startDate"
                  type="text"
                  value={startDate}
                  onChange={(e) => handleDateChange(e.target.value, setStartDate)}
                  onFocus={() => setFocused("startDate")}
                  onBlur={() => {
                    setFocused(null);
                    if (startDate && startDate.length > 0 && startDate.length < 10) {
                      setDateError("Complete a data no formato dd/mm/aaaa");
                    }
                  }}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  className="w-full px-3 py-3 focus:outline-none bg-white"
                />
              </div>
              {dateError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {dateError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Data de vencimento
              </label>
              <div
                className={`relative flex items-center overflow-hidden rounded-lg border transition-all duration-200 bg-white ${
                  focused === "dueDate" ? "ring-2 ring-indigo-500/50 border-indigo-500" : "border-gray-200"
                } ${dateError ? "border-red-400 ring-red-200" : ""}`}
              >
                <div className="pl-3 text-gray-400">
                  <Calendar size={18} />
                </div>
                <input
                  id="dueDate"
                  type="text"
                  value={dueDate}
                  onChange={(e) => handleDateChange(e.target.value, setDueDate)}
                  onFocus={() => setFocused("dueDate")}
                  onBlur={() => {
                    setFocused(null);
                    if (dueDate && dueDate.length > 0 && dueDate.length < 10) {
                      setDateError("Complete a data no formato dd/mm/aaaa");
                    }
                  }}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  className="w-full px-3 py-3 focus:outline-none bg-white"
                />
              </div>
              {dateError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {dateError}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Prioridade
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["URGENTE", "ALTA", "MEDIA", "BAIXA"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    setPriority(level as TaskPriority);
                    setFormTouched(true);
                  }}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                    getPriorityColor(level as TaskPriority)
                  } ${priority === level ? "ring-2" : "opacity-75 hover:opacity-100"}`}
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex space-x-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveTask}
              className={`px-5 py-2 text-white rounded-lg transition-all duration-300 bg-gradient-to-r ${
                priority ? getPriorityGradient(priority) : "from-indigo-500 to-purple-500"
              } hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
              disabled={formTouched && (!title.trim() || !!dateError)}
            >
              Criar Tarefa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}