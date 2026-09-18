let products = [
  { id: 1, name: "ISANA T-shirt", price: 1500, stock: 10 },
  { id: 2, name: "ISANA Hoodie", price: 2500, stock: 5 },
  { id: 3, name: "ISANA Watch", price: 3500, stock: 0 },
  { id: 4, name: "ISANA Cap", price: 800, stock: 20 }
];

let cart = [];
let total = 0;

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
        <p>KES ${p.price} - ${p.stock > 0 ? `In Stock (${p.stock})` : 'OUT OF STOCK'}</p>
        ${btn}
      </div>
    `;
  });
}

function addToCart(id) {
  let product = products.find(p => p.id === id);
  cart.push(product);
  total += product.price;
  document.getElementById("cart-count").innerText = cart.length;
  document.getElementById("cart-total").innerText = total;
  document.getElementById("cart-items").innerHTML += `<p>${product.name} - KES ${product.price}</p>`;
}

renderShop();