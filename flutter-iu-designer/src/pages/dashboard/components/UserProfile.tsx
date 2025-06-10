import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PrimaryButton from "../../../components/PrimaryButton";
import authService from "../../../services/authService";

interface UserProfileProps {
  name: string;
  email: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  editMode?: boolean;
}

const UserProfile = ({ name, email, onEdit, onDelete, onClose, editMode = false }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(editMode);
  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveChanges = async () => {
    setError("");
    setSuccessMessage("");
    
    // Validaciones básicas
    if (!userName.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    
    if (!userEmail.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setError("El formato del correo electrónico no es válido");
      return;
    }
    
    // Validar contraseñas si se están cambiando
    if (newPassword) {
      if (!currentPassword) {
        setError("Debes ingresar tu contraseña actual para cambiarla");
        return;
      }
      
      if (newPassword.length < 6) {
        setError("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const updateData: any = {
        name: userName,
        email: userEmail
      };
      
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.password = newPassword;
      }
      
      await authService.updateUserProfile(updateData);
      setSuccessMessage("Perfil actualizado correctamente");
      
      // Limpiar campos de contraseña
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Si no estamos en modo edición, volvemos a la vista normal
      if (!editMode) {
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          {isEditing ? "Editar perfil" : "Perfil de usuario"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">
            {successMessage}
          </div>
        )}

        {isEditing ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Cambiar contraseña</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoComplete="current-password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoComplete="new-password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {!editMode && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
              <PrimaryButton onClick={handleSaveChanges} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </PrimaryButton>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium">{name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Correo electrónico</p>
              <p className="font-medium">{email}</p>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-indigo-100 rounded-md text-indigo-700 hover:bg-indigo-200 transition"
              >
                Editar perfil
              </button>
              
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-100 rounded-md text-red-700 hover:bg-red-200 transition"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
