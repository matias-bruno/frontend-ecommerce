

document.addEventListener("DOMContentLoaded", () => {

  // Importar funciones del módulo API
  import { 
    getAuthToken, 
    getAuthHeaders, 
    fetchProducts, 
    createOrder, 
    loginUser 
  } from './modules/api.js';

  // Importar funciones del módulo de autenticación
  import { 
    checkAuthStatus, 
    login, 
    logout,
    setupLoginFormListener
  } from './modules/auth.js';

  // Importar funciones del módulo de carrito
  import { 
    addToCart, 
    removeFromCart, 
    updateCartUI, 
    clearCart,
    setupCartEventListeners
  } from './modules/cart.js';

  // Importar funciones del módulo de productos
  import { 
    loadProducts 
  } from './modules/products.js';

  // Importar funciones del módulo UI
  import { 
    toggleDescription 
  } from './modules/ui.js';

  // Revisar estado de autenticación al cargar la página
  checkAuthStatus();

  // Cargar primera página de productos
  loadProducts(0);

  // Inicializar carrito
  updateCartUI();



  // Configurar event listeners
  setupLoginFormListener();
  setupCartEventListeners();

  // Hacer funciones globales para compatibilidad temporal (hasta que main.js esté activo)
  window.login = login;
  window.logout = logout;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.toggleDescription = toggleDescription;
});
