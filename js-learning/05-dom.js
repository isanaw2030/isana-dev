let products = [
  { id: 1, name: "ISANA T-shirt", price: 1500, stock: 10 },
  { id: 2, name: "ISANA Hoodie", price: 2500, stock: 5 },
  { id: 3, name: "ISANA Watch", price: 3500, stock: 0 },
  { id: 4, name: "ISANA Cap", price: 800, stock: 20 }
];

let shopDiv = document.getElementById("shop");

products.forEach(p => {
  let status = p.stock > 0 ? `In Stock (${p.stock})` : "OUT OF STOCK";
  let btn = p.stock > 0 ? `<button onclick="buy(${p.id})">Add to Cart - KES ${p.price}</button>` : `<button disabled>Out of Stock</button>`;
  
  shopDiv.innerHTML += `
    <div class="product ${p.stock === 0 ? 'out' : ''}">
      <h3>${p.name}</h3>
      <p>Price: KES ${p.price}</p>
      <p>${status}</p>
      ${btn}
    </div>
  `;
});

function buy(id) {
  let product = products.find(p => p.id === id);
  alert(`Added ${product.name} to cart! Total: KES ${product.price}`);
}
