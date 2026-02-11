/**
 * UI Module
 * Utilidades de interfaz de usuario
 */

/**
 * Toggle entre descripción corta y completa
 * @param {HTMLElement} button - Botón que activa el toggle
 */
export function toggleDescription(button) {
  const cardBody = button.parentElement;
  const shortDescription = cardBody.querySelector('.short-description');
  const fullDescription = cardBody.querySelector('.full-description');
  
  if (!shortDescription || !fullDescription) return;
  
  if (fullDescription.style.display === "none") {
    fullDescription.style.display = "block";
    shortDescription.style.display = "none";
    button.textContent = "Ocultar descripción";
  } else {
    fullDescription.style.display = "none";
    shortDescription.style.display = "block";
    button.textContent = "Ver descripción";
  }
}

/**
 * Toggle del carrito sidebar
 */
export function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const mainContent = document.querySelector('.main-content');
  const isHidden = cartSidebar.classList.contains('hidden');
  const isMobile = window.innerWidth <= 768;
  
  if (isHidden) {
    cartSidebar.classList.remove('hidden');
    cartSidebar.classList.add('active');
    
    if (isMobile) {
      cartOverlay.classList.add('active');
    } else {
      if (mainContent) {
        mainContent.style.marginRight = '350px';
      }
    }
  } else {
    cartSidebar.classList.add('hidden');
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    
    if (!isMobile && mainContent) {
      mainContent.style.marginRight = '0';
    }
  }
}

/**
 * Cerrar el carrito
 */
export function closeCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const mainContent = document.querySelector('.main-content');
  const isMobile = window.innerWidth <= 768;
  
  cartSidebar.classList.add('hidden');
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
  
  if (!isMobile && mainContent) {
    mainContent.style.marginRight = '0';
  }
}

/**
 * Configurar event delegation para acciones dinámicas
 */
export function setupEventDelegation() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    
    switch (action) {
      case 'toggle-description':
        toggleDescription(button);
        break;
      case 'add-to-cart':
        // Implementar addToCart con data attributes
        break;
      case 'remove-from-cart':
        // Implementar removeFromCart con data attributes
        break;
    }
  });

  // Event listeners para el carrito
  document.getElementById('open-cart').addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart();
  });

  // Cerrar carrito con el botón X (solo visible en móvil)
  const closeCartBtn = document.getElementById('close-cart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  // Cerrar carrito haciendo click en el overlay
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // Detectar el tamaño de pantalla para ajustar el comportamiento del carrito
  function adjustCartForScreenSize() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const mainContent = document.querySelector('.main-content');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // En móvil, el carrito siempre debe estar oculto y sin margen
      cartSidebar.classList.add('hidden');
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
      if (mainContent) {
        mainContent.style.marginRight = '0';
      }
    } else {
      // En desktop, el overlay nunca debe estar activo
      cartOverlay.classList.remove('active');
      
      // Si el carrito estaba activo (abierto por el usuario), mantenerlo visible
      if (cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('hidden');
        if (mainContent) {
          mainContent.style.marginRight = '350px';
        }
      } else {
        // Si estaba oculto por el usuario, mantenerlo oculto pero restaurar el contenido principal
        cartSidebar.classList.add('hidden');
        if (mainContent) {
          mainContent.style.marginRight = '0';
        }
      }
    }
  }

  // Ajustar al cargar y al redimensionar
  // Usar un pequeño timeout para asegurar que el DOM esté completamente cargado
  setTimeout(() => {
    adjustCartForScreenSize();
    // En desktop, mostrar el carrito por defecto una vez
    if (window.innerWidth > 768) {
      const cartSidebar = document.getElementById('cart-sidebar');
      const mainContent = document.querySelector('.main-content');
      cartSidebar.classList.remove('hidden');
      cartSidebar.classList.remove('active');
      if (mainContent) {
        mainContent.style.marginRight = '350px';
      }
    }
  }, 100);
  window.addEventListener('resize', adjustCartForScreenSize);
}

export default {
  toggleDescription,
  toggleCart,
  closeCart,
  setupEventDelegation
};