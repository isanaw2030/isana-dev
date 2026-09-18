let products = [
  { id: 1, name: "ISANA T-shirt", price: 1500, stock: 10 },
  { id: 2, name: "ISANA Hoodie", price: 2500, stock: 5 },
  { id: 3, name: "ISANA Watch", price: 3500, stock: 0 },
  { id: 4, name: "ISANA Cap", price: 800, stock: 20 }
];

// Load cart from browser storage or start empty
let cart = JSON.parse(localStorage.getItem("isana-cart")) || [];

function saveCart() {
  localStorage.setItem("isana-cart", JSON.stringify(cart));
}

function renderShop() {
  let shopDiv = document.getElementById("shop");
  shopDiv.innerHTML = "";
  products.forEach(p => {
    let btn = p.stock > 0 
      ? `<button onclick="addToCart(${p.id})">Add to Cart - KES ${p.price}</button>` 
      : `<button disabled>Out of Stock</button>`;
    shopDiv.innerHTML += `
      <div class="product ${p.stock === 0 ? 'out' : ''}">
        <h3>${p.name}</h3>
        <p>KES ${p.price} - ${p.stock > 0 ? `In Stock (${p.stock})` : 'OUT'}</p>
        ${btn}
      </div>
    `;
  });
}

function renderCart() {
  let cartDiv = document.getElementById("cart-items");
  let countSpan = document.getElementById("cart-count");
  let totalSpan = document.getElementById("cart-total");
  
  cartDiv.innerHTML = "";
  let total = 0;
  let count = 0;

  // Group by product for x2, x3 display
  let grouped = {};
  cart.forEach(item => {
    if (!grouped[item.id]) grouped[item.id] = { ...item, qty: 0 };
    grouped[item.id].qty++;
  });

  Object.values(grouped).forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    cartDiv.innerHTML += `
      <p>${item.name} x${item.qty} - KES ${item.price * item.qty}
      <button onclick="removeFromCart(${item.id})" style="background:red;margin-left:5px">x</button></p>
    `;
  });

  countSpan.innerText = count;
  totalSpan.innerText = total;
  saveCart();
}

function addToCart(id) {
  let product = products.find(p => p.id === id);
  // Check stock limit
  let inCart = cart.filter(c => c.id === id).length;
  if (inCart >= product.stock) {
    alert(`Only ${product.stock} left in stock!`);
    return;
  }
  cart.push(product);
  renderCart();
}

function removeFromCart(id) {
  let index = cart.findIndex(c => c.id === id);
  if (index > -1) cart.splice(index, 1);
  renderCart();
}

function checkout() {
  if (cart.length === 0) return alert("Cart empty!");
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  let phone = prompt(`Total: KES ${total}\nEnter M-Pesa number:`);
  if (!phone) return;
  alert(`STK Push sent to ${phone} for KES ${total}\nISANA Order Confirmed! 🎉`);
  cart = [];
  localStorage.removeItem("isana-cart");
  renderCart();

}

renderShop();
renderCart();