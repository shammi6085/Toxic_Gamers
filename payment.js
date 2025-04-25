document.addEventListener("DOMContentLoaded", () => {
    const orderReview = document.getElementById("orderReview");
    const form = document.getElementById("paymentForm");
    const thankYouMessage = document.getElementById("thankYouMessage");
    const confirmationEmail = document.getElementById("confirmationEmail");
    const deliveryDate = document.getElementById("deliveryDate");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const deliveryFee = 4.99;

    function renderOrderReview() {
        if (cart.length === 0) {
            orderReview.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        let subtotal = 0;
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => {
                    const itemSubtotal = item.price * item.quantity;
                    subtotal += itemSubtotal;
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>$${itemSubtotal.toFixed(2)}</td>
                        </tr>
                    `;
                }).join("")}
                <tr>
                    <td colspan="3" class="delivery-label"><strong>Delivery Fee:</strong></td>
                    <td><strong>$${deliveryFee.toFixed(2)}</strong></td>
                </tr>
                <tr>
                    <td colspan="3" class="total-label"><strong>Total:</strong></td>
                    <td><strong>$${(subtotal + deliveryFee).toFixed(2)}</strong></td>
                </tr>
            </tbody>
        `;
        orderReview.appendChild(table);
    }

    renderOrderReview();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            alert("Please fill out the form correctly.");
            return;
        }

        const email = document.getElementById("email").value;

        // Hide the form and customer details section
        form.classList.add("hidden");
        document.querySelector(".customer-details").classList.add("hidden");

        // Show thank you message
        thankYouMessage.classList.remove("hidden");
        confirmationEmail.textContent = email;

        // Estimated delivery in 5-7 days
        const delivery = new Date();
        delivery.setDate(delivery.getDate() + 5);
        deliveryDate.textContent = `Expected delivery date: ${delivery.toDateString()}`;

        // Clear cart
        localStorage.removeItem("cart");
    });

    // Format card number input as ####-####-####-####
    const cardNumberInput = document.getElementById("cardNumber");
    cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.slice(0, 16);
        value = value.match(/.{1,4}/g)?.join("-") || value;
        e.target.value = value;
    });

    // Format expiry date input as MM/YY with validation
    const expiryInput = document.getElementById("expiry");
    expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);

        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }
        e.target.value = value;
    });

    // Enforce valid month on blur
    expiryInput.addEventListener("blur", () => {
        const value = expiryInput.value;
        const [month, year] = value.split("/");

        if (!month || !year || +month < 1 || +month > 12 || year.length !== 2) {
            expiryInput.focus();
        }
    });

    // Limit CVV to 3 digits
    const cvvInput = document.getElementById("cvv");
    cvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
    });
});
