"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ListFilter, AlertCircle, CheckCircle2, CircleDot } from "lucide-react";
import { Task } from "../types"; 

interface FilterSessionProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  statusFilter: "todas" | "concluídas" | "pendentes";
  setStatusFilter: (value: "todas" | "concluídas" | "pendentes") => void;
  priorityFilter: "todas" | "baixa" | "media" | "alta" | "urgente";
  setPriorityFilter: (value: "todas" | "baixa" | "media" | "alta" | "urgente") => void;
}

export default function FilterSession({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: FilterSessionProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendentes":
        return <CircleDot className="mr-2 h-4 w-4 text-yellow-500" />;
      case "concluídas":
        return <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />;
      default:
        return <ListFilter className="mr-2 h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgente":
        return <AlertCircle className="mr-2 h-4 w-4 text-red-500" />;
      case "alta":
        return <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />;
      case "média":
        return <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />;
      case "baixa":
        return <AlertCircle className="mr-2 h-4 w-4 text-green-500" />;
      default:
        return <Filter className="mr-2 h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    const styles = {
      urgente: "text-red-700 bg-red-50 hover:bg-red-100",
      alta: "text-orange-700 bg-orange-50 hover:bg-orange-100",
      média: "text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
      baixa: "text-green-700 bg-green-50 hover:bg-green-100",
      todas: "text-gray-700 bg-gray-50 hover:bg-gray-100"
    };
    return styles[priority as keyof typeof styles] || styles.todas;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="min-w-[120px] bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              {getStatusIcon(statusFilter)}
              <span className="capitalize">
                {statusFilter === "todas" ? "Status" : statusFilter}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] p-2 bg-white shadow-lg border border-gray-100 rounded-lg">
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(value: string) =>
                setStatusFilter(value as "todas" | "concluídas" | "pendentes")
              }
            >
              <DropdownMenuRadioItem 
                value="todas"
                className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <ListFilter className="mr-2 h-4 w-4 text-gray-500" />
                Todas
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem 
                value="pendentes"
                className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <CircleDot className="mr-2 h-4 w-4 text-yellow-500" />
                Pendentes
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem 
                value="concluídas"
                className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Concluídas
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="min-w-[120px] bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              {getPriorityIcon(priorityFilter)}
              <span className="capitalize">
                {priorityFilter === "todas" ? "Prioridade" : priorityFilter}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] p-2 bg-white shadow-lg border border-gray-100 rounded-lg">
            <DropdownMenuRadioGroup
              value={priorityFilter}
              onValueChange={(value: string) =>
                setPriorityFilter(value as "todas" | "baixa" | "media" | "alta" | "urgente")
              }
            >
              {["todas", "urgente", "alta", "media", "baixa"].map((priority) => (
                <DropdownMenuRadioItem
                  key={priority}
                  value={priority}
                  className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${getPriorityStyle(priority)}`}
                >
                  {getPriorityIcon(priority)}
                  <span className="capitalize">{priority}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}