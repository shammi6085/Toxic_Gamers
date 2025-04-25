// Load cart items and favourites from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

const cartTableBody = document.querySelector("#cart-table tbody");
const totalPriceEl = document.getElementById("total-price");

// Save current cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Render the cart table
function renderCart() {
    cartTableBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(row);
    });

    totalPriceEl.textContent = `$${total.toFixed(2)}`;
    saveCart();
}

// Adjust quantity with plus/minus buttons
function updateQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;

        // Remove item if quantity drops to 0 or less
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        renderCart();
    }
}

// Clear the cart
document.getElementById("clear-cart").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the cart?")) {
        cart = [];
        renderCart();
    }
});

// Save current cart items (with quantity > 0) to favourites — use clones to avoid shared references
document.getElementById("addToFavourites").addEventListener("click", () => {
    favourites = cart
        .filter(item => item.quantity > 0)
        .map(item => ({ ...item })); // clone objects
    localStorage.setItem("favourites", JSON.stringify(favourites));
    alert("Cart saved to favourites!");
});

// Apply favourites to cart — use clones to avoid shared references
document.getElementById("applyFavourites").addEventListener("click", () => {
    cart = favourites.map(item => ({ ...item }));
    renderCart();
    alert("Favourites applied to cart!");
});

// Initial render on page load
renderCart();

// Existing code ...

// Handle "Proceed to Checkout" click
document.querySelector(".checkout-button").addEventListener("click", function (e) {
    if (cart.length === 0) {
        e.preventDefault();
        document.getElementById("checkout-error").classList.remove("hidden");
        setTimeout(() => {
            document.getElementById("checkout-error").classList.add("hidden");
        }, 3000);
    }
});
