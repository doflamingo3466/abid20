// Simple demo admin panel. This is not secure production authentication.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "forme2026";

const adminLoginForm = document.getElementById("admin-login-form");
const adminLogin = document.getElementById("admin-login");
const adminDashboard = document.getElementById("admin-dashboard");

function openAdmin() {
  adminLogin.hidden = true;
  adminDashboard.hidden = false;
  showAdminData();
}

if (sessionStorage.getItem("formeAdmin") === "true") openAdmin();

if (adminLoginForm) {
  adminLoginForm.onsubmit = function (e) {
    e.preventDefault();
    const username = document.getElementById("admin-user").value;
    const password = document.getElementById("admin-pass").value;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("formeAdmin", "true");
      openAdmin();
    } else {
      document.getElementById("admin-error").textContent =
        "Incorrect admin details.";
    }
  };
}

document.getElementById("admin-logout").onclick = function () {
  sessionStorage.removeItem("formeAdmin");
  location.reload();
};

function showAdminData() {
  const products = getProducts();
  const orders = JSON.parse(localStorage.getItem("formeOrders")) || [];
  document.getElementById("admin-product-count").textContent = products.length;
  document.getElementById("admin-order-count").textContent = orders.length;
  document.getElementById("admin-user-count").textContent = getUsers().length;

  document.getElementById("admin-products").innerHTML =
    products
      .map(
        (product) => `
    <div class="admin-item"><div><b>${product.name}</b><span>Rs. ${product.price.toLocaleString()}</span></div>
    <div><button class="small-button" onclick="editProduct(${product.id})">Edit</button><button class="small-button danger" onclick="deleteProduct(${product.id})">Delete</button></div></div>`,
      )
      .join("") || "<p>No products.</p>";

  document.getElementById("admin-orders").innerHTML =
    orders
      .slice()
      .reverse()
      .map(
        (order) => `
    <div class="admin-order"><h3>Order #${order.id}</h3><p>${order.customer} · ${order.email}</p><p>${order.phone} · ${order.address}</p><p>${order.items.map((item) => item.name + " × " + item.qty).join(", ")}</p><strong>Rs. ${order.total.toLocaleString()}</strong>
    <label>Order status<select onchange="changeOrderStatus(${order.id}, this.value)"><option ${order.status === "Pending" ? "selected" : ""}>Pending</option><option ${order.status === "Processing" ? "selected" : ""}>Processing</option><option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option><option ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option></select></label></div>`,
      )
      .join("") || "<p>No orders yet.</p>";
}

document.getElementById("product-form").onsubmit = function (e) {
  e.preventDefault();
  let products = getProducts();
  const id = document.getElementById("product-id").value;
  const product = {
    id: id ? Number(id) : Date.now(),
    name: document.getElementById("product-name").value.trim(),
    price: Number(document.getElementById("product-price").value),
    image: document.getElementById("product-image").value.trim(),
    description: document.getElementById("product-description").value.trim(),
  };
  if (id)
    products = products.map((item) =>
      item.id === Number(id) ? product : item,
    );
  else products.push(product);
  localStorage.setItem("formeProducts", JSON.stringify(products));
  this.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-form-title").textContent = "Add a product";
  showAdminData();
};

function editProduct(id) {
  const product = getProducts().find((item) => item.id === id);
  if (!product) return;
  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-image").value = product.image;
  document.getElementById("product-description").value =
    product.description || "";
  document.getElementById("product-form-title").textContent = "Edit product";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("cancel-edit").onclick = function () {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-form-title").textContent = "Add a product";
};

function deleteProduct(id) {
  if (!confirm("Remove this product from the store?")) return;
  localStorage.setItem(
    "formeProducts",
    JSON.stringify(getProducts().filter((item) => item.id !== id)),
  );
  showAdminData();
}

function changeOrderStatus(id, status) {
  const orders = JSON.parse(localStorage.getItem("formeOrders")) || [];
  const order = orders.find((item) => item.id === id);
  if (!order) return;
  order.status = status;
  localStorage.setItem("formeOrders", JSON.stringify(orders));
}

if (sessionStorage.getItem("formeAdmin") === "true") showAdminData();
