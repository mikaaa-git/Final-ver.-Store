//============= Product cart ============//
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let total = 0;

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || {};
    displayCart();
}

// Add quantity handling
function addProductToCart(productName, price) {
    // Get the quantity input value for the specific product
    const quantityInput = document.getElementById(`quantity-${productName.toLowerCase().replace(/\s/g, '-')}`);
    const quantity = parseInt(quantityInput.value, 10); // Get the value and ensure it's a number

    // Add the product with the selected quantity to the cart
    addToCart(productName, price, quantity);
}

function addToCart(productName, price, quantity) {
    console.log('addToCart called for:', productName);  // Add this line for debugging

    if (cart[productName]) {
        cart[productName].quantity += quantity;
        cart[productName].totalPrice = cart[productName].price * cart[productName].quantity;
    } else {
        cart[productName] = { price, quantity: quantity, totalPrice: price * quantity };
    }

    saveCart();
    displayCart();
}

function updateQuantity(productName, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) {
        alert("Quantity must be at least 1.");
        return;
    }

    if (cart[productName]) {
        const price = cart[productName].price;
        const oldQuantity = cart[productName].quantity;

        cart[productName].quantity = quantity;
        cart[productName].totalPrice = price * quantity;

        total += (quantity - oldQuantity) * price;

        saveCart();
        displayCart();
    }
}

function removeFromCart(productName) {
    delete cart[productName];
    saveCart();
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    total = 0; // Reset total for recalculation
    let itemCount = 0; // Initialize item count

    cartItems.innerHTML = ''; // Clear existing cart items

    for (const product in cart) {
        const item = cart[product];
        total += item.totalPrice;
        itemCount += item.quantity;

        const li = document.createElement('li');
        li.classList.add('list-group-item');

        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-right" style="width: 400px;">
                <div>
                    ${item.quantity} x ${product}
                </div>
            </div>
            <div class="d-flex align-items-right ml-auto" style="margin-left: 12px;">
                <input type='number' value='${item.quantity}'  min='1' onchange='updateQuantity("${product}", this.value)' >
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product}')">Remove</button>
            </div>
        `;


        cartItems.appendChild(li);
    }

    document.getElementById('total-price').textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
}


//============= Load Cart Page Load ============//
window.onload = loadCart;


//============= Product Filter ============//

// Function to update displayed price value
function updatePriceValue(value) {
    document.getElementById("priceValue").innerText = `$${value}`;
}

// Function to apply filters
function applyFilters() {
    const priceRange = document.getElementById("priceRange").value;
    const selectedBrands = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    // Logic to filter products based on selected brands and price range
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productPrice = parseFloat(product.querySelector('p').innerText.replace('$', ''));
        const productBrand = product.getAttribute('data-brand'); // Assuming each product has a data-brand attribute

        const priceCondition = productPrice <= priceRange;
        const brandCondition = selectedBrands.length === 0 || selectedBrands.includes(productBrand);

        if (priceCondition && brandCondition) {
            product.style.display = ''; // Show product
        } else {
            product.style.display = 'none'; // Hide product
        }
    });
}
function redirectToCheckout() {
    // Save the cart data to localStorage so it can be accessed on the checkout page
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirect to the checkout page
    window.location.href = 'checkout.html';
}

