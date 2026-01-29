/**
 * Authentication Module
 * Gestión de login/logout y estado de autenticación
 */

import { loginUser } from './api.js';

/**
 * Revisar estado de autenticación y actualizar UI
 */
export function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (token && user) {
    // User is logged in
    document.getElementById('login-nav-item').style.display = 'none';
    document.getElementById('profile-nav-item').style.display = 'block';
  } else {
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