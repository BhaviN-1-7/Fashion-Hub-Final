// Retrieve cart items from localStorage or initialize an empty array
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function addToCart(itemName, price) {
    // Check if the item already exists in the cart
    let existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: itemName, price: price, quantity: 1 });
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update the cart modal
    updateCartModal();
    
    // Update the cart count
    updateCartCount();

    // Show Bootstrap modal programmatically
    let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
}

function updateCartCount() {
    // Calculate total quantity
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Update the cart count element
    const cartCountElement = document.querySelector('.cart-count'); // Adjust selector as needed
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Initialize cart count when page loads
document.addEventListener('DOMContentLoaded', updateCartCount);

const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');

if(bar) {
    bar.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !bar.contains(event.target)) {
        nav.classList.remove('active');
    }
});
