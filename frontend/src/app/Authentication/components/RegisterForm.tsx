"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { FormInput } from "./FormInput";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  errors: { [key: string]: string };
}

export function RegisterForm({ onSubmit, errors }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Criar nova conta
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Preencha os dados abaixo para se cadastrar
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="registerName"
          type="text"
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo"
          error={errors.name}
          icon={<User className="h-4 w-4 text-gray-500" />}
        />

        <FormInput
          id="registerEmail"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.email@exemplo.com"
          error={errors.email}
          icon={<Mail className="h-4 w-4 text-gray-500" />}
        />

        <FormInput
          id="registerPassword"
          type={showPassword ? "text" : "password"}
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.password}
          icon={<Lock className="h-4 w-4 text-gray-500" />}
          endIcon={
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          }
        />

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Cadastrar
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}