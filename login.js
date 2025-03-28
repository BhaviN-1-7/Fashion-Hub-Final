document.addEventListener('DOMContentLoaded', () => {
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
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
  
    // DOM elements
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    const eyeOffIcon = togglePasswordBtn.querySelector('.eye-off-icon');
    const toggleSignup = document.getElementById('toggle-signup');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitBtn = document.getElementById('submit-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
  
    // State to track login or signup mode
    let isSignupMode = false;
  
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      eyeIcon.classList.toggle('hidden');
      eyeOffIcon.classList.toggle('hidden');
    });
  
    // Toggle between login and signup
    toggleSignup.addEventListener('click', (e) => {
      e.preventDefault();
      isSignupMode = !isSignupMode;
      if (isSignupMode) {
        formSubtitle.textContent = 'Create a new account';
        submitBtn.textContent = 'Sign Up';
        toggleSignup.textContent = 'Sign in';
        rememberMeCheckbox.parentElement.style.display = 'none'; // Hide "Remember me" in signup mode
      } else {
        formSubtitle.textContent = 'Sign in to your account';
        submitBtn.textContent = 'Sign In';
        toggleSignup.textContent = 'Sign up';
        rememberMeCheckbox.parentElement.style.display = 'flex'; // Show "Remember me" in login mode
      }
    });
  
    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rememberMe = rememberMeCheckbox.checked;
  
      console.log('Form submitted:', { email, password, rememberMe, isSignupMode });
  
      if (isSignupMode) {
        // Sign-up logic
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('Signed up:', user.email);
            alert('Sign up successful! Please sign in.');
            // Switch back to login mode
            isSignupMode = false;
            formSubtitle.textContent = 'Sign in to your account';
            submitBtn.textContent = 'Sign In';
            toggleSignup.textContent = 'Sign up';
            rememberMeCheckbox.parentElement.style.display = 'flex';
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Signup error:', errorCode, errorMessage);
            alert('Sign up failed: ' + errorMessage);
          });
      } else {
        // Login logic
        const persistence = rememberMe
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION;
  
        auth.setPersistence(persistence)
          .then(() => {
            return auth.signInWithEmailAndPassword(email, password);
          })
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('Logged in:', user.email);
            alert('Login successful!');
            window.location.href = 'home.html';
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorCode, errorMessage);
            alert('Login failed: ' + errorMessage);
          });
      }
    });
  
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is logged in:', user.email);
        window.location.href = 'home.html'; // Redirect if already logged in
      } else {
        console.log('No user is logged in');
      }
    });
  });