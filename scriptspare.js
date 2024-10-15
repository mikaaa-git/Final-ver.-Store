let cart = {};
let total = 0;

function addToCart(productName, price) {
    if (cart[productName]) {
        // If product already in cart, increase quantity
        cart[productName].quantity += 1;
        cart[productName].totalPrice += price;
    } else {
        // If product not in cart, add it
        cart[productName] = { price, quantity: 1, totalPrice: price };
    }
    
    displayCart();
}



function updateQuantity(productName, quantity) {
   if (quantity <= 0) {
       removeFromCart(productName);
   } else if (cart[productName]) {
       const price = cart[productName].price;
       const oldQuantity = cart[productName].quantity;

       // Update total price based on new quantity
       cart[productName].quantity = parseInt(quantity);
       cart[productName].totalPrice = price * cart[productName].quantity;

       // Update total amount
       total += (cart[productName].quantity - oldQuantity) * price;

       displayCart();
   }
}

function removeFromCart(productName) {
    delete cart[productName];
    
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    
    cartItems.innerHTML = '';
    total = 0; // Reset total for recalculation
    let itemCount = 0; // Initialize item count
 
    for (const product in cart) {
        const item = cart[product];
        total += item.totalPrice;
        itemCount += item.quantity; // Update item count
 
        const li = document.createElement('li');
        li.classList.add('list-group-item'); // Add Bootstrap class for styling
        
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span>${item.quantity} x ${product} - $${item.totalPrice.toFixed(2)}</span>
                <div class="d-flex align-items-right ms-auto"> <!-- Added ms-auto for right alignment -->
                    <input type='number' value='${item.quantity}' min='1' onchange='updateQuantity("${product}", this.value)' style="width: 60px; margin-right: 10px;">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product}')">Remove</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(li);
    }
 
    document.getElementById('total-price').textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = itemCount; // Update cart count to reflect total items
 }
