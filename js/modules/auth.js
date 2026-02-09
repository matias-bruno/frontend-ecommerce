/**
 * Authentication Module
 * Gestión de login/logout y estado de autenticación
 */

import { loginUser } from './api.js';

/**
 * Verificar si el token JWT ha expirado
 * @param {string} token - Token JWT a verificar
 * @returns {boolean} true si el token es válido, false si ha expirado o es inválido
 */
function isTokenValid(token) {
  if (!token) return false;
  
  try {
    // Decodificar el payload del token JWT (sin verificar la firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Verificar si el token ha expirado
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return false;
  }
}

/**
 * Limpiar datos de autenticación expirados
 */
function clearExpiredAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('Token expirado, sesión cerrada automáticamente');
}

/**
 * Revisar estado de autenticación y actualizar UI
 */
export function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (token && user && isTokenValid(token)) {
    // User is logged in with valid token
    document.getElementById('login-nav-item').style.display = 'none';
    document.getElementById('profile-nav-item').style.display = 'block';
  } else {
    // Token doesn't exist, user doesn't exist, or token has expired
    if (token && !isTokenValid(token)) {
      clearExpiredAuth();
    }
    
    // User is not logged in
    document.getElementById('login-nav-item').style.display = 'block';
    document.getElementById('profile-nav-item').style.display = 'none';
  }
}

/**
 * Login de usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Datos de autenticación
 */
export async function login(username, password) {
  try {
    const authData = await loginUser(username, password);

    // Store token and user info
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));

    // Update UI
    checkAuthStatus();

    // Close login modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();

    // Clear form
    document.getElementById('loginForm').reset();

    console.log("Login successful:", authData);
    
    return authData;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error al iniciar sesión: " + error.message);
    throw error;
  }
}

/**
 * Logout de usuario
 */
export function logout() {
  // Remove token and user info
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  // Update UI
  checkAuthStatus();

  console.log("Logout successful");
}

/**
 * Configurar event listener del formulario de login
 */
export function setupLoginFormListener() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    await login(username, password);
  });
}

export default {
  checkAuthStatus,
  login,
  logout,
  setupLoginFormListener
};