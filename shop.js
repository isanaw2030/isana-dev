let defaultProducts = [
  {id:1, name:"ISANA Classic Tee", category:"T-shirt", price:1200, stock:15, image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", description:"Classic"},
  {id:2, name:"ISANA Hoodie", category:"Hoodie", price:2500, stock:10, image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", description:"Hoodie"},
  {id:3, name:"ISANA Cap", category:"Cap", price:800, stock:20, image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", description:"Cap"},
  {id:4, name:"Cat Tee ORIGINAL", category:"Cat Tee", price:1800, stock:8, image:"https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=600", description:"Cat Tee"},
  {id:5, name:"ISANA Jogger Black", category:"Jogger", price:1800, stock:10, image:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600", description:"Black jogger - replace with your postimages link"}
];

// Clean any broken data once
let stored = localStorage.getItem('isana_products_final');
let products;
try {
  products = stored ? JSON.parse(stored) : null;
  if(!Array.isArray(products) || products.length < 5 || products.some(p=>!p.name||!p.price)) throw "bad";
} catch(e){
  products = defaultProducts;
  localStorage.setItem('isana_products_final', JSON.stringify(defaultProducts));
}

let cart = [];
try { cart = JSON.parse(localStorage.getItem('isana_cart')||'[]'); if(!Array.isArray(cart)) cart=[]; } catch(e){ cart=[]; }

let currentFilter = 'All';

function filterCat(cat){
  currentFilter = cat;
  document.querySelectorAll('.cat-btn').forEach(b=>{
    if(b.id === 'cat-'+cat){ b.classList.add('bg-black','text-white'); b.classList.remove('bg-white'); }
    else { b.classList.remove('bg-black','text-white'); b.classList.add('bg-white'); }
  });
  renderProducts();
}

function renderProducts(){
  const grid = document.getElementById('product-grid');
  const searchEl = document.getElementById('searchInput');
  if(!grid) return;
  let q = (searchEl ? searchEl.value : '').toLowerCase().trim();
  let filtered = products.filter(p=>{
    if(!p || !p.name) return false;
    let okCat = currentFilter==='All' || p.category===currentFilter;
    let okSearch = !q || p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q));
    return okCat && okSearch;
  });
  if(filtered.length===0){
    grid.innerHTML = `<p class="col-span-2 text-sm text-gray-500">No drip found. Try All.</p>`;
    return;
  }
  grid.innerHTML = filtered.map(p=>`
    <div class="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <img src="${p.image}" alt="${p.name}" class="w-full h-64 object-cover" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'">
      <div class="p-4">
        <h3 class="font-bold text-sm">${p.name}</h3>
        <p class="text-xs text-gray-500">${p.category} | Stock ${p.stock||10}</p>
        <div class="flex justify-between items-center mt-3">
          <span class="font-bold text-sm">KES ${p.price}</span>
          <button onclick="addToCart(${p.id})" class="bg-black text-white px-4 py-1.5 rounded-full text-xs">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id){
  let item = products.find(p=>p.id===id);
  if(!item) return;
  let ex = cart.find(c=>c.id===id);
  if(ex){ ex.qty = (ex.qty||1)+1; } else { cart.push({...item, qty:1}); }
  saveCart();
}

function saveCart(){
  localStorage.setItem('isana_cart', JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const el = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const c1 = document.getElementById('cart-count');
  const c2 = document.getElementById('cart-count-2');
  if(!el) return;
  if(cart.length===0){
    el.innerHTML = '<p class="text-xs text-gray-400">Cart empty. Add some drip.</p>';
  } else {
    el.innerHTML = cart.map(c=>{
      let qty = c.qty||1;
      let price = Number(c.price)||0;
      return `<div class="flex justify-between text-sm"><span>${c.name} x${qty}</span><span>KES ${price*qty}</span></div>`;
    }).join('');
  }
  let total = cart.reduce((s,c)=>s + (Number(c.price)||0)*(c.qty||1), 0);
  let count = cart.reduce((s,c)=>s + (c.qty||1), 0);
  if(totalEl) totalEl.textContent = total;
  if(c1) c1.textContent = count;
  if(c2) c2.textContent = count;
}

function clearCart(){
  cart=[];
  localStorage.removeItem('isana_cart');
  renderCart();
}

function checkout(){
  if(cart.length===0){ alert('Cart empty'); return; }
  let total = cart.reduce((s,c)=>s + (Number(c.price)||0)*(c.qty||1), 0);
  let msg = `ISANA ORDER - Bahati Drip%0A%0A`;
  cart.forEach(c=>{ msg+= `${c.name} x${c.qty||1} = KES ${(Number(c.price)||0)*(c.qty||1)}%0A`; });
  msg+= `%0ATotal: KES ${total}%0APay Till: 3232243%0ADelivery: Kisumu`;
  window.open(`https://wa.me/254700000000?text=${msg}`, '_blank');
}

function openAdmin(){ document.getElementById('admin-modal').classList.remove('hidden'); }
function closeAdmin(){ document.getElementById('admin-modal').classList.add('hidden'); }
function loginAdmin(){
  let pass = document.getElementById('admin-pass').value;
  if(pass==='isana2026'){
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    renderAdminList();
  } else { alert('Wrong password'); }
}
function addProduct(){
  let name = document.getElementById('p-name').value;
  let price = Number(document.getElementById('p-price').value);
  let image = document.getElementById('p-image').value;
  let cat = document.getElementById('p-category').value;
  let stock = Number(document.getElementById('p-stock').value)||10;
  if(!name||!price||!image){ alert('Fill all'); return; }
  let id = Date.now();
  products.push({id,name,price,image,category:cat,stock});
  localStorage.setItem('isana_products_final', JSON.stringify(products));
  renderProducts(); renderAdminList();
}
function renderAdminList(){
  let list = document.getElementById('admin-list');
  if(!list) return;
  list.innerHTML = products.map(p=>`<div class="text-xs flex justify-between"><span>${p.name} - KES ${p.price}</span><button onclick="deleteProduct(${p.id})" class="text-red-500">X</button></div>`).join('');
}
function deleteProduct(id){
  products = products.filter(p=>p.id!==id);
  localStorage.setItem('isana_products_final', JSON.stringify(products));
  renderProducts(); renderAdminList();
}

document.addEventListener('DOMContentLoaded', ()=>{ renderProducts(); renderCart(); });