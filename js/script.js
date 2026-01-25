

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

  window.addToCart = function (id, image, title, price, button) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find((product) => product.id === id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ id, image, title, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();

    // Cambiar el texto del botón
    button.textContent = "Agregado";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = "Agregar al carrito";
      button.disabled = false;
    }, 1000);
  };

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

  // FUNCIÓN UPDATECARTUI PARA MOSTRAR TARJETAS
  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      carritoItems.innerHTML =
        '<li class="text-center text-muted w-100">Tu carrito está vacío</li>';
      document.getElementById("realizar-compra").disabled = true;
    } else {
      document.getElementById("realizar-compra").disabled = false;

      cart.forEach((item) => {
        const cartItemHTML = `
          <li class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="card-body">
              <h6 class="card-title">${item.title}</h6>
              <p class="card-text">Cantidad: <strong>${item.quantity
          }</strong></p>
              <p class="card-text">Precio unitario: ${item.price}</p>
              <p class="card-text">Subtotal: <strong>${(
            item.price * item.quantity
          ).toFixed(2)}</strong></p>
              <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id
          })">
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
    document.getElementById("cart-counter").textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  // FUNCIÓN PARA ELIMINAR PRODUCTOS INDIVIDUALES
  window.removeFromCart = function (id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  };

  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.clear();
    updateCartUI();
  });

  // FUNCIONALIDAD PARA REALIZAR COMPRA
  document.getElementById("realizar-compra").addEventListener("click", async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
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

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      document.getElementById("modal-total").textContent = total.toFixed(2);

      // Mostrar el modal
      const modal = new bootstrap.Modal(
        document.getElementById("compraExitosaModal")
      );
      modal.show();

      // Limpiar el carrito después de la compra
      localStorage.removeItem("cart");
      updateCartUI();

    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert("Error al realizar la compra: " + error.message);
    }
  });

  // Configurar event listener del formulario de login
  setupLoginFormListener();

  // Hacer funciones globales para compatibilidad temporal (hasta que main.js esté activo)
  window.login = login;
  window.logout = logout;
});
