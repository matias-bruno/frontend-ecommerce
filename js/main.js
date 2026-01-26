/**
 * Main Application Entry Point
 * Coordinador de todos los módulos - Orquestador Principal
 */

// Importar todos los módulos especializados
import { checkAuthStatus, login, logout, setupLoginFormListener } from './modules/auth.js';
import { addToCart, removeFromCart, updateCartUI, clearCart, setupCartEventListeners } from './modules/cart.js';
import { loadProducts } from './modules/products.js';
import { toggleDescription, setupEventDelegation } from './modules/ui.js';

/**
 * Estado global de la aplicación
 */
const AppState = {
  initialized: false,
  modules: {
    auth: false,
    cart: false,
    products: false,
    ui: false
  }
};

/**
 * Inicializar todos los módulos de la aplicación
 */
async function initializeApp() {
  try {
    console.log('🚀 Inicializando aplicación modular...');
    
    // 1. Inicializar módulo de autenticación
    checkAuthStatus();
    setupLoginFormListener();
    AppState.modules.auth = true;
    
    // 2. Cargar productos iniciales
    await loadProducts(0);
    AppState.modules.products = true;
    
    // 3. Inicializar carrito
    updateCartUI();
    setupCartEventListeners();
    AppState.modules.cart = true;
    
    // 4. Configurar utilidades de UI
    setupEventDelegation();
    AppState.modules.ui = true;
    
    // 5. Hacer funciones disponibles globalmente para compatibilidad con HTML inline
    setupGlobalFunctions();
    
    // 6. Marcar aplicación como inicializada
    AppState.initialized = true;
    
    console.log('✅ Aplicación inicializada exitosamente:', AppState);
    
    // Disparar evento de aplicación lista
    document.dispatchEvent(new CustomEvent('app:initialized'));
    
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    
    // Mostrar error crítico al usuario
    showCriticalError(error);
  }
}

/**
 * Configurar funciones globales para compatibilidad con onclick="..." en HTML
 */
function setupGlobalFunctions() {
  // Autenticación
  window.login = login;
  window.logout = logout;
  
  // Carrito
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  
  // UI
  window.toggleDescription = toggleDescription;
  
  // Utilidades adicionales
  window.updateCartUI = updateCartUI;
  window.clearCart = clearCart;
  window.loadProducts = loadProducts;
}

/**
 * Mostrar error crítico al usuario
 * @param {Error} error - Error ocurrido
 */
function showCriticalError(error) {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'alert alert-danger position-fixed top-50 start-50 translate-middle';
  errorContainer.style.zIndex = '9999';
  errorContainer.style.minWidth = '300px';
  errorContainer.innerHTML = `
    <h5 class="alert-heading">❌ Error Crítico</h5>
    <p>No se pudo inicializar la aplicación correctamente.</p>
    <hr>
    <small class="text-muted">Error: ${error.message}</small>
    <button class="btn btn-outline-danger btn-sm mt-2" onclick="location.reload()">
      Recargar Página
    </button>
  `;
  
  document.body.appendChild(errorContainer);
}

/**
 * Manejar errores no capturados globalmente
 */
function setupGlobalErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Error global no capturado:', event.error);
    
    // En producción, podríamos enviar esto a un servicio de logging
    if (AppState.initialized) {
      // Solo mostrar errores críticos si la app ya estaba inicializada
      console.warn('Error después de inicialización:', event.error);
    }
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
    event.preventDefault();
  });
}

/**
 * Configurar service worker para PWA (opcional, para futuro)
 */
function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Aquí podríamos registrar un service worker en el futuro
    console.log('Service Worker soportado pero no configurado');
  }
}

/**
 * Entry point principal de la aplicación
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log('📱 DOM cargado, iniciando orquestador...');
  
  // Configurar manejo global de errores
  setupGlobalErrorHandling();
  
  // Inicializar aplicación
  initializeApp();
  
  // Configurar service worker (opcional)
  setupServiceWorker();
});

// Exportar utilidades para debugging
export {
  AppState,
  initializeApp,
  setupGlobalFunctions
};

// Exportar funciones principales para acceso programático
export {
  checkAuthStatus,
  login,
  logout,
  addToCart,
  removeFromCart,
  updateCartUI,
  loadProducts,
  toggleDescription
};

console.log('🎯 Main.js orquestador cargado');