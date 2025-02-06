document.addEventListener("DOMContentLoaded", () => {
  // Inicialización del Swiper
  const swiper = new Swiper(".swiper", {
    // Parámetros opcionales
    direction: "horizontal",
    loop: true,

    // Paginación
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // Navegación
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // Autoplay (opcional)
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    // Efectos
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },

    // Responsive breakpoints
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
    },
  });

  // Estados globales
  const orderState = {
    burgers: [],
    fries: {
      quantity: 0,
      price: 2800,
    },
  };

  // Crear el ícono flotante de papas
  const friesIconFloat = document.createElement("div");
  friesIconFloat.className = "fries-icon-floating";
  friesIconFloat.innerHTML = `<img src="assets/icons/fries.png" alt="Papas Fritas" style="width: 30px; height: 30px;">`;
  document.body.appendChild(friesIconFloat);

  // Crear el panel de papas
  const friesPanel = document.createElement("div");
  friesPanel.className = "fries-panel";
  friesPanel.innerHTML = `<div class="fries-panel-header"> <h3>Papas Fritas</h3> </div> <div class="quantity-control"> <button class="quantity-btn minus">-</button> <div class="quantity-value">0</div> <button class="quantity-btn plus">+</button> </div> <div class="price">$2800</div> <button class="add-fries-btn">Agregar al pedido</button>`;
  document.body.appendChild(friesPanel);

  // Crear el texto popup
  const friesTextPopup = document.createElement("div");
  friesTextPopup.className = "fries-text-popup";
  friesTextPopup.innerHTML = "¿Unas papas 🍟?";
  document.body.appendChild(friesTextPopup);

  // Mostrar ícono y texto después de 5 segundos
  setTimeout(() => {
    friesIconFloat.classList.add("show");
    friesTextPopup.classList.add("show");

    // Ocultar el texto después de 4 segundos
    setTimeout(() => {
      friesTextPopup.classList.add("hide");
      // Remover el elemento después de la animación
      setTimeout(() => {
        friesTextPopup.style.visibility = "hidden";
      }, 500);
    }, 4000);
  }, 5000);

  // Evento click para el ícono de papas
  friesIconFloat.addEventListener("click", (e) => {
    e.stopPropagation(); // Evitar que el evento se propague al document
    const quantityInput = friesPanel.querySelector(".quantity-value");
    quantityInput.value = orderState.fries.quantity; // Mostrar cantidad actual
    friesPanel.classList.add("show");
  });

  // Función para configurar los eventos de los botones de compra
  function setupBuyButtons() {
    document.querySelectorAll(".buy-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const slideContent = e.target.closest(".slide-content");
        const name = slideContent.querySelector("h3").textContent;
        const description = slideContent.querySelector("p").textContent;
        const price = parseInt(
          slideContent.querySelector(".price").textContent.replace("$", "")
        );

        showBurgerPanel(name, description, price);
      });
    });
  }

  // Configurar los botones después de que Swiper se inicialice
  swiper.on("init", function () {
    setupBuyButtons();
  });

  // También configurar los botones cuando cambie el slide
  swiper.on("slideChange", function () {
    setupBuyButtons();
  });

  // Asegurarse de que los botones funcionen en dispositivos táctiles
  document.addEventListener("touchstart", function () {}, true);

  function showBurgerPanel(name, description, price) {
    let burgerPanel = document.querySelector(".burger-panel");

    if (!burgerPanel) {
      burgerPanel = document.createElement("div");
      burgerPanel.className = "burger-panel";
      burgerPanel.innerHTML = `
                <div class="burger-panel-header">
                    <h3></h3>
                    <p class="burger-description"></p>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <div class="quantity-value">0</div>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="price"></div>
                <button class="add-burger-btn">AGREGAR AL PEDIDO</button>
            `;
      document.body.appendChild(burgerPanel);
    }

    // Buscar hamburguesa existente en el pedido
    const existingBurger = orderState.burgers.find((b) => b.name === name);
    const burgerState = {
      name: name,
      description: description,
      price: price,
      quantity: existingBurger ? existingBurger.quantity : 0,
    };

    burgerPanel.querySelector("h3").textContent = name;
    burgerPanel.querySelector(".burger-description").textContent = description;
    burgerPanel.querySelector(".price").textContent = `$${price}`;
    burgerPanel.querySelector(".quantity-value").textContent =
      burgerState.quantity;

    burgerPanel.classList.add("show");

    setupBurgerPanelEvents(burgerPanel, burgerState);
  }

  function setupQuantityControls(container, state, updateCallback) {
    const plusBtn = container.querySelector(".plus");
    const minusBtn = container.querySelector(".minus");
    const quantityInput = container.querySelector(".quantity-value");

    // Convertir el div de cantidad en un input
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.value = state.quantity;
    input.className = "quantity-value";
    quantityInput.parentNode.replaceChild(input, quantityInput);

    function updateQuantity(value) {
      value = Math.min(Math.max(0, value), 100); // Limitar entre 0 y 100
      state.quantity = value;
      input.value = value;
      if (updateCallback) updateCallback();
    }

    // Eventos para los botones + y -
    plusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.quantity < 100) {
        updateQuantity(state.quantity + 1);
      }
    });

    minusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.quantity > 0) {
        updateQuantity(state.quantity - 1);
      }
    });

    // Evento para entrada manual
    input.addEventListener("change", (e) => {
      let value = parseInt(e.target.value) || 0;
      updateQuantity(value);
    });

    // Prevenir scroll al usar los inputs
    input.addEventListener("wheel", (e) => {
      e.preventDefault();
    });

    return input;
  }

  // Actualizar setupBurgerPanelEvents
  function setupBurgerPanelEvents(panel, burgerState) {
    const quantityInput = setupQuantityControls(panel, burgerState);
    const addBtn = panel.querySelector(".add-burger-btn");

    // Al abrir el panel, cargar la cantidad existente
    const existingBurger = orderState.burgers.find(
      (b) => b.name === burgerState.name
    );
    if (existingBurger) {
      burgerState.quantity = existingBurger.quantity;
      quantityInput.value = existingBurger.quantity;
    }

    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const existingBurgerIndex = orderState.burgers.findIndex(
        (burger) => burger.name === burgerState.name
      );

      if (burgerState.quantity > 0) {
        if (existingBurgerIndex !== -1) {
          // Actualizar cantidad existente
          orderState.burgers[existingBurgerIndex].quantity =
            burgerState.quantity;
          orderState.burgers[existingBurgerIndex].total =
            burgerState.quantity * burgerState.price;
        } else {
          // Agregar nueva hamburguesa
          orderState.burgers.push({
            name: burgerState.name,
            quantity: burgerState.quantity,
            price: burgerState.price,
            total: burgerState.quantity * burgerState.price,
          });
        }
      } else {
        // Si la cantidad es 0, eliminar del pedido
        if (existingBurgerIndex !== -1) {
          orderState.burgers.splice(existingBurgerIndex, 1);
        }
      }

      updateOrderSummary();
      panel.classList.remove("show");
    });
  }

  // Actualizar setupFriesPanelEvents
  function setupFriesPanelEvents() {
    const friesState = {
      quantity: orderState.fries.quantity, // Inicializar con la cantidad existente
      price: 2800,
    };

    const quantityInput = setupQuantityControls(friesPanel, friesState, () => {
      // Actualizar la cantidad en el estado global
      orderState.fries.quantity = friesState.quantity;
    });

    // Al abrir el panel, mostrar la cantidad actual
    quantityInput.value = orderState.fries.quantity;

    const addBtn = friesPanel.querySelector(".add-fries-btn");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Actualizar directamente la cantidad (puede ser 0)
      orderState.fries.quantity = friesState.quantity;
      updateOrderSummary();
      friesPanel.classList.remove("show");
    });
  }

  function updateOrderSummary() {
    const orderSummary = document.querySelector(".order-container");
    if (!orderSummary) return;

    let orderItems = orderSummary.querySelector(".order-items");
    if (!orderItems) {
      orderItems = document.createElement("div");
      orderItems.className = "order-items";
      orderSummary.appendChild(orderItems);
    }

    // Limpiar items existentes
    orderItems.innerHTML = "";

    // Mostrar hamburguesas
    orderState.burgers.forEach((burger) => {
      if (burger.quantity > 0) {
        const burgerItem = document.createElement("div");
        burgerItem.className = "order-item burger-item";
        burgerItem.innerHTML = `
                    <span>${burger.name}</span>
                    <span>x${burger.quantity}</span>
                    <span>$${burger.total}</span>
                `;
        orderItems.appendChild(burgerItem);
      }
    });

    // Mostrar papas si hay
    if (orderState.fries.quantity > 0) {
      const friesItem = document.createElement("div");
      friesItem.className = "order-item fries-item";
      const friesTotal = orderState.fries.quantity * orderState.fries.price;
      friesItem.innerHTML = `
                <span>Papas Fritas</span>
                <span>x${orderState.fries.quantity}</span>
                <span>$${friesTotal}</span>
            `;
      orderItems.appendChild(friesItem);
    }

    // Actualizar total
    updateTotal(orderSummary);

    // Mostrar el contenedor de pedido si hay items
    const hasItems =
      orderState.burgers.some((b) => b.quantity > 0) ||
      orderState.fries.quantity > 0;
    orderSummary.style.display = hasItems ? "block" : "none";

    // Filtrar hamburguesas con cantidad 0
    orderState.burgers = orderState.burgers.filter(
      (burger) => burger.quantity > 0
    );
  }

  function updateTotal(orderSummary) {
    let totalContainer = orderSummary.querySelector(".total-amount");
    if (!totalContainer) {
      totalContainer = document.createElement("div");
      totalContainer.className = "total-amount";
      orderSummary.appendChild(totalContainer);
    }

    const burgersTotal = orderState.burgers.reduce(
      (sum, burger) => sum + burger.quantity * burger.price,
      0
    );
    const friesTotal = orderState.fries.quantity * orderState.fries.price;
    const total = burgersTotal + friesTotal;

    totalContainer.innerHTML = `Total: $${total}`;
  }

  // Inicializar los controles de papas
  setupFriesPanelEvents();

  // Agregar evento al botón de hacer pedido
  const orderButton = document.querySelector(".order-button");
  if (orderButton) {
    orderButton.addEventListener("click", sendWhatsAppOrder);
  }

  function sendWhatsAppOrder() {
    // Verificar si hay productos en el pedido
    if (orderState.burgers.length === 0 && orderState.fries.quantity === 0) {
      alert("Por favor, agrega productos a tu pedido");
      return;
    }

    // Construir el mensaje
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";

    // Agregar hamburguesas al mensaje
    orderState.burgers.forEach((burger) => {
      message += `▪ ${burger.quantity}x ${burger.name} - $${burger.total}\n`;
    });

    // Agregar papas si hay
    if (orderState.fries.quantity > 0) {
      const friesTotal = orderState.fries.quantity * orderState.fries.price;
      message += `▪ ${orderState.fries.quantity}x Papas Fritas - $${friesTotal}\n`;
    }

    // Calcular y agregar el total
    const total =
      orderState.burgers.reduce((sum, burger) => sum + burger.total, 0) +
      orderState.fries.quantity * orderState.fries.price;

    message += `\n💰 Total: $${total}`;

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);

    // Número de WhatsApp (reemplazar con el número correcto)
    const phoneNumber = "543705115020";

    // Crear el enlace de WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappURL, "_blank");
  }

  // Cerrar paneles al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".fries-panel") &&
      !e.target.closest(".fries-icon-floating")
    ) {
      friesPanel.classList.remove("show");
    }

    if (
      !e.target.closest(".burger-panel") &&
      !e.target.closest(".buy-button")
    ) {
      const burgerPanel = document.querySelector(".burger-panel");
      if (burgerPanel) {
        burgerPanel.classList.remove("show");
      }
    }
  });
});
