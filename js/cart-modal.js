const cartProductContainer = document.getElementById("product-container");
const cartButton = document.getElementById("cart-button");
const cartBadge = document.getElementById("cart-badge");
const cartTotal = document.getElementById("cart-total");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItems = document.getElementById("cart-items");
const cartModalTotal = document.getElementById("cart-modal-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const productDetailModal = document.getElementById("product-modal");

const savedCart = localStorage.getItem("cart");

let cart = [];
let selectedModalProduct = null;

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

function showAddFeedback(button) {
  const originalText = button.textContent;

  button.textContent = "Ditambahkan +1";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 700);
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

function openProductModal(product) {
  selectedModalProduct = product;
  productDetailModal.innerHTML = "";

  const modalCard = document.createElement("div");
  modalCard.classList.add("product-modal-card");

  const imageArea = document.createElement("div");
  imageArea.classList.add("product-modal-image-area");

  const image = document.createElement("img");
  image.classList.add("product-modal-image");
  image.src = product.thumbnail;
  image.alt = product.title;

  imageArea.append(image);

  const content = document.createElement("div");
  content.classList.add("product-modal-content");

  const modalTop = document.createElement("div");
  modalTop.classList.add("product-modal-top");

  const category = document.createElement("p");
  category.classList.add("product-modal-category");
  category.textContent = getCategoryLabel(product.category);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("product-modal-close");
  closeButton.textContent = "×";

  modalTop.append(category, closeButton);

  const title = document.createElement("h2");
  title.classList.add("product-modal-title");
  title.textContent = product.title;

  const brand = document.createElement("p");
  brand.classList.add("product-modal-brand");

  if (product.brand) {
    brand.textContent = "Brand: " + product.brand;
  } else {
    brand.textContent = "Brand: Tidak tersedia";
  }

  const productInfo = document.createElement("div");
  productInfo.classList.add("product-modal-info");

  const price = document.createElement("strong");
  price.textContent = "$" + product.price;

  const rating = document.createElement("span");
  rating.textContent = "★ " + product.rating;

  productInfo.append(price, rating);

  const stock = document.createElement("p");
  stock.classList.add("product-modal-stock");
  stock.textContent = "Stok tersedia: " + product.stock;

  const description = document.createElement("p");
  description.classList.add("product-modal-description");
  description.textContent = product.description;

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.classList.add("product-modal-add");
  addButton.textContent = "Tambah ke keranjang";

  content.append(modalTop, title, brand, productInfo, stock, description, addButton);
  modalCard.append(imageArea, content);
  productDetailModal.append(modalCard);

  productDetailModal.classList.add("show");
}

function closeProductModal() {
  productDetailModal.classList.remove("show");
  productDetailModal.innerHTML = "";
  selectedModalProduct = null;
}

cartProductContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");

  if (!card) {
    return;
  }

  const product = getProductByCardId(card.id);

  if (!product) {
    return;
  }

  const addButton = event.target.closest(".add-cart-btn");

  if (addButton) {
    addToCart(product);
    showAddFeedback(addButton);
    return;
  }

  openProductModal(product);
});

cartButton.addEventListener("click", () => {
  renderCart();
  cartModal.classList.add("show");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("show");
});

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.classList.remove("show");
  }
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

productDetailModal.addEventListener("click", (event) => {
  if (event.target.matches(".product-modal-close")) {
    closeProductModal();
  }

  if (event.target === productDetailModal) {
    closeProductModal();
  }

  if (event.target.matches(".product-modal-add")) {
    if (selectedModalProduct) {
      addToCart(selectedModalProduct);
      showAddFeedback(event.target);
    }
  }
});

updateCartSummary();