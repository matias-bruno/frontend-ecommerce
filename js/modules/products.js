/**
 * Products Module
 * Gestión de productos, renderizado y paginación
 */

import { fetchProducts } from './api.js';

// Estado de paginación centralizado
let paginationState = {
  currentPage: 0,
  totalPages: 0,
  pageSize: 20
};

/**
 * Obtener estado actual de paginación
 * @returns {Object} Estado de paginación
 */
export function getPaginationState() {
  return { ...paginationState };
}

/**
 * Establecer estado de paginación
 * @param {Object} state - Nuevo estado de paginación
 */
function setPaginationState(state) {
  paginationState = { ...paginationState, ...state };
}

/**
 * Cargar productos desde la API
 * @param {number} page - Número de página a cargar
 * @param {number} size - Tamaño de página (opcional)
 * @param {string} search - Término de búsqueda opcional
 * @returns {Promise<Object>} Datos de productos paginados
 */
export function loadProducts(page, size, search = null) {
  return fetchProducts(page, size || paginationState.pageSize, search)
    .then((data) => {
      if (data && data.content) {
        setPaginationState({
          currentPage: data.number,
          totalPages: data.totalPages
        });
        renderProducts(data.content);
        updatePagination(data);
        
        // Desplazar suavemente al inicio de la lista de productos
        const productosContainer = document.getElementById("productos-container");
        if (productosContainer) {
          // Necesita que el elemento html tenga la propiedad scroll-padding-top en CSS seteada a un valor adecuado
          productosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        throw new Error("Formato inesperado de la API");
      }
    })
    .catch((error) => {
      console.error("Error al obtener productos", error);
      throw error;
    });
}

/**
 * Renderizar lista de productos en el DOM
 * @param {Array} data - Array de productos
 */
export function renderProducts(data) {
  const productosContainer = document.getElementById("productos-container");
  productosContainer.innerHTML = "";

  data.forEach((producto) => {
    const shortDescription = producto.description.split(" ").slice(0, 5).join(" ") + "...";

    productosContainer.innerHTML += `
      <div class="card">
        <img src="${producto.imageUrl}" class="card-img-top" alt="${producto.name}">
        <div class="card-body">
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text short-description">${shortDescription}</p>
          <p class="card-text full-description" style="display: none;">${producto.description}</p>
          <button class="btn btn-link" onclick="toggleDescription(this)">Ver descripción</button>
          <p class="card-text">$${producto.price}</p>
          <button class="btn btn-primary" onclick="addToCart(${producto.id}, '${producto.imageUrl}', '${producto.name}', ${producto.price}, this)">Agregar al carrito</button>
        </div>
      </div>
    `;
  });
}

/**
 * Actualizar controles de paginación
 * @param {Object} pageData - Datos de paginación de la API
 */
export function updatePagination(pageData) {
  const paginationContainer = document.getElementById("pagination-container");
  const paginationList = paginationContainer.querySelector("ul");

  // Limpiar números de página existentes (mantener prev/next)
  const pageItems = paginationList.querySelectorAll(".page-item:not(#prev-page):not(#next-page)");
  pageItems.forEach(item => item.remove());

  if (pageData.totalPages > 1) {
    paginationContainer.style.display = "block";
    paginationContainer.style.visibility = "visible";

    // Actualizar botones anterior/siguiente
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    prevButton.classList.toggle("disabled", pageData.first);
    nextButton.classList.toggle("disabled", pageData.last);

    // Generar números de página
    const maxVisiblePages = 5;
    let startPage = Math.max(0, pageData.number - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pageData.totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // Insertar números de página antes del botón siguiente
    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === pageData.number ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i + 1}</a>`;

      // Insertar antes del botón siguiente
      paginationList.insertBefore(li, nextButton);
    }

    // Agregar event listeners para números de página
    paginationList.querySelectorAll(".page-link[data-page]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        // Mantener el término de búsqueda actual al cambiar de página
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value : null;
        loadProducts(page, paginationState.pageSize, searchTerm);
      });
    });

    // Event listeners para anterior/siguiente
    prevButton.querySelector(".page-link").onclick = (e) => {
      e.preventDefault();
      if (!pageData.first) {
        // Mantener el término de búsqueda actual al cambiar de página
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value : null;
        loadProducts(pageData.number - 1, paginationState.pageSize, searchTerm);
      }
    };

    nextButton.querySelector(".page-link").onclick = (e) => {
      e.preventDefault();
      if (!pageData.last) {
        // Mantener el término de búsqueda actual al cambiar de página
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value : null;
        loadProducts(pageData.number + 1, paginationState.pageSize, searchTerm);
      }
    };
  } else {
    paginationContainer.style.display = "none";
    paginationContainer.style.visibility = "hidden";
  }
}

/**
 * Configurar tamaño de página por defecto
 * @param {number} size - Nuevo tamaño de página
 */
export function setPageSize(size) {
  setPaginationState({ pageSize: size });
}

export default {
  getPaginationState,
  loadProducts,
  renderProducts,
  updatePagination,
  setPageSize
};