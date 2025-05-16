"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { toast } from "sonner";
import axios from "axios";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const router = useRouter();

  const validateLogin = () => {
    const fieldErrors: { [key: string]: string } = {};
    if (!loginEmail.includes("@")) fieldErrors.email = "O email não é válido";
    if (!loginEmail) fieldErrors.email = "O email é obrigatório";
    if (!loginPassword) fieldErrors.password = "A senha é obrigatória";
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const validateRegister = () => {
    const fieldErrors: { [key: string]: string } = {};
    if (!registerName) fieldErrors.name = "O nome é obrigatório";
    if (!registerEmail.includes("@")) fieldErrors.email = "O email não é válido";
    if (!registerEmail) fieldErrors.email = "O email é obrigatório";
    if (registerPassword.length < 6) fieldErrors.password = "A senha deve ter pelo menos 6 caracteres";
    if (!registerPassword) fieldErrors.password = "A senha é obrigatória";
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) {
      if (!loginEmail) toast.error("O campo de email é obrigatório.");
      if (!loginPassword) toast.error("O campo de senha é obrigatório.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email: loginEmail,
        password: loginPassword,
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
      });
      toast.success("Login realizado com sucesso!");
      router.push("/tasks");
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      toast.error("Erro ao realizar login. Tente novamente.");
    }
  };
  
  const handleRegister = async () => {
    if (!validateRegister()) {
      if (!registerName) toast.error("O campo de nome é obrigatório.");
      if (!registerEmail) toast.error("O campo de email é obrigatório.");
      if (!registerPassword) toast.error("O campo de senha é obrigatório.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/auth/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
  
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
  
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
    <AuroraBackground>
      <div className="flex items-center justify-center h-screen">
        <CardContainer>
          <CardBody className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-around mb-4">
              <CardItem
                as="button"
                translateZ={20}
                className={`px-4 py-2 ${
                  activeTab === "login" ? "font-bold border-b-2 border-blue-500" : ""
                }`}
                onClick={() => {
                  setActiveTab("login");
                  setErrors({});
                }}
              >
                Login
              </CardItem>
              <CardItem
                as="button"
                translateZ={20}
                className={`px-4 py-2 ${
                  activeTab === "register" ? "font-bold border-b-2 border-blue-500" : ""
                }`}
                onClick={() => {
                  setActiveTab("register");
                  setErrors({});
                }}
              >
                Cadastro
              </CardItem>
            </div>
  
            {activeTab === "login" && (
              <div>
                <h2 className="text-center text-xl font-bold mb-4">Login</h2>
                <div className="mb-4">
                  <label htmlFor="loginEmail" className="block mb-1">
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    className="w-full p-2 border rounded"
                    placeholder="Digite seu email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="loginPassword" className="block mb-1">
                    Senha
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="Digite sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <CardItem
                  as="button"
                  translateZ={20}
                  className="w-full bg-blue-500 text-white py-2 rounded"
                  onClick={handleLogin}
                >
                  Entrar
                </CardItem>
              </div>
            )}
  
            {activeTab === "register" && (
              <div>
                <h2 className="text-center text-xl font-bold mb-4">Cadastro</h2>
                <div className="mb-4">
                  <label htmlFor="registerName" className="block mb-1">
                    Nome
                  </label>
                  <input
                    id="registerName"
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Digite seu nome"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="registerEmail" className="block mb-1">
                    Email
                  </label>
                  <input
                    id="registerEmail"
                    type="email"
                    className="w-full p-2 border rounded"
                    placeholder="Digite seu email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="registerPassword" className="block mb-1">
                    Senha
                  </label>
                  <input
                    id="registerPassword"
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="Digite sua senha"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                <CardItem
                  as="button"
                  translateZ={20}
                  className="w-full bg-blue-500 text-white py-2 rounded"
                  onClick={handleRegister}
                >
                  Cadastrar
                </CardItem>
              </div>
            )}
          </CardBody>
        </CardContainer>
      </div>
    </AuroraBackground>
  )
}