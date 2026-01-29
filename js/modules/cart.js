/**
 * Cart Module
 * Gestión completa del carrito de compras
 */

import { createOrder } from './api.js';

/**
 * Cart Service - Centraliza operaciones de localStorage
 */
class CartService {
  static getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  static setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static clearCart() {
    localStorage.removeItem("cart");
  }

  static getTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  static getItemCount(cart) {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

/**
 * Agregar producto al carrito
 * @param {number} id - ID del producto
 * @param {string} image - URL de la imagen
 * @param {string} title - Título del producto
 * @param {number} price - Precio del producto
 * @param {HTMLElement} button - Botón que disparó la acción
 */
export function addToCart(id, image, title, price, button) {
  const cart = CartService.getCart();
  const existingProduct = cart.find((product) => product.id === id);
  
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id, image, title, price, quantity: 1 });
  }
  
  CartService.setCart(cart);
  updateCartUI();

  // Cambiar el texto del botón temporalmente
  button.textContent = "Agregado";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = "Agregar al carrito";
    button.disabled = false;
  }, 1000);
}

/**
 * Eliminar producto del carrito
 * @param {number} id - ID del producto a eliminar
 */
export function removeFromCart(id) {
  const cart = CartService.getCart();
  const filteredCart = cart.filter((item) => item.id !== id);
  CartService.setCart(filteredCart);
  updateCartUI();
}

/**
 * Actualizar la UI del carrito
 */
export function updateCartUI() {
  const cart = CartService.getCart();
  const carritoItems = document.getElementById("carrito-items");
  carritoItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    carritoItems.innerHTML = '<li class="text-center text-muted w-100">Tu carrito está vacío</li>';
    document.getElementById("realizar-compra").disabled = true;
  } else {
    document.getElementById("realizar-compra").disabled = false;

    cart.forEach((item) => {
      const cartItemHTML = `
        <li class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="card-body">
            <h6 class="card-title">${item.title}</h6>
            <p class="card-text">Cantidad: <strong>${item.quantity}</strong></p>
            <p class="card-text">Precio unitario: ${item.price}</p>
            <p class="card-text">Subtotal: <strong>${(item.price * item.quantity).toFixed(2)}</strong></p>
            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
              Eliminar
            </button>
          </div>
        </li>
      `;
      carritoItems.innerHTML += cartItemHTML;
      total += item.price * item.quantity;
    });
  }

  document.getElementById("carrito-total").textContent = total.toFixed(2);
  document.getElementById("cart-counter").textContent = CartService.getItemCount(cart);
  document.getElementById("cart-counter-nav").textContent = CartService.getItemCount(cart);
}

/**
 * Vaciar el carrito completamente
 */
export function clearCart() {
  CartService.clearCart();
  updateCartUI();
}

/**
 * Configurar event listeners del carrito
 */
export function setupCartEventListeners() {
  // Event listener para vaciar carrito
  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    clearCart();
  });

  // Event listener para realizar compra
  document.getElementById("realizar-compra").addEventListener("click", async () => {
    await handleCheckout();
  });
}

/**
 * Manejar el proceso de checkout
 */
async function handleCheckout() {
  const cart = CartService.getCart();
  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const orderItems = cart.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));

  try {
    const orderConfirmation = await createOrder(orderItems);
    console.log("Pedido realizado con éxito:", orderConfirmation);

    const total = CartService.getTotal(cart);
    document.getElementById("modal-total").textContent = total.toFixed(2);

    // Mostrar el modal de confirmación
    const modal = new bootstrap.Modal(
      document.getElementById("compraExitosaModal")
    );
    modal.show();

    // Limpiar el carrito después de la compra
    CartService.clearCart();
    updateCartUI();

  } catch (error) {
    console.error("Error al realizar la compra:", error);
    alert("Error al realizar la compra: " + error.message);
  }
}

export default {
  addToCart,
  removeFromCart,
  updateCartUI,
  clearCart,
  setupCartEventListeners,
  CartService
};