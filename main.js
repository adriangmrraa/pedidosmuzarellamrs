document.addEventListener("DOMContentLoaded", () => {
  // Inicialización del Swiper (sin cambios)
  const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
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
      price: 2000,
    },
  };

  // Crear el ícono flotante de papas (sin cambios)
  const friesIconFloat = document.createElement("div");
  friesIconFloat.className = "fries-icon-floating";
  friesIconFloat.innerHTML = `<img src="assets/icons/fries.png" alt="Papas Fritas" style="width: 30px; height: 30px;">`;
  document.body.appendChild(friesIconFloat);

  // Crear el panel de papas
  const friesPanel = document.createElement("div");
  friesPanel.className = "fries-panel";
  friesPanel.innerHTML = `<div class="fries-panel-header"> <h3>Papas Fritas</h3> </div> <div class="quantity-control"> <button class="quantity-btn minus">-</button> <input type="number" class="quantity-value" min="0" max="100" value="0"> <button class="quantity-btn plus">+</button> </div> <div class="price">$2800</div> <button class="add-fries-btn">Agregar al pedido</button>`;
  document.body.appendChild(friesPanel);

  // Crear el texto popup (sin cambios)
  const friesTextPopup = document.createElement("div");
  friesTextPopup.className = "fries-text-popup";
  friesTextPopup.innerHTML = "¿Unas papas 🍟?";
  document.body.appendChild(friesTextPopup);

  // Mostrar ícono y texto después de 5 segundos (sin cambios)
  setTimeout(() => {
    friesIconFloat.classList.add("show");
    friesTextPopup.classList.add("show");

    setTimeout(() => {
      friesTextPopup.classList.add("hide");
      setTimeout(() => {
        friesTextPopup.style.visibility = "hidden";
      }, 500);
    }, 4000);
  }, 5000);

  // Evento click para el ícono de papas
  friesIconFloat.addEventListener("click", (e) => {
    e.stopPropagation();
    const quantityInput = friesPanel.querySelector(".quantity-value");
    orderState.fries.quantity = 0; // Resetear la cantidad en el panel de papas
    quantityInput.value = orderState.fries.quantity;
    friesPanel.classList.add("show");
  });

  // Función para configurar los eventos de los botones de compra (sin cambios)
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

  // Asegurarse de que los botones funcionen en dispositivos táctiles (sin cambios)
  document.addEventListener("touchstart", function () {}, true);

  // ************************************************************************************
  // CREACIÓN DEL PANEL FUERA DE showBurgerPanel PARA EVITAR MÚLTIPLES LISTENERS
  // ************************************************************************************
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
                    <input type="number" class="quantity-value" min="0" max="100" value="0">
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="price"></div>
                <button class="add-burger-btn">AGREGAR AL PEDIDO</button>
            `;
    document.body.appendChild(burgerPanel);

    // Configurar los eventos del panel (SOLO UNA VEZ)
    setupBurgerPanelEvents(burgerPanel);
  }

  function showBurgerPanel(name, description, price) {
    // ************************************************************************************
    // MODIFICACIÓN IMPORTANTE: Resetear la cantidad en el panel de hamburguesas cada vez que se abre
    // ************************************************************************************
    const existingBurger = orderState.burgers.find((b) => b.name === name);
    let initialQuantity = 0;
    if (existingBurger) {
      initialQuantity = existingBurger.quantity;
    }

    burgerPanel.querySelector("h3").textContent = name;
    burgerPanel.querySelector(".burger-description").textContent = description;
    burgerPanel.querySelector(".price").textContent = `$${price}`;

    // ************************************************************************************
    //  Crear un objeto burgerState local a esta función, para evitar problemas de estado
    // ************************************************************************************
    const burgerState = {
      name: name,
      description: description,
      price: price,
      quantity: initialQuantity,
    };

    const quantityInput = burgerPanel.querySelector(".quantity-value");
    quantityInput.value = burgerState.quantity;

    //  Actualizar el estado del panel con la cantidad existente
    updateQuantityControls(
      burgerPanel,
      burgerState,
      updateOrderSummary,
      orderState
    );
    burgerPanel.classList.add("show");
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

  //  ************************************************************************************
  //  MODIFICACIÓN IMPORTANTE: Pasar el burgerState a esta funcion y hacerla mas general
  //  ************************************************************************************
  function updateQuantityControls(
    panel,
    burgerState,
    updateOrderSummary,
    orderState
  ) {
    const quantityInput = panel.querySelector(".quantity-value");

    //  Buscar hamburguesa existente en el pedido
    const existingBurger = orderState.burgers.find(
      (b) => b.name === burgerState.name
    );
    if (existingBurger) {
      burgerState.quantity = existingBurger.quantity;
      quantityInput.value = burgerState.quantity;
    }

    const plusBtn = panel.querySelector(".plus");
    const minusBtn = panel.querySelector(".minus");

    plusBtn.addEventListener("click", (e) => {
      burgerState.quantity = Math.min(burgerState.quantity + 1, 100);
      quantityInput.value = burgerState.quantity;
    });

    minusBtn.addEventListener("click", (e) => {
      burgerState.quantity = Math.max(burgerState.quantity - 1, 0);
      quantityInput.value = burgerState.quantity;
    });
  }

  // Actualizar setupBurgerPanelEvents
  function setupBurgerPanelEvents(panel) {
    const addBtn = panel.querySelector(".add-burger-btn");

    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = panel.querySelector(".burger-panel-header h3").textContent;
      const quantityInput = panel.querySelector(".quantity-value");
      const burgerState = {
        name: name,
        quantity: parseInt(quantityInput.value),
        price: parseInt(
          panel.querySelector(".price").textContent.replace("$", "")
        ),
      };

      const existingBurgerIndex = orderState.burgers.findIndex(
        (burger) => burger.name === name
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
    const quantityInput = friesPanel.querySelector(".quantity-value");

    friesPanel.querySelector(".plus").addEventListener("click", (e) => {
      friesState.quantity = Math.min(friesState.quantity + 1, 100);
      quantityInput.value = friesState.quantity;
      orderState.fries.quantity = friesState.quantity;
    });

    friesPanel.querySelector(".minus").addEventListener("click", (e) => {
      friesState.quantity = Math.max(friesState.quantity - 1, 0);
      quantityInput.value = friesState.quantity;
      orderState.fries.quantity = friesState.quantity;
    });

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
    const phoneNumber = "543704961790";

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
