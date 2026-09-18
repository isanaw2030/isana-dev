// Day 3 - Conditions for ISANA Shop

let productName = "ISANA Hoodie";
let price = 2500;
let stock = 0; 

function checkStock(product, stockCount) {
  if (stockCount > 0) {
    console.log(`${product} is In Stock (${stockCount} left) - Show Add to Cart`);
    return true;
  } else {
    console.log(`${product} is Out of Stock - Hide button`);
    return false;
  }
}

function canBuy(qty, stockCount) {
  if (qty <= stockCount) {
    let total = qty * price;
    console.log(`You can buy ${qty} - Total: KES ${total}`);
  } else if (stockCount > 0) {
    console.log(`Only ${stockCount} left, you asked for ${qty}`);
  } else {
    console.log(`Sorry, no stock left`);
  }
}

// TEST
checkStock(productName, stock);
canBuy(2, stock);
canBuy(10, stock);

// Now try: change stock = 0 and refresh