

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

  // Revisar estado de autenticación al cargar la página
  checkAuthStatus();

  // Variables globales para paginación
  let currentPage = 0;
  let totalPages = 0;
  let pageSize = 20;

  // Cargar primera página de productos
  loadProducts(currentPage);

  // Inicializar carrito
  updateCartUI();

  function loadProducts(page, size) {
    fetchProducts(page, size || pageSize)
      .then((data) => {
        if (data && data.content) {
          currentPage = data.number;
          totalPages = data.totalPages;
          renderProducts(data.content);
          updatePagination(data);
        } else {
          throw new Error("Formato inesperado de la API");
        }
      })
      .catch((error) =>
        console.error("Error al obtener productos", error)
      );
  }

  function renderProducts(data) {
    const productosContainer = document.getElementById("productos-container");
    productosContainer.innerHTML = "";

    data.forEach((producto) => {
      const shortDescription =
        producto.description.split(" ").slice(0, 5).join(" ") + "...";

      productosContainer.innerHTML += `
        <div class="card">
          <img src="${producto.imageUrl
        }" class="card-img-top" alt="${producto.name}">
          <div class="card-body">
            <h5 class="card-title">${producto.name}</h5>
            <p class="card-text short-description">${shortDescription}</p>
            <p class="card-text full-description" style="display: none;">${producto.description
        }</p>
            <button class="btn btn-link" onclick="toggleDescription(this)">Ver descripción</button>
            <p class="card-text">$${producto.price}</p>
            <button class="btn btn-primary" onclick="addToCart(${producto.id
        }, '${producto.imageUrl}', '${producto.name
        }', ${producto.price}, this)">Agregar al carrito</button>
          </div>
        </div>
      `;
    });
  }

  function updatePagination(pageData) {
    const paginationContainer = document.getElementById("pagination-container");
    const paginationList = paginationContainer.querySelector("ul");

    // Limpiar números de página existentes (mantener prev/next)
    const pageItems = paginationList.querySelectorAll(".page-item:not(#prev-page):not(#next-page)");
    pageItems.forEach(item => item.remove());

    if (pageData.totalPages > 1) {
      paginationContainer.style.display = "block";

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

      // Agregar event listeners
      paginationList.querySelectorAll(".page-link[data-page]").forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const page = parseInt(e.target.dataset.page);
          loadProducts(page);
        });
      });

      // Event listeners para anterior/siguiente
      prevButton.querySelector(".page-link").onclick = (e) => {
        e.preventDefault();
        if (!pageData.first) {
          loadProducts(pageData.number - 1);
        }
      };

      nextButton.querySelector(".page-link").onclick = (e) => {
        e.preventDefault();
        if (!pageData.last) {
          loadProducts(pageData.number + 1);
        }
      };
    } else {
      paginationContainer.style.display = "none";
    }
  }



  window.toggleDescription = function (button) {
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
  };



  // Configurar event listeners
  setupLoginFormListener();
  setupCartEventListeners();

  // Hacer funciones globales para compatibilidad temporal (hasta que main.js esté activo)
  window.login = login;
  window.logout = logout;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
});
