let allProducts = [];
let activeCategory = "all";
let searchQuery = "";

const CATEGORY_ICONS = {
  "men's clothing":   "👔",
  "women's clothing": "👗",
  electronics:        "📱",
  jewelery:           "💎",
};


function initCategoriesSwiper(categories) {
  const wrapper = document.getElementById("categoriesWrapper");

  wrapper.appendChild(createCategorySlide("Todos", "✦", "all", true));

  categories.forEach((cat) => {
    const icon = CATEGORY_ICONS[cat] ?? "🏷️";
    wrapper.appendChild(createCategorySlide(cap(cat), icon, cat, false));
  });

  new Swiper(".categories-swiper", {
    slidesPerView: 1.5,
    spaceBetween: 16,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      480:  { slidesPerView: 2.5 },
      768:  { slidesPerView: 3.5 },
      1024: { slidesPerView: 4, spaceBetween: 20 },
      1280: { slidesPerView: 5, spaceBetween: 20 },
    },
  });
}

function createCategorySlide(label, icon, value, isActive) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const inner = document.createElement("div");
  inner.className = `category-slide${isActive ? " active" : ""}`;
  inner.dataset.category = value;
  inner.innerHTML = `
    <span class="category-icon" aria-hidden="true">${icon}</span>
    <span class="category-name">${label}</span>
  `;

  inner.addEventListener("click", () => {
    activeCategory = value;
    document
      .querySelectorAll(".category-slide")
      .forEach((s) => s.classList.toggle("active", s.dataset.category === value));
    syncFilterButtons(value);
    renderProductGrid();
  });

  slide.appendChild(inner);
  return slide;
}


function renderFilterButtons(categories) {
  const bar = document.getElementById("filterBar");
  if (!bar) return;
  bar.innerHTML = "";
  bar.appendChild(createFilterButton("Todos", "all", true));
  categories.forEach((cat) =>
    bar.appendChild(createFilterButton(cap(cat), cat, false))
  );
}

function createFilterButton(label, value, isActive) {
  const btn = document.createElement("button");
  btn.className = `filter-btn${isActive ? " active" : ""}`;
  btn.dataset.category = value;
  btn.textContent = label;
  btn.addEventListener("click", () => {
    activeCategory = value;
    syncFilterButtons(value);
    syncCategorySlides(value);
    renderProductGrid();
  });
  return btn;
}

function syncFilterButtons(value) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.category === value));
}

function syncCategorySlides(value) {
  document
    .querySelectorAll(".category-slide")
    .forEach((s) => s.classList.toggle("active", s.dataset.category === value));
}


function filterBySearch(query) {
  searchQuery = query.toLowerCase().trim();
  renderProductGrid();
}


function getFilteredProducts() {
  return allProducts.filter((p) => {
    const matchCat =
      activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
}

function renderProductGrid() {
  const grid      = document.getElementById("productsGrid");
  const emptyState = document.getElementById("emptyState");
  const countEl   = document.getElementById("productsCount");
  const products  = getFilteredProducts();

  if (products.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("d-none");
    if (countEl) countEl.textContent = "0 productos";
    return;
  }

  emptyState.classList.add("d-none");
  if (countEl)
    countEl.textContent = `${products.length} producto${products.length !== 1 ? "s" : ""}`;

  grid.innerHTML = products
    .map(
      (p) => `
    <div class="col-6 col-md-4 col-lg-3">
      <article class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Ver detalle de ${p.title}">
        <div class="product-card-img-wrapper">
          <img class="product-card-img" src="${p.image}" alt="${p.title}" loading="lazy" />
          <div class="product-card-overlay" aria-hidden="true">
            <button class="overlay-btn" tabindex="-1">Ver detalle</button>
          </div>
        </div>
        <div class="product-card-body">
          <p class="product-card-category">${p.category}</p>
          <h3 class="product-card-title">${p.title}</h3>
          <div class="product-card-footer">
            <span class="product-card-price">$${p.price.toFixed(2)}</span>
            <span class="product-card-rating" aria-label="Rating ${p.rating?.rate ?? 0} de 5">
              <i class="bi bi-star-fill" aria-hidden="true"></i> ${p.rating?.rate ?? "—"}
            </span>
          </div>
        </div>
      </article>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll(".product-card").forEach((card) => {
    const product = allProducts.find((p) => p.id === Number(card.dataset.id));
    card.addEventListener("click", () => openProductModal(product));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProductModal(product);
      }
    });
  });
}


function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}