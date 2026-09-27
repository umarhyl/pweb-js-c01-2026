const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const resetFilterBtn = document.getElementById("reset-filter-btn");
const mainCategoryList = document.getElementById("main-category-list");
const productContainer = document.getElementById("product-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const statusMessage = document.getElementById("status-message");
const productCounter = document.getElementById("product-counter");

let allProducts = [];
let processedProducts = [];
let visibleCount = 12;
let selectedMainCategory = "";

const mainCategoryGroups = [
  { name: "Busana", categories: ["mens-shirts", "mens-shoes", "mens-watches", "tops", "womens-bags", "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches", "sunglasses"] },
  { name: "Kecantikan", categories: ["beauty", "fragrances", "skin-care"] },
  { name: "Teknologi", categories: ["laptops", "smartphones", "tablets", "mobile-accessories"] },
  { name: "Rumah", categories: ["furniture", "home-decoration", "kitchen-accessories"] },
  { name: "Harian", categories: ["groceries"] },
  { name: "Gaya Hidup", categories: ["sports-accessories", "motorcycle", "vehicle"] }
];

const categoryLabels = {
  beauty: "Kecantikan",
  fragrances: "Parfum",
  furniture: "Furnitur",
  groceries: "Kebutuhan harian",
  "home-decoration": "Dekorasi rumah",
  "kitchen-accessories": "Perlengkapan dapur",
  laptops: "Laptop",
  "mens-shirts": "Kemeja pria",
  "mens-shoes": "Sepatu pria",
  "mens-watches": "Jam tangan pria",
  "mobile-accessories": "Aksesori ponsel",
  motorcycle: "Sepeda motor",
  "skin-care": "Perawatan kulit",
  smartphones: "Ponsel",
  "sports-accessories": "Aksesori olahraga",
  sunglasses: "Kacamata hitam",
  tablets: "Tablet",
  tops: "Atasan",
  vehicle: "Kendaraan",
  "womens-bags": "Tas wanita",
  "womens-dresses": "Gaun wanita",
  "womens-jewellery": "Perhiasan wanita",
  "womens-shoes": "Sepatu wanita",
  "womens-watches": "Jam tangan wanita"
};

function getCategoryLabel(category) {
  return categoryLabels[category] || category;
}

async function fetchProducts() {
  statusMessage.textContent = "Memuat katalog...";
  statusMessage.classList.remove("error");

  try {
    const response = await fetch("https://dummyjson.com/products?limit=0");

    if (!response.ok) {
      throw new Error("Produk gagal dimuat. Silakan coba lagi.");
    }

    const data = await response.json();
    allProducts = data.products;

    createCategoryOptions();
    renderMainCategories();
    updateProductsPipeline();
  } catch (error) {
    productContainer.innerHTML = "";
    mainCategoryList.innerHTML = "";
    loadMoreBtn.style.display = "none";
    productCounter.textContent = "";
    statusMessage.textContent = error.message;
    statusMessage.classList.add("error");
  }
}

function createCategoryOptions() {
  const categories = [];

  allProducts.forEach((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });

  categories.sort();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = getCategoryLabel(category);
    categoryFilter.append(option);
  });
}

function renderMainCategories() {
  mainCategoryList.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.classList.add("main-category-button");

  if (selectedMainCategory === "") {
    allButton.classList.add("active");
  }

  allButton.textContent = "Semua";

  allButton.addEventListener("click", () => {
    selectedMainCategory = "";
    categoryFilter.value = "";
    renderMainCategories();
    updateProductsPipeline();
  });

  mainCategoryList.append(allButton);

  mainCategoryGroups.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("main-category-button");

    if (selectedMainCategory === group.name) {
      button.classList.add("active");
    }

    button.textContent = group.name;

    button.addEventListener("click", () => {
      selectedMainCategory = group.name;
      categoryFilter.value = "";
      renderMainCategories();
      updateProductsPipeline();
    });

    mainCategoryList.append(button);
  });
}

function getSelectedMainCategories() {
  let selectedCategories = [];

  mainCategoryGroups.forEach((group) => {
    if (group.name === selectedMainCategory) {
      selectedCategories = group.categories;
    }
  });

  return selectedCategories;
}

function updateProductsPipeline() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const categoryValue = categoryFilter.value;
  const sortValue = sortFilter.value;
  let result = allProducts.slice(0, allProducts.length);

  if (searchValue !== "") {
    result = result.filter((product) => {
      const categoryLabel = getCategoryLabel(product.category).toLowerCase();

      return product.title.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        categoryLabel.includes(searchValue);
    });
  }

  if (selectedMainCategory !== "") {
    const selectedCategories = getSelectedMainCategories();

    result = result.filter((product) => {
      return selectedCategories.includes(product.category);
    });
  }

  if (categoryValue !== "") {
    result = result.filter((product) => {
      return product.category === categoryValue;
    });
  }

  if (sortValue === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating-desc") {
    result.sort((a, b) => b.rating - a.rating);
  }

  processedProducts = result;
  visibleCount = 12;
  renderProducts();
}

function renderProducts() {
  productContainer.innerHTML = "";
  statusMessage.textContent = "";

  if (processedProducts.length === 0) {
    statusMessage.textContent = "Produk tidak ditemukan. Coba kata kunci atau kategori lain.";
    productCounter.textContent = "0 produk";
    loadMoreBtn.style.display = "none";
    return;
  }

  const productsToRender = processedProducts.slice(0, visibleCount);

  productsToRender.forEach((product) => {
    const card = document.createElement("article");
    card.classList.add("product-card");
    card.id = "product-" + product.id;

    const media = document.createElement("div");
    media.classList.add("product-media");

    const image = document.createElement("img");
    image.classList.add("product-image");
    image.src = product.thumbnail;
    image.alt = product.title;

    const discount = document.createElement("div");
    discount.classList.add("product-discount");

    const discountLabel = document.createElement("span");
    discountLabel.classList.add("discount-label");
    discountLabel.textContent = "DISKON";

    const discountValue = document.createElement("span");
    discountValue.classList.add("discount-value");
    discountValue.textContent = product.discountPercentage + "%";

    discount.append(discountLabel, discountValue);
    media.append(image, discount);

    const content = document.createElement("div");
    content.classList.add("product-content");

    const category = document.createElement("p");
    category.classList.add("product-category");
    category.textContent = getCategoryLabel(product.category);

    const title = document.createElement("h3");
    title.classList.add("product-title");
    title.textContent = product.title;

    const detailRow = document.createElement("div");
    detailRow.classList.add("product-detail-row");

    const price = document.createElement("p");
    price.classList.add("product-price");
    price.textContent = "$" + product.price;

    const rating = document.createElement("p");
    rating.classList.add("product-rating");
    rating.textContent = "★ " + product.rating;

    detailRow.append(price, rating);

    const addCartBtn = document.createElement("button");
    addCartBtn.type = "button";
    addCartBtn.classList.add("add-cart-btn");
    addCartBtn.textContent = "Tambah ke keranjang";

    content.append(category, title, detailRow, addCartBtn);
    card.append(media, content);
    productContainer.append(card);
  });

  productCounter.textContent = productsToRender.length + " dari " + processedProducts.length + " produk";

  if (visibleCount >= processedProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
  }
}

function debounce(callback, delay) {
  let sequence = 0;

  return function() {
    sequence += 1;
    const currentSequence = sequence;

    setTimeout(() => {
      if (currentSequence === sequence) {
        callback();
      }
    }, delay);
  };
}

const searchWithDebounce = debounce(updateProductsPipeline, 500);

searchInput.addEventListener("input", searchWithDebounce);

categoryFilter.addEventListener("input", () => {
  selectedMainCategory = "";
  renderMainCategories();
  updateProductsPipeline();
});

sortFilter.addEventListener("input", updateProductsPipeline);

loadMoreBtn.addEventListener("click", () => {
  visibleCount += 12;
  renderProducts();
});

resetFilterBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  sortFilter.value = "";
  selectedMainCategory = "";
  renderMainCategories();
  updateProductsPipeline();
});

function getProductByCardId(cardId) {
  let selectedProduct = null;

  allProducts.forEach((product) => {
    if ("product-" + product.id === cardId) {
      selectedProduct = product;
    }
  });

  return selectedProduct;
}

fetchProducts();