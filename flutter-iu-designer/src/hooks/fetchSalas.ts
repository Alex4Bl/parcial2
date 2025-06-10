export async function fetchSalas() {
  // return fetch(`${import.meta.env.VITE_API_URL}/salas`).then(res => res.json());
  return [
    { id: 1, nombre: "Sala Principal", fecha: "2025-05-20" },
    { id: 2, nombre: "Diseño App Móvil", fecha: "2025-05-18" },
  ];
}