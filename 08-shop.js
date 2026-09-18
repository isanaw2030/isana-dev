let products = [
  { id: 1, name: "ISANA T-shirt", price: 1500, stock: 10, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
  { id: 2, name: "ISANA Hoodie", price: 2500, stock: 5, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
  { id: 3, name: "ISANA Watch", price: 3500, stock: 0, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
  { id: 4, name: "ISANA Cap", price: 800, stock: 20, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" }
];

let cart = JSON.parse(localStorage.getItem("isana-cart")) || [];

function saveCart(){ localStorage.setItem("isana-cart", JSON.stringify(cart)); }

function renderShop(){
  let shopDiv = document.getElementById("shop");
  shopDiv.innerHTML = "";
  products.forEach(p => {
    let btn = p.stock > 0
     ? `<button onclick="addToCart(${p.id})" class="w-full bg-black text-white py-2 rounded-full text-sm font-bold mt-2">Add to Cart — KES ${p.price}</button>`
      : `<button disabled class="w-full bg-gray-200 text-gray-500 py-2 rounded-full text-sm mt-2">Out of Stock</button>`;
    shopDiv.innerHTML += `
      <div class="bg-white p-3 rounded-2xl border border-gray-200 ${p.stock===0?'opacity-50':''}">
        <img src="${p.img}" class="w-full h-48 object-cover rounded-xl mb-3">
        <h3 class="font-bold">${p.name}</h3>
        <p class="text-xs text-gray-500">${p.stock>0?`In Stock (${p.stock})`:'OUT OF STOCK'}</p>
        ${btn}
      </div>
    `;
  });
}

function renderCart(){
  let cartDiv = document.getElementById("cart-items");
  let countSpan = document.getElementById("cart-count");
  let totalSpan = document.getElementById("cart-total");
  cartDiv.innerHTML = "";
  let total = 0, count = 0;
  let grouped = {};
  cart.forEach(item => {
    if(!grouped[item.id]) grouped[item.id] = {...item, qty:0};
    grouped[item.id].qty++;
  });
  Object.values(grouped).forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    cartDiv.innerHTML += `<div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
      <span>${item.name} <b>x${item.qty}</b></span>
      <span class="flex items-center gap-2">KES ${item.price*item.qty} <button onclick="removeFromCart(${item.id})" class="bg-red-500 text-white w-5 h-5 rounded-full text-xs">x</button></span>
    </div>`;
  });
  if(count===0) cartDiv.innerHTML = `<p class="text-gray-400">Your cart is empty. Add some drip.</p>`;
  countSpan.innerText = count;
  totalSpan.innerText = total;
  saveCart();
}

function addToCart(id){
  let product = products.find(p=>p.id===id);
  let inCart = cart.filter(c=>c.id===id).length;
  if(inCart >= product.stock) return alert(`Only ${product.stock} left!`);
  cart.push(product);
  renderCart();
}
function removeFromCart(id){
  let index = cart.findIndex(c=>c.id===id);
  if(index>-1) cart.splice(index,1);
  renderCart();
}
function clearAll(){
  cart = [];
  localStorage.removeItem("isana-cart");
  renderCart();
}
function checkout(){
  if(cart.length===0) return alert("Cart empty!");
  let total = cart.reduce((s,i)=>s+i.price,0);
  let phone = prompt(`Total: KES ${total}\nEnter M-Pesa number:`);
  if(!phone) return;
  alert(`STK Push sent to ${phone} for KES ${total}\nISANA Order Confirmed! 🎉`);
  clearAll();
}

renderShop();
renderCart();