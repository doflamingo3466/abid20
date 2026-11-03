// Shared store data and website navigation
const starterProducts = [
  {
    id: 1,
    name: "Studio Watch",
    price: 3500,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    description: "A clean everyday watch with a quiet look.",
  },
  {
    id: 2,
    name: "Sound Headphones",
    price: 4500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    description: "Comfortable sound for work and downtime.",
  },
  {
    id: 3,
    name: "Daily Backpack",
    price: 2800,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
    description: "A simple carry-all for everyday plans.",
  },
  {
    id: 4,
    name: "Desk Lamp",
    price: 2200,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700",
    description: "A warm little upgrade for your desk.",
  },
];

if (!localStorage.getItem("formeProducts")) {
  localStorage.setItem("formeProducts", JSON.stringify(starterProducts));
}

function getProducts() {
  return JSON.parse(localStorage.getItem("formeProducts")) || [];
}

function getUsers() {
  return JSON.parse(localStorage.getItem("formeUsers")) || [];
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("formeCurrentUser"));
}

function getCartKey() {
  const user = getCurrentUser();
  return user ? "formeCart_" + user.id : null;
}

function getCart() {
  const key = getCartKey();
  return key ? JSON.parse(localStorage.getItem(key)) || [] : [];
}

function saveCart(cart) {
  const key = getCartKey();
  if (key) localStorage.setItem(key, JSON.stringify(cart));
}

function updateCartCount() {
  const countElement = document.getElementById("nav-cart-count");
  if (!countElement) return;
  countElement.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);
}

function logoutUser() {
  sessionStorage.removeItem("formeCurrentUser");
  window.location.href = "index.html";
}

// Build the shared navbar only on pages that contain #site-nav.
// The admin page intentionally has no public header or footer.
const user = getCurrentUser();
const nav = document.getElementById("site-nav");

if (nav) {
  nav.innerHTML = `
    <nav class="navbar wrap">
      <a class="logo" href="index.html">FORME<span>®</span></a>

      <button
        class="menu-toggle"
        id="menu-toggle"
        type="button"
        aria-label="Open navigation"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-links" id="nav-links">
        <a href="index.html">Shop</a>
        <a href="about.html">About</a>
        <a href="cart.html">Bag <span class="nav-count" id="nav-cart-count">0</span></a>
        ${
          user
            ? `<span class="nav-user">Hi, ${user.name.split(" ")[0]}</span>
             <button class="nav-logout" onclick="logoutUser()">Log out</button>`
            : `<a href="login.html">Sign in</a>`
        }
        <a class="nav-admin" href="admin.html">Admin ↗</a>
      </div>
    </nav>`;

  // Open and close the mobile navigation.
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.onclick = function () {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
  };

  // Close the menu after selecting a page link.
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.onclick = function () {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };
  });
}

const footer = document.getElementById("site-footer");
if (footer) {
  footer.innerHTML = `
    <footer class="footer">
      <div class="wrap footer-top">
        <div>
          <a class="logo footer-logo" href="index.html">FORME<span>®</span></a>
          <p>Everyday objects.<br>A little more considered.</p>
        </div>
        <div>
          <p class="eyebrow">EXPLORE</p>
          <a href="index.html">Shop the collection</a>
          <a href="about.html">About FORME</a>
          <a href="cart.html">Your bag</a>
        </div>
        <div>
          <p class="eyebrow">CONTACT</p>
          <a href="mailto:hello@forme.example">hello@forme.example</a>
          <a href="tel:+923001234567">+92 300 123 4567</a>
          <span>Faisalabad, Pakistan</span>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <span>© 2026 FORME CONCEPT STORE</span>
        
      </div>
    </footer>`;
}

function showProducts() {
  const container = document.getElementById("products");
  if (!container) return;
  const products = getProducts();
  container.innerHTML =
    products
      .map(
        (product) => `
    <article class="product-card">
      <div class="product-image-wrap"><img src="${product.image}" alt="${product.name}"><span class="product-tag">FORME PICK</span></div>
      <div class="product-info"><div><h3>${product.name}</h3><p>${product.description || "A useful everyday essential."}</p></div><strong>Rs. ${product.price.toLocaleString()}</strong></div>
      <button class="add-button" onclick="addToCart(${product.id})">Add to bag <span>＋</span></button>
    </article>`,
      )
      .join("") || "<p>No products available right now.</p>";
}

function addToCart(id) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  const product = getProducts().find((item) => item.id === id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  updateCartCount();
  alert(product.name + " added to your bag.");
}

showProducts();
updateCartCount();
