import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import authService from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-xl rounded-3xl p-8 max-w-sm w-full flex flex-col gap-4"
      >
        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-4 hover:opacity-80 transition"
        >
          <Bars3Icon className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-indigo-700">
            Flutter UI Designer
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
          Iniciar sesión
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <input
          type="email"
          placeholder="Correo electrónico"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Iniciar sesión"}
        </PrimaryButton>

        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
