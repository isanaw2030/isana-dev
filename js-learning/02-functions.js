function calculateTotal(price, qty){
    return price * qty;
}

function discountedPrice(price, discountedPercent){
    return price - (price * discountedPercent / 100);
}

let total = calculateTotal(1500, 2);
console.log(`Total: ${total}`);
console.log(`After 10% discount: ${discountedPrice(total, 10)}`);
