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
  
  // Cart functions
  async function addToCart(itemName, price) {
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to add items to cart');
      window.location.href = 'login.html';
      return;
    }
  
    try {
      const userCartRef = db.collection('userCarts').doc(user.uid);
      const doc = await userCartRef.get();
      
      let cartItems = [];
      if (doc.exists) {
        cartItems = doc.data().items || [];
      }
  
      const existingItem = cartItems.find(item => item.name === itemName);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ name: itemName, price: price, quantity: 1 });
      }
  
      await userCartRef.set({ items: cartItems });
      updateCartCount();
      
      const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
      myModal.show();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart');
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
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        updateCartCount();
        document.getElementById('logout-btn').addEventListener('click', (e) => {
          e.preventDefault();
          auth.signOut().then(() => {
            window.location.href = 'login.html';
          });
        });
      } else {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) cartCountElement.textContent = '0';
      }
    });
  
    // Navbar toggle
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
  
    if (bar) {
      bar.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }
  
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !bar.contains(event.target)) {
        nav.classList.remove('active');
      }
    });
  });