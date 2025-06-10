import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SalaCard from "../../components/SalaCard";
import UserProfile from "./components/UserProfile";
import authService from "../../services/authService";
import roomService from "../../services/roomService";
import TextInputModal from "../../components/TextInputModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useToast } from "../../provider/ToastProvider";

const Dashboard = () => {
  const [tab, setTab] = useState<"misSalas" | "compartidas">("misSalas");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [myRooms, setMyRooms] = useState<any[]>([]);
  const [sharedRooms, setSharedRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInputModal, setShowInputModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState<string | null>(null);
  const { showToast } = useToast();

  const navigate = useNavigate();

  // Cargar información del usuario
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        showToast("No se pudo cargar la información del usuario", "error");
        setError("No se pudo cargar la información del usuario");
      }
    };

    loadUserData();
  }, []);

  // Cargar salas
  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      try {
        const rooms = await roomService.getRooms();

        // Separar salas propias y compartidas
        const userRooms = rooms.filter((room) =>
          typeof room.owner === "object"
            ? room.owner._id === user?.id
            : room.owner === user?.id
        );

        const shared = rooms.filter((room) => {
          // Verificar si el usuario está en la lista de colaboradores
          if (Array.isArray(room.collaborators)) {
            return room.collaborators.some((collab) => {
              if (typeof collab === "object") {
                return collab._id === user?.id;
              }
              return collab === user?.id;
            });
          }
          return false;
        });

        setMyRooms(userRooms);
        setSharedRooms(shared);
      } catch (err) {
        console.error("Error al cargar salas:", err);
        setError("No se pudieron cargar las salas");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadRooms();
    }
  }, [user]);

  const handleCreateRoom = async (roomName: string) => {
    // try {
    //   const roomName = prompt("Nombre de la nueva sala:");
    //   if (!roomName) return;

    //   const newRoom = await roomService.createRoom(roomName);
    //   setMyRooms([...myRooms, newRoom]);
    //   navigate(`/room/${newRoom._id}`);
    // } catch (err) {
    //   console.error("Error al crear sala:", err);
    //   alert("No se pudo crear la sala");
    // }
    try {
      const newRoom = await roomService.createRoom(roomName);
      setMyRooms([...myRooms, newRoom]);
      showToast("Sala creada!", "success");

      navigate(`/room/${newRoom._id}`);
    } catch (err) {
      console.error("Error al crear sala:", err);
      showToast("No se pudo crear la sala", "error");

      // alert("No se pudo crear la sala");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleDeleteRoom = async (roomId: string) => {
    // if (!confirm("¿Estás seguro de eliminar esta sala?")) return;

    // try {
    //   await roomService.deleteRoom(roomId);
    //   setMyRooms(myRooms.filter((room) => room._id !== roomId));
    // } catch (err) {
    //   console.error("Error al eliminar sala:", err);
    //   alert("No se pudo eliminar la sala");
    // }
    try {
      await roomService.deleteRoom(roomId);
      setMyRooms(myRooms.filter((r) => r._id !== roomId));
    } catch (err) {
      console.error("Error al eliminar sala:", err);
      showToast("No se pudo eliminar la sala", "error");

      // alert("No se pudo eliminar la sala");
    }
  };

  // const handleEditRoom = async (roomId: string) => {
  //   const room = myRooms.find((r) => r._id === roomId);
  //   if (!room) return;

  //   const newName = prompt("Nuevo nombre para la sala:", room.name);
  //   if (!newName || newName === room.name) return;

  //   try {
  //     const updatedRoom = await roomService.updateRoom(roomId, {
  //       name: newName,
  //     });
  //     setMyRooms(myRooms.map((r) => (r._id === roomId ? updatedRoom : r)));
  //   } catch (err) {
  //     console.error("Error al actualizar sala:", err);
  //     alert("No se pudo actualizar la sala");
  //   }
  // };
  const handleEditRoom = async (roomId: string, newName: string) => {
    const room = myRooms.find((r) => r._id === roomId);
    if (!room || newName.trim() === "" || newName === room.name) return;

    try {
      const updatedRoom = await roomService.updateRoom(roomId, {
        name: newName,
      });
      setMyRooms(myRooms.map((r) => (r._id === roomId ? updatedRoom : r)));
    } catch (err) {
      console.error("Error al actualizar sala:", err);
      alert("No se pudo actualizar la sala");
    }
  };

  // Selecciona las salas a mostrar según la pestaña
  const roomsToShow = tab === "misSalas" ? myRooms : sharedRooms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col">
      {/* Navbar */}
      <Navbar href="/">
        {user && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            <UserCircleIcon className="h-7 w-7 text-indigo-500" />
            <div className="flex flex-col">
              <span className="font-semibold text-indigo-700">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        )}
        <button
          className="flex items-center gap-1 px-4 py-1 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
          onClick={handleLogout}
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          Cerrar sesión
        </button>
      </Navbar>

      {/* Contenido principal */}
      <div className="max-w-6xl w-full mx-auto mt-8 px-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Botón crear sala */}
        <div className="mb-6 flex justify-start">
          <PrimaryButton
            className="flex items-center gap-2 text-lg py-3 px-6"
            // onClick={handleCreateRoom}
            onClick={() => setShowInputModal(true)}
          >
            + Sala nueva
          </PrimaryButton>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            className={`pb-2 px-2 font-semibold transition ${
              tab === "misSalas"
                ? "border-b-2 border-indigo-600 text-indigo-700"
                : "text-gray-500 hover:text-indigo-600"
            }`}
            onClick={() => setTab("misSalas")}
          >
            Mis salas
          </button>
          <button
            className={`pb-2 px-2 font-semibold transition ${
              tab === "compartidas"
                ? "border-b-2 border-indigo-600 text-indigo-700"
                : "text-gray-500 hover:text-indigo-600"
            }`}
            onClick={() => setTab("compartidas")}
          >
            Compartidas conmigo
          </button>
        </div>

        {/* Boards Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando salas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {roomsToShow.length > 0 ? (
              roomsToShow.map((room) => (
                <SalaCard
                  key={room._id}
                  name={room.name}
                  createdAt={new Date(room.createdAt).toLocaleDateString()}
                  // onEdit={() => tab === "misSalas" && handleEditRoom(room._id)}
                  onEdit={(newName) => handleEditRoom(room._id, newName)}
                  // onDelete={() =>
                  //   tab === "misSalas" && handleDeleteRoom(room._id)
                  // }
                  onDelete={() => {
                    setRoomIdToDelete(room._id);
                    setShowConfirmModal(true);
                  }}
                  onClick={() => navigate(`/room/${room._id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                No hay salas para mostrar.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de perfil */}
      {showProfile && user && (
        <UserProfile
          name={user.name}
          email={user.email}
          onEdit={() => {
            setShowProfile(false);
            navigate("/profile/edit");
          }}
          onDelete={() => {
            if (
              confirm(
                "¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer."
              )
            ) {
              const password = prompt("Ingresa tu contraseña para confirmar:");
              if (password) {
                authService
                  .deleteAccount(password)
                  .then(() => {
                    navigate("/login");
                  })
                  .catch((err) => {
                    console.error("Error al eliminar cuenta:", err);
                    alert("No se pudo eliminar la cuenta");
                  });
              }
            }
          }}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showInputModal && (
        <TextInputModal
          title="Nueva sala"
          message="Introduce el nombre para la nueva sala."
          placeholder="Ej. Sala Creativa"
          onConfirm={(name) => {
            setShowInputModal(false);
            handleCreateRoom(name);
          }}
          onCancel={() => setShowInputModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="¿Eliminar esta sala?"
          message="Esta acción no se puede deshacer. ¿Estás seguro?"
          onConfirm={() => {
            if (roomIdToDelete) {
              handleDeleteRoom(roomIdToDelete);
              setRoomIdToDelete(null);
              setShowConfirmModal(false);
            }
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setRoomIdToDelete(null);
          }}
        />
      )}

      <Outlet />
    </div>
  );
};

export default Dashboard;
