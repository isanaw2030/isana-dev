let defaultProducts = [
  { id: 1, name: "ISANA T-shirt", price: 1500, stock: 10, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", cat: "T-shirt" },
  { id: 2, name: "ISANA Hoodie", price: 2500, stock: 5, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", cat: "Hoodie" },
  { id: 3, name: "ISANA Watch", price: 3500, stock: 0, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", cat: "Watch" },
  { id: 4, name: "ISANA Cap", price: 800, stock: 20, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", cat: "Cap" },
  { id: 5, name: "ISANA Oversize T-shirt", price: 1800, stock: 8, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", cat: "T-shirt" }
];

let products = JSON.parse(localStorage.getItem("isana-products")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("isana-cart")) || [];
let activeCat = "all";
let searchText = "";
let isAdmin = false;

function saveProducts(){ localStorage.setItem("isana-products", JSON.stringify(products)); }
function saveCart(){ localStorage.setItem("isana-cart", JSON.stringify(cart)); }
function getGrouped(){
  let g={}; cart.forEach(i=>{ if(!g[i.id]) g[i.id]={...i,qty:0}; g[i.id].qty++; }); return g;
}

function renderShop(){
  let shopDiv = document.getElementById("shop"); shopDiv.innerHTML="";
  let filtered = products.filter(p=>{
    let matchCat = activeCat==="all" || p.cat===activeCat;
    let matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCat && matchSearch;
  });
  if(filtered.length===0) shopDiv.innerHTML=`<p class="col-span-2 text-gray-500 p-8 text-center bg-white rounded-2xl border">No drip for "${searchText}"</p>`;
  filtered.forEach(p=>{
    let btn = p.stock>0? `<button onclick="addToCart(${p.id})" class="w-full bg-black text-white py-2 rounded-full text-sm font-bold mt-2">Add to Cart — KES ${p.price}</button>` : `<button disabled class="w-full bg-gray-200 text-gray-500 py-2 rounded-full text-sm mt-2">Out of Stock</button>`;
    let adminBtns = isAdmin? `<div class="flex gap-1 mt-2"><button onclick="editPrice(${p.id})" class="text-[10px] border px-2 py-1 rounded-full">Edit Price</button><button onclick="deleteProduct(${p.id})" class="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full">Delete</button></div>` : ``;
    shopDiv.innerHTML+=`
      <div class="bg-white p-3 rounded-2xl border ${p.stock===0?'opacity-50':''}">
        <img src="${p.img}" class="w-full h-48 object-cover rounded-xl mb-3">
        <h3 class="font-bold">${p.name}</h3>
        <p class="text-xs text-gray-500">${p.stock>0?`In Stock (${p.stock}) • ${p.cat}`:'OUT OF STOCK'} • ID ${p.id}</p>
        ${btn} ${adminBtns}
      </div>`;
  });
}

function renderCart(){
  let cartDiv=document.getElementById("cart-items"), countSpan=document.getElementById("cart-count"), totalSpan=document.getElementById("cart-total");
  cartDiv.innerHTML=""; let total=0,count=0; let grouped=getGrouped();
  Object.values(grouped).forEach(item=>{
    total+=item.price*item.qty; count+=item.qty;
    cartDiv.innerHTML+=`<div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg"><span>${item.name} <b>x${item.qty}</b></span><span class="flex items-center gap-2">KES ${item.price*item.qty} <button onclick="removeFromCart(${item.id})" class="bg-red-500 text-white w-5 h-5 rounded-full text-xs">x</button></span></div>`;
  });
  if(count===0) cartDiv.innerHTML=`<p class="text-gray-400">Cart empty. Add some drip.</p>`;
  countSpan.innerText=count; totalSpan.innerText=total; saveCart();
}

function addToCart(id){
  let product=products.find(p=>p.id===id);
  let inCart=cart.filter(c=>c.id===id).length;
  if(inCart>=product.stock) return alert(`Only ${product.stock} left!`);
  cart.push(product); renderCart();
}
function removeFromCart(id){ let idx=cart.findIndex(c=>c.id===id); if(idx>-1) cart.splice(idx,1); renderCart(); }
function clearAll(){ cart=[]; localStorage.removeItem("isana-cart"); renderCart(); }
function filterBy(cat){ activeCat=cat; renderShop(); }
function filterShop(){ searchText=document.getElementById("search").value; renderShop(); }

function toggleAdmin(){
  if(!isAdmin){
    let pass = prompt("Admin password? (hint: isana2026)");
    if(pass!=="isana2026") return alert("Wrong password");
    isAdmin=true; document.getElementById("adminPanel").classList.remove("hidden"); document.getElementById("adminBtn").innerText="Exit Admin"; document.getElementById("adminBtn").classList.add("bg-black","text-white");
  } else {
    isAdmin=false; document.getElementById("adminPanel").classList.add("hidden"); document.getElementById("adminBtn").innerText="Admin Login"; document.getElementById("adminBtn").classList.remove("bg-black","text-white");
  }
  renderShop();
}

function addProduct(){
  let name=document.getElementById("a_name").value.trim();
  let price=parseInt(document.getElementById("a_price").value);
  let stock=parseInt(document.getElementById("a_stock").value);
  let cat=document.getElementById("a_cat").value;
  let img=document.getElementById("a_img").value.trim() || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";
  if(!name||!price||isNaN(stock)) return alert("Fill name, price, stock");
  let newId = products.length>0? Math.max(...products.map(p=>p.id))+1 : 1;
  products.push({id:newId,name,price,stock,img,cat});
  saveProducts(); renderShop();
  document.getElementById("a_name").value=""; document.getElementById("a_price").value=""; document.getElementById("a_stock").value=""; document.getElementById("a_img").value="";
  alert(name+" added!");
}
function deleteProduct(id){
  if(!confirm("Delete this product?")) return;
  products=products.filter(p=>p.id!==id); saveProducts(); renderShop();
}
function editPrice(id){
  let p=products.find(x=>x.id===id);
  let newPrice=prompt(`New price for ${p.name}:`, p.price);
  if(!newPrice) return; p.price=parseInt(newPrice); saveProducts(); renderShop(); renderCart();
}
function resetShop(){
  if(!confirm("Reset to default 5 products?")) return;
  localStorage.removeItem("isana-products"); products=[...defaultProducts]; saveProducts(); renderShop();
}
function checkout(){
  if(cart.length===0) return alert("Cart empty!");
  let grouped=getGrouped(); let total=Object.values(grouped).reduce((s,i)=>s+i.price*i.qty,0);
  let msg=`Habari ISANA! Nataka kuorder:\n\n`;
  Object.values(grouped).forEach(i=>{ msg+=`• ${i.name} x${i.qty} = KES ${i.price*i.qty}\n`; });
  msg+=`\nJumla: KES ${total}\nNimeona kwa: ${location.href}\nM-Pesa? Niko tayari kulipa.`;
  let phone="254113662877"; // 
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  clearAll();
}

renderShop(); renderCart();