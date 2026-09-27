const cartProductContainer = document.getElementById("product-container");
const cartButton = document.getElementById("cart-button");
const cartBadge = document.getElementById("cart-badge");
const cartTotal = document.getElementById("cart-total");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItems = document.getElementById("cart-items");
const cartModalTotal = document.getElementById("cart-modal-total");
const clearCartBtn = document.getElementById("clear-cart-btn");

const savedCart = localStorage.getItem("cart");
let cart = [];

if (savedCart) {
  cart = JSON.parse(savedCart);
}

function saveCart() {
  if (cart.length === 0) {
    localStorage.removeItem("cart");
  } else {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartSummary();
}

function updateCartSummary() {
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalQuantity += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  cartBadge.textContent = totalQuantity;
  cartTotal.textContent = "$" + totalPrice.toFixed(2);
  cartModalTotal.textContent = "$" + totalPrice.toFixed(2);
}

function addToCart(product) {
  let existingItem = null;

  cart.forEach((item) => {
    if (item.id === product.id) {
      existingItem = item;
    }
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    });
  }

  saveCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.classList.add("cart-empty");
    emptyMessage.textContent = "Keranjangmu masih kosong.";

    cartItems.append(emptyMessage);
    updateCartSummary();

    return;
  }

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const image = document.createElement("img");
    image.src = item.thumbnail;
    image.alt = item.title;

    const info = document.createElement("div");
    info.classList.add("cart-item-info");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const price = document.createElement("p");
    price.textContent = "$" + item.price;

    const quantityControl = document.createElement("div");
    quantityControl.classList.add("quantity-control");

    const decreaseBtn = document.createElement("button");
    decreaseBtn.type = "button";
    decreaseBtn.classList.add("cart-decrease");
    decreaseBtn.value = item.id;
    decreaseBtn.textContent = "−";

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseBtn = document.createElement("button");
    increaseBtn.type = "button";
    increaseBtn.classList.add("cart-increase");
    increaseBtn.value = item.id;
    increaseBtn.textContent = "+";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("cart-delete");
    deleteBtn.value = item.id;
    deleteBtn.textContent = "Hapus";

    quantityControl.append(decreaseBtn, quantity, increaseBtn);
    info.append(title, price, quantityControl);
    cartItem.append(image, info, deleteBtn);
    cartItems.append(cartItem);
  });

  updateCartSummary();
}

cartProductContainer.addEventListener("click", (event) => {
  if (event.target.matches(".add-cart-btn")) {
    const content = event.target.parentElement;
    const card = content.parentElement;
    const product = getProductByCardId(card.id);

    if (product) {
      addToCart(product);
      renderCart();
    }
  }
});

cartButton.addEventListener("click", () => {
  renderCart();
  cartModal.classList.add("show");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("show");
});

cartItems.addEventListener("click", (event) => {
  if (event.target.matches(".cart-increase")) {
    const productId = Number(event.target.value);

    cart.forEach((item) => {
      if (item.id === productId) {
        item.quantity += 1;
      }
    });

    saveCart();
    renderCart();
  }

  if (event.target.matches(".cart-decrease")) {
    const productId = Number(event.target.value);

    cart.forEach((item) => {
      if (item.id === productId && item.quantity > 1) {
        item.quantity -= 1;
      }
    });

    saveCart();
    renderCart();
  }

  if (event.target.matches(".cart-delete")) {
    const productId = Number(event.target.value);

    cart = cart.filter((item) => {
      return item.id !== productId;
    });

    saveCart();
    renderCart();
  }
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
});

updateCartSummary();