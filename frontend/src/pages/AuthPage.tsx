import { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Micro Shop</h1>
          <p className="text-gray-500 mt-2 text-sm">
            E-Commerce on Kafka + Elasticsearch
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                  ${mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
