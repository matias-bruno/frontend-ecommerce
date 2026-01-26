/**
 * UI Module
 * Utilidades de interfaz de usuario
 */

/**
 * Crear HTML para tarjeta de producto
 * @param {Object} product - Datos del producto
 * @returns {string} HTML de la tarjeta del producto
 */
export function createProductCard(product) {
  const shortDescription = product.description.split(" ").slice(0, 5).join(" ") + "...";
  
  return `
    <div class="card">
      <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text short-description">${shortDescription}</p>
        <p class="card-text full-description" style="display: none;">${product.description}</p>
        <button class="btn btn-link" data-action="toggle-description">Ver descripción</button>
        <p class="card-text">$${product.price}</p>
        <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}" data-product-image="${product.imageUrl}" data-product-name="${product.name}" data-product-price="${product.price}">Agregar al carrito</button>
      </div>
    </div>
  `;
}

/**
 * Crear HTML para item del carrito
 * @param {Object} item - Datos del item del carrito
 * @returns {string} HTML del item del carrito
 */
export function createCartItem(item) {
  return `
    <li class="cart-item" data-item-id="${item.id}">
      <img src="${item.image}" alt="${item.title}">
      <div class="card-body">
        <h6 class="card-title">${item.title}</h6>
        <p class="card-text">Cantidad: <strong>${item.quantity}</strong></p>
        <p class="card-text">Precio unitario: ${item.price}</p>
        <p class="card-text">Subtotal: <strong>${(item.price * item.quantity).toFixed(2)}</strong></p>
        <button class="btn btn-sm btn-danger" data-action="remove-from-cart" data-item-id="${item.id}">
          Eliminar
        </button>
      </div>
    </li>
  `;
}

/**
 * Toggle entre descripción corta y completa
 * @param {HTMLElement} button - Botón que activa el toggle
 */
export function toggleDescription(button) {
  const shortDescription = button.previousElementSibling;
  const fullDescription = shortDescription.nextElementSibling;
  
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
 * Mostrar notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (info, success, warning, danger)
 */
export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
  notification.style.zIndex = '9999';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
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
}

export default {
  createProductCard,
  createCartItem,
  toggleDescription,
  showNotification,
  setupEventDelegation
};