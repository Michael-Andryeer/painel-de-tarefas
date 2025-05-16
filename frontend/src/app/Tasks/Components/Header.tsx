interface HeaderProps {
  userName: string
}
export default function Header({ userName }: HeaderProps) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-neutral-800 mb-2">
        Painel de Tarefas
      </h1>
      <p className="text-muted-foreground">Olá {userName}! Organize suas tarefas de forma eficiente</p>
    </header>
  )
}