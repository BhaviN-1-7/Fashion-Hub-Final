// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoOM_93j3y21XGNRokjGOw1AK4_ViMX-I",
  authDomain: "fashionhublogin-b8400.firebaseapp.com",
  projectId: "fashionhublogin-b8400",
  storageBucket: "fashionhublogin-b8400.firebasestorage.app",
  messagingSenderId: "992338502871",
  appId: "1:992338502871:web:576b28211f5efe0f40bc92",
  measurementId: "G-BYYLHJ5FB0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmpty = document.getElementById('cart-empty');
const cartItemsTable = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const logoutBtn = document.getElementById('logout-btn');

// Check authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, load their cart
    loadCart();
    updateCartCount();
    
    // Setup logout button
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        window.location.href = 'login.html';
      });
    });
  } else {
    // No user is signed in, redirect to login
    window.location.href = 'login.html';
  }
});

// Load cart from Firestore
async function loadCart() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userCartRef = db.collection('userCarts').doc(user.uid);
    const doc = await userCartRef.get();
    
    if (doc.exists) {
      const cartItems = doc.data().items || [];
      displayCartItems(cartItems);
    } else {
      showEmptyCart();
    }
  } catch (error) {
    console.error('Error loading cart:', error);
    showEmptyCart();
  }
}

// Display cart items
function displayCartItems(items) {
  if (items.length === 0) {
    showEmptyCart();
    return;
  }

  cartItemsTable.innerHTML = '';
  let subtotal = 0;
  
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}">+</button>
        </div>
      </td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
      </td>
    `;
    cartItemsTable.appendChild(row);
  });

  const shipping = 5.00;
  const total = subtotal + shipping;
  
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
  
  cartEmpty.style.display = 'none';
  cartItemsContainer.style.display = 'block';
  
  addCartItemEventListeners();
}

function showEmptyCart() {
  cartEmpty.style.display = 'block';
  cartItemsContainer.style.display = 'none';
}

function addCartItemEventListeners() {
  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', async (e) => {
      await updateCartItemQuantity(parseInt(e.target.getAttribute('data-index')), -1);
    });
  });
  
  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', async (e) => {
      await updateCartItemQuantity(parseInt(e.target.getAttribute('data-index')), 1);
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', async (e) => {
      await removeCartItem(parseInt(e.target.getAttribute('data-index')));
    });
  });
}

async function updateCartItemQuantity(index, change) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userCartRef = db.collection('userCarts').doc(user.uid);
    const doc = await userCartRef.get();
    
    if (doc.exists) {
      const cartItems = doc.data().items || [];
      
      if (index >= 0 && index < cartItems.length) {
        cartItems[index].quantity += change;
        
        if (cartItems[index].quantity <= 0) {
          cartItems.splice(index, 1);
        }
        
        await userCartRef.update({ items: cartItems });
        loadCart();
        updateCartCount();
      }
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    alert('Error updating cart item');
  }
}

async function removeCartItem(index) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userCartRef = db.collection('userCarts').doc(user.uid);
    const doc = await userCartRef.get();
    
    if (doc.exists) {
      const cartItems = doc.data().items || [];
      
      if (index >= 0 && index < cartItems.length) {
        cartItems.splice(index, 1);
        await userCartRef.update({ items: cartItems });
        loadCart();
        updateCartCount();
      }
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    alert('Error removing cart item');
  }
}

async function updateCartCount() {
  const user = auth.currentUser;
  const cartCountElement = document.querySelector('.cart-count');
  
  if (!user) {
    if (cartCountElement) cartCountElement.textContent = '0';
    return;
  }

  try {
    const userCartRef = db.collection('userCarts').doc(user.uid);
    const doc = await userCartRef.get();
    
    if (doc.exists) {
      const cartItems = doc.data().items || [];
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      if (cartCountElement) cartCountElement.textContent = totalItems;
    } else {
      if (cartCountElement) cartCountElement.textContent = '0';
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
    if (cartCountElement) cartCountElement.textContent = '0';
  }
}

// Checkout button
document.getElementById('checkout-btn')?.addEventListener('click', () => {
  alert('Checkout functionality will be implemented here');
});