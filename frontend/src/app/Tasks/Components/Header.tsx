import { Button } from "@/components/ui/button";
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
    <header className="mb-6 bg-background">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Painel de Tarefas</h1>
          <p className="text-sm text-muted-foreground">
            Organize suas tarefas com facilidade.
          </p>
        </div>
        <Button
          variant="default"
          className="bg-black text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>
    </header>
  );
}