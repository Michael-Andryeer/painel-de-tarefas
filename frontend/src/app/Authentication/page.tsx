"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { toast } from "sonner";
import axios from "axios";
import { AuthBackground } from "./components/AuthBackground";
import { AuthCard } from "./components/AuthCard";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const fieldErrors: { [key: string]: string } = {};
    if (!email.includes("@")) fieldErrors.email = "O email não é válido";
    if (!email) fieldErrors.email = "O email é obrigatório";
    if (!password) fieldErrors.password = "A senha é obrigatória";
    
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      if (!email) toast.error("O campo de email é obrigatório.");
      if (!password) toast.error("O campo de senha é obrigatório.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });
  
      const { access_token, message } = response.data; 
  
      if (!access_token) {
        toast.error("Erro ao realizar login. Token não recebido.");
        return;
      }
  
      if (message === "Usuario nao encontrado") {
        toast.error("Usuário não encontrado");
        return;
      }
  
      setCookie(undefined, "authFlowToken", access_token, {
        maxAge: 60 * 60 * 1, 
        path: "/",
      });
      toast.success("Login realizado com sucesso!");
      router.push("/Tasks");
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      toast.error("Erro ao realizar login. Tente novamente.");
    }
  };
  
  const handleRegister = async (name: string, email: string, password: string) => {
    const fieldErrors: { [key: string]: string } = {};
    if (!name) fieldErrors.name = "O nome é obrigatório";
    if (!email.includes("@")) fieldErrors.email = "O email não é válido";
    if (!email) fieldErrors.email = "O email é obrigatório";
    if (password.length < 6) fieldErrors.password = "A senha deve ter pelo menos 6 caracteres";
    if (!password) fieldErrors.password = "A senha é obrigatória";
    
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      if (!name) toast.error("O campo de nome é obrigatório.");
      if (!email) toast.error("O campo de email é obrigatório.");
      if (!password) toast.error("O campo de senha é obrigatório.");
      return;
    }
  
    try {
      await axios.post("http://localhost:8000/auth/register", {
        name,
        email,
        password,
      });
  
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      setActiveTab("login");
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 409) {
          toast.error("Este email já foi utilizado para cadastro.");
          return;
        }
  
        if (status === 400 && data?.errors) {
          const fieldErrors: { [key: string]: string } = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
  
          toast.error(data.errors[0]?.message || "Erro de validação.");
          return;
        }
        toast.error(data?.message || "Erro ao realizar cadastro. Tente novamente.");
      } else {
        console.error("Erro ao fazer cadastro: ", error);
        toast.error("Erro ao realizar cadastro. Verifique sua conexão e tente novamente.");
      }
    }
  };

  return (
    <AuthBackground>
      <div className="flex items-center justify-center min-h-screen p-4">
        <AuthCard 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setErrors({});
          }}
        >
          {activeTab === "login" ? (
            <LoginForm onSubmit={handleLogin} errors={errors} />
          ) : (
            <RegisterForm onSubmit={handleRegister} errors={errors} />
          )}
        </AuthCard>
      </div>
    </AuthBackground>
  );
}