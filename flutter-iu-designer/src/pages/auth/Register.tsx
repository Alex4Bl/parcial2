import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import authService from "../../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    // Validar que el nombre no esté vacío
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    
    // Validar formato de email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El formato del correo electrónico no es válido");
      return false;
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      // Enviar datos al backend para registro
      const response = await authService.register({ name, email, password });
      console.log("Usuario registrado exitosamente:", response);
      
      // Iniciar sesión automáticamente después del registro
      await authService.login({ email, password });
      
      // Redireccionar al dashboard
      navigate("/dashboard");
    } catch (err: any) {
      // Manejar diferentes tipos de errores del backend
      if (err.response?.status === 409) {
        setError("Este correo electrónico ya está registrado");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Datos de registro inválidos");
      } else {
        setError(err.response?.data?.message || "Error al registrar usuario");
      }
      console.error("Error en registro:", err);
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
          Crear Cuenta
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Nombre completo"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          required
        />
        {/* <button
          type="submit"
          className="w-full py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
        >
          Registrarse
        </button> */}
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Registrarse"}
        </PrimaryButton>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
