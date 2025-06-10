import { Bars3Icon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import PrimaryLink from "../components/PrimaryLink ";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col">
      {/* Navbar */}

      <Navbar>
        <a
          href="/login"
          className="px-4 py-1 rounded-full text-indigo-600 font-semibold hover:bg-indigo-50 transition"
        >
          Login
        </a>
        <PrimaryLink to="/register">Register</PrimaryLink>
      </Navbar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white/80 shadow-xl rounded-3xl p-8 max-w-md w-full flex flex-col items-center">
          <Bars3Icon className="h-12 w-12 text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
            Flutter UI Designer
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Diseña interfaces atractivas para tus apps Flutter de manera visual,
            rápida y sencilla.
          </p>
          <PrimaryLink to="/login" className="px-6 py-2">
            Comenzar ahora
          </PrimaryLink>
        </div>
        <footer className="mt-8 text-gray-400 text-sm">
          © 2025 Flutter UI Designer. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Home;
