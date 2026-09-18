// Day 4 - Arrays & Objects - ISANA Shop Catalog

let products = [
  { id: 1, name: "ISANA T-shirt", price: 1500, stock: 10 },
  { id: 2, name: "ISANA Hoodie", price: 2500, stock: 5 },
  { id: 3, name: "ISANA Watch", price: 3500, stock: 0 },
  { id: 4, name: "ISANA Cap", price: 800, stock: 20 }
];

console.log(`We have ${products.length} products in ISANA Shop`);

// Loop through all products
for (let i = 0; i < products.length; i++) {
  let p = products[i];
  let status = p.stock > 0 ? `In Stock (${p.stock})` : "OUT OF STOCK";
  console.log(`${p.id}. ${p.name} - KES ${p.price} - ${status}`);
}

// Calculate total value of inventory
let totalValue = 0;
for (let p of products) {
  totalValue += p.price * p.stock;
}
console.log(`Total inventory value: KES ${totalValue}`);

// Filter only in-stock
let inStock = products.filter(p => p.stock > 0);
console.log("Available to buy:", inStock.length, "products");