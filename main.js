// Helper to get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Helper to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the cart icon with the item count
function updateCartCount() {
    const cart = getCart();
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.item-count').textContent = itemCount;
}

// Add to Cart button logic
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const itemCard = button.closest('.grid-item');
        const productId = itemCard.getAttribute('data-id') || itemCard.querySelector('h3').textContent;
        const productName = itemCard.querySelector('h3').textContent;
        const priceText = itemCard.querySelector('.price').textContent.replace('$', '');
        const quantity = parseInt(itemCard.querySelector('input[type="number"]').value);

        if (quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const price = parseFloat(priceText);
        let cart = getCart();

        // Check if item already in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, name: productName, price: price, quantity: quantity });
        }

        saveCart(cart);
        updateCartCount();
        alert(`${quantity} x "${productName}" added to cart.`);
    });
});

// Initialize cart count on page load
updateCartCount();
