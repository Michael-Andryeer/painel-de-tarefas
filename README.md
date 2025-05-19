# Task Manager Fullstack App

Aplicação fullstack com funcionalidades de login, cadastro e gerenciamento de tarefas com prioridade, status e datas. O backend foi desenvolvido com **NestJS** e TypeScript, e o frontend com **Next.js**, **TailwindCSS** e componentes do **shadcn/ui** e **aceternity**.

---

## Tecnologias utilizadas

### Backend

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT
* Docker

### Frontend

* Next.js
* TailwindCSS
* Shadcn/ui
* Aceternity

---

## Como rodar o projeto

### Pré-requisitos

* Docker e Docker Compose instalados
* Node.js (versão recomendada: 18+)
* Yarn ou NPM

---

### Variáveis de ambiente

Crie um arquivo `.env` na raiz da pasta `backend` com o seguinte conteúdo:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/mydb
JWT_SECRET=your_jwt_secret
PORT=8000
BACKEND_URL=http://localhost:8000
```

---

### Subindo o banco de dados

A aplicação usa Docker com PostgreSQL. Para subir o banco:

```bash
cd backend
docker-compose up -d
```

O banco estará disponível na porta `5433`.

---

### Rodando o Backend

Na pasta `backend`, execute os seguintes comandos:

```bash
# Instale as dependências
npm install
# ou
yarn install

# Gere os arquivos do Prisma
npx prisma generate

# Rode as migrations do banco
npx prisma migrate dev

# Inicie o servidor em modo desenvolvimento
npm run start:dev
```

> Em caso de erros ao instalar pacotes, tente usar `--force` ou `--legacy-peer-deps`.

O backend rodará na porta `8000`.

---

### Rodando o Frontend

Na pasta `frontend`, execute:

```bash
# Instale as dependências
npm install
# ou
yarn install

# Rode o projeto
npm run dev
```

O frontend estará acessível em `http://localhost:3000`.

---

## Funcionalidades

* Cadastro e login com autenticação via JWT
* Login com conta Google (OAuth)
* CRUD completo de tarefas
* Filtros por status e prioridade
* Interface responsiva e moderna

---

## Testando as rotas da API

### Cadastro de usuário

`POST http://localhost:8000/auth/register`

```json
{
  "email": "usuario@teste.com",
  "name": "Usuario Teste",
  "password": "senha123"
}
```

### Login de usuário

`POST http://localhost:8000/auth/login`

```json
{
  "email": "usuario@teste.com",
  "password": "senha123"
}
```

---

### Criar tarefa (autenticado)

`POST http://localhost:8000/tasks`

```json
{
  "title": "Minha",
  "description": "Descrição da tarefa",
  "status": "PENDENTE",
  "priority": "URGENTE",
  "dueDate": "2025-05-20T23:59:59.000Z",
  "startDate": "2025-05-15T08:00:00.000Z",
  "endDate": "2025-05-15T18:00:00.000Z"
}
```

### Atualizar tarefa

`PUT http://localhost:8000/tasks/{{taskId}}`

```json
{
  "title": "Minha tarefa atualizada",
  "description": "Descrição da tarefa",
  "status": "PENDENTE",
  "priority": "BAIXA",
  "createdAt": "2025-05-15T19:01:19.699Z",
  "updatedAt": "2025-05-15T19:01:19.699Z",
  "dueDate": "2025-05-20T23:59:59.000Z",
  "startDate": "2025-05-15T08:00:00.000Z",
  "endDate": "2025-05-15T18:00:00.000Z"
}
```

### Deletar tarefa

`DELETE http://localhost:8000/tasks/{{taskId}}`

### Listar tarefas do usuário

`GET http://localhost:8000/tasks`

> Todas as rotas relacionadas a tarefas exigem autenticação via **Bearer Token** no header da requisição.

---
