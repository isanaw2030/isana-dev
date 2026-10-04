const SHOP_TILL = "3232243";
const OWNER_WHATSAPP = "254113662877"; 
const ADMIN_PASSWORD = "isana2026";

let currentFilter = 'All';

let defaultProducts = [
  [
  {
    "id": 1791109381589,
    "name": "T-shirt",
    "price": 1500,
    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    "category": "T-shirt",
    "stock": 13
  },
  {
    "id": 1791109466166,
    "name": "Hoodie",
    "price": 2500,
    "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    "category": "Hoodie",
    "stock": 2
  },
  {
    "id": 1791109548677,
    "name": "Cap",
    "price": 800,
    "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
    "category": "Cap",
    "stock": 97
  },
  {
    "id": 1791111193896,
    "name": "Cat Tee",
    "price": 1800,
    "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
    "category": "Cat Tee",
    "stock": 100
  },
  {
    "id": 1791111673137,
    "name": "ISANA jogger",
    "price": 1800,
    "image": "https://i.postimg.cc/GtRKw20V/image.png",
    "category": "Jogger",
    "stock": 10
  }
]
];

let products = JSON.parse(localStorage.getItem('isana_products_final')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('isana_cart')) || [];

function save(){ localStorage.setItem('isana_products_final', JSON.stringify(products)); localStorage.setItem('isana_cart', JSON.stringify(cart)); }

function renderProducts(){
  const grid = document.getElementById('product-grid');
  const search = document.getElementById('searchInput').value.toLowerCase();
  let filtered = products.filter(p => {
    let matchCat = currentFilter==='All' || p.category===currentFilter;
    let matchSearch = p.name.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });
  document.querySelectorAll('.cat-btn').forEach(b=>{ b.className='cat-btn bg-white border px-5 py-2.5 rounded-full text-xs'; });
  let active = document.getElementById('cat-'+currentFilter);
  if(active) active.className='cat-btn bg-black text-white px-5 py-2.5 rounded-full text-xs';

  let html='';
  for(let p of filtered){
    html+='<div class="bg-white border rounded-2xl overflow-hidden p-3"><img src="'+p.image+'" onerror="this.src=\'https://picsum.photos/seed/'+p.id+'/600/400\'" class="w-full h-56 object-cover rounded-xl"><div class="pt-3"><h3 class="font-bold text-sm">'+p.name+'</h3><p class="text-[10px] text-gray-500 uppercase">'+(p.stock>0?'In Stock ('+p.stock+')':'OUT OF STOCK')+' • '+p.category+' • ID '+p.id+'</p><button '+(p.stock===0?'disabled':'onclick="addToCart('+p.id+')"')+' class="mt-3 w-full '+(p.stock===0?'bg-gray-200 text-gray-400':'bg-black text-white')+' py-2.5 rounded-full text-xs font-bold">'+(p.stock===0?'Out of Stock':'Add to Cart — KES '+p.price)+'</button></div></div>';
  }
  grid.innerHTML=html||'<p class="text-sm text-gray-400">No drip found.</p>';
  renderAdminList(); updateCartUI();
}

function filterCat(cat){ currentFilter=cat; renderProducts(); }
function addToCart(id){
  let prod = products.find(p=>p.id===id);
  if(!prod || prod.stock<=0) return alert('Out of stock');
  cart.push(prod); save(); updateCartUI();
}
function updateCartUI(){
  document.getElementById('cart-count').innerText=cart.length;
  document.getElementById('cart-count-2').innerText=cart.length;
  let total=0; for(let c of cart) total+=c.price;
  document.getElementById('cart-total').innerText=total;
  let container=document.getElementById('cart-items');
  if(cart.length===0){ container.innerHTML='<p class="text-xs text-gray-400">Cart empty. Add some drip.</p>'; return; }
  let html=''; for(let i=0;i<cart.length;i++){ html+='<div class="flex justify-between text-xs border-b py-2"><span>'+cart[i].name+'</span><span>KES '+cart[i].price+' <button onclick="removeFromCart('+i+')" class="text-red-500 ml-2 font-bold">x</button></span></div>'; }
  container.innerHTML=html;
}
function removeFromCart(i){ cart.splice(i,1); save(); updateCartUI(); }
function clearCart(){ cart=[]; save(); updateCartUI(); }
function openAdmin(){ document.getElementById('admin-modal').classList.remove('hidden'); }
function closeAdmin(){ document.getElementById('admin-modal').classList.add('hidden'); }
function loginAdmin(){
  if(document.getElementById('admin-pass').value===ADMIN_PASSWORD){
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
  } else alert('Wrong password');
}
function addProduct(){
  let name=document.getElementById('p-name').value;
  let price=parseInt(document.getElementById('p-price').value);
  let image=document.getElementById('p-image').value || 'https://picsum.photos/seed/new'+Date.now()+'/600/400';
  let category=document.getElementById('p-category').value;
  let stock=parseInt(document.getElementById('p-stock').value)||10;
  if(!name||!price) return alert('Name and price required');
  products.push({id:Date.now(), name, price, image, category, stock});
  save(); renderProducts();
  document.getElementById('p-name').value=''; document.getElementById('p-price').value=''; document.getElementById('p-image').value='';
}
function renderAdminList(){
  let list=document.getElementById('admin-list'); if(!list) return;
  let html=''; for(let p of products){ html+='<div class="flex justify-between border-b py-1 text-xs"><span>'+p.name+' ('+p.stock+')</span><button onclick="deleteProduct('+p.id+')" class="text-red-500 font-bold">Delete</button></div>'; }
  list.innerHTML=html;
}
function deleteProduct(id){ if(!confirm('Delete this product?')) return; products=products.filter(p=>p.id!==id); save(); renderProducts(); }
function checkout(){
  if(cart.length===0) return alert('Cart empty');
  let name=prompt('Your full name:'); if(!name) return;
  let phone=prompt('M-Pesa phone:'); if(!phone) return;
  let orderId='ISANA-'+Date.now().toString().slice(-6);
  let total=0; for(let c of cart) total+=c.price;
  for(let item of cart){ let pr=products.find(p=>p.id===item.id); if(pr && pr.stock>0) pr.stock--; }
  save(); renderProducts();

  let w=window.open('', '_blank');
  let receiptHtml = '<html><head><title>Receipt '+orderId+'</title></head><body style="font-family:sans-serif;padding:24px;max-width:400px;margin:auto"><h2 style="border-bottom:2px solid #000;padding-bottom:8px">ISANA. BAHATI</h2><p><b>Official Receipt</b></p><p>Order: '+orderId+'</p><p>Customer: '+name+' ('+phone+')</p><p>Date: '+new Date().toLocaleString()+'</p><hr>';
  for(let c of cart) receiptHtml+='<p>'+c.name+' - KES '+c.price+'</p>';
  receiptHtml+='<hr><h3>TOTAL: KES '+total+'</h3><p>Till: '+SHOP_TILL+'</p><p style="font-size:12px;color:#666">Pay to Till '+SHOP_TILL+' or pay on delivery in Kisumu.</p><button onclick="window.print()" style="margin-top:12px;padding:10px 20px;background:#000;color:#fff;border-radius:20px;border:none;font-weight:bold">Print / Save as PDF</button></body></html>';
  w.document.write(receiptHtml); w.document.close();

  let itemsText=''; for(let c of cart) itemsText+=c.name+' - KES '+c.price+'%0A';
  let msg='NEW ORDER: '+orderId+'%0AName: '+name+'%0APhone: '+phone+'%0A%0A'+itemsText+'%0ATOTAL: KES '+total+'%0ATill: '+SHOP_TILL;
  window.open('https://wa.me/'+OWNER_WHATSAPP+'?text='+msg, '_blank');
  clearCart();
  alert('Order '+orderId+' created! Pay KES '+total+' to Till '+SHOP_TILL);
}
renderProducts(); updateCartUI();