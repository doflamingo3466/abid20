// Cart and checkout for the signed-in customer only
const cartContainer = document.getElementById("cart-items");
const checkoutForm = document.getElementById("checkout-form");

function renderCart() {
  if (!cartContainer) return;
  const user = getCurrentUser();
  if (!user) {
    cartContainer.innerHTML = '<div class="empty-cart"><h3>Your bag needs you.</h3><p>Sign in to see your personal cart.</p><a class="button button-blue" href="login.html">Sign in</a></div>';
    checkoutForm.style.display = "none";
    return;
  }

  const cart = getCart();
  let total = 0;
  let count = 0;
  cartContainer.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    count += item.qty;
    return `<div class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info"><h3>${item.name}</h3><p>Rs. ${item.price.toLocaleString()}</p>
        <div class="quantity"><button onclick="changeQuantity(${item.id}, -1)">−</button><span>${item.qty}</span><button onclick="changeQuantity(${item.id}, 1)">＋</button></div>
      </div>
      <strong>Rs. ${(item.price * item.qty).toLocaleString()}</strong>
      <button class="remove-button" onclick="removeItem(${item.id})">Remove</button>
    </div>`;
  }).join("") || '<div class="empty-cart"><h3>Nothing in here yet.</h3><p>Find a piece that feels like you.</p><a class="text-link" href="index.html#shop">Explore the collection ↗</a></div>';

  document.getElementById("subtotal").textContent = total.toLocaleString();
  document.getElementById("total").textContent = total.toLocaleString();
  document.getElementById("cart-count").textContent = count + (count === 1 ? " ITEM" : " ITEMS");
  if (checkoutForm) checkoutForm.style.display = cart.length ? "block" : "none";
  updateCartCount();
}

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.qty += amount;
  saveCart(cart.filter(product => product.qty > 0));
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(product => product.id !== id));
  renderCart();
}

if (checkoutForm) {
  checkoutForm.onsubmit = function(e) {
    e.preventDefault();
    const user = getCurrentUser();
    const cart = getCart();
    if (!user || cart.length === 0) return;

    const orders = JSON.parse(localStorage.getItem("formeOrders")) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: Date.now(), userId: user.id, customer: user.name, email: user.email,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      payment: document.getElementById("payment").value,
      items: cart, total: total, status: "Pending"
    };
    orders.push(order);
    localStorage.setItem("formeOrders", JSON.stringify(orders));
    saveCart([]);
    renderCart();
    document.getElementById("checkout-message").textContent = "Order placed! Your order number is " + order.id + ".";
    checkoutForm.reset();
  };
}

renderCart();