/**
 * API Module - Servicio centralizado para comunicaciones con backend
 * Responsabilidades:
 * - Gestión de headers de autenticación
 * - Fetch requests centralizadas
 * - Manejo de errores consistente
 */

// URL base de la API
const API_URL = "http://localhost:8080/api";

/**
 * Obtener token de autenticación desde localStorage
 * @returns {string|null} Token JWT o null si no existe
 */
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Generar headers para peticiones API con autenticación
 * @returns {Object} Headers configurados para fetch
 */
export function getAuthHeaders() {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Fetch de productos con paginación
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<Object>} Datos de productos paginados
 */
export async function fetchProducts(page = 0, size = 20) {
  try {
    const response = await fetch(`${API_URL}/products?page=${page}&size=${size}`, {
      headers: getAuthHeaders()
    });

    if (!response || !response.ok) {
      throw new Error("API no disponible");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

/**
 * Crear nuevo pedido
 * @param {Array} orderItems - Items del pedido
 * @returns {Promise<Object>} Confirmación del pedido
 */
export async function createOrder(orderItems) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderItems }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
}

/**
 * Login de usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Datos de autenticación
 */
export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error de autenticación");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}

export default {
  API_URL,
  getAuthToken,
  getAuthHeaders,
  fetchProducts,
  createOrder,
  loginUser
};