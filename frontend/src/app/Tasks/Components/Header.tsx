import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push("/Authentication");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Painel de Tarefas
              </h1>
              <p className="text-sm text-gray-500">
                Organize suas tarefas com facilidade
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 transition-colors duration-200"
            >
            </Button>

            <div className="h-6 w-px bg-gray-200" />

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}