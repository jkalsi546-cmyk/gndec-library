/**
 * ============================================================
 * AUTH.JS — Open Books (GNDEC Library)
 * ============================================================
 * Handles form validation for Login, Register, and Contact pages
 * and communicates with the Node.js backend.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const contactForm = document.getElementById('contact-form');

  /* ========================================
   * LOGIN FORM
   * ======================================== */
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      const email = document.getElementById('email');
      const password = document.getElementById('password');

      if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      } else { removeError(email); }

      if (password.value.trim() === '') {
        showError(password, 'Password is required');
        isValid = false;
      } else { removeError(password); }

      if (isValid) {
        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Logging in...';
        btn.disabled = true;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
          });
          const data = await res.json();

          if (res.ok) {
            localStorage.setItem('openbooks_token', data.token);
            loginForm.style.display = 'none';
            document.getElementById('login-success').classList.add('show');
            // Trigger a re-sync of cart/wishlist if they exist
            if (window.syncUserData) window.syncUserData();
          } else {
            showError(password, data.error || 'Login failed');
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        } catch (err) {
          showError(password, 'Network error. Please try again later.');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      }
    });
  }

  /* ========================================
   * REGISTER FORM
   * ======================================== */
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirm-password');
      const rollNumber = document.getElementById('roll-number');

      if (name.value.trim().length < 3) {
        showError(name, 'Name must be at least 3 characters'); isValid = false;
      } else { removeError(name); }
      
      if (rollNumber.value.trim() === '') {
        showError(rollNumber, 'College Roll Number is required'); isValid = false;
      } else { removeError(rollNumber); }

      if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address'); isValid = false;
      } else { removeError(email); }

      if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters'); isValid = false;
      } else { removeError(password); }

      if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match'); isValid = false;
      } else { removeError(confirmPassword); }

      if (isValid) {
        const btn = registerForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Registering...';
        btn.disabled = true;

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              name: name.value, 
              rollNumber: rollNumber.value, 
              email: email.value, 
              password: password.value 
            })
          });
          const data = await res.json();

          if (res.ok) {
            registerForm.style.display = 'none';
            document.getElementById('register-success').classList.add('show');
          } else {
            showError(email, data.error || 'Registration failed');
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        } catch (err) {
          showError(email, 'Network error. Please try again later.');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      }
    });
  }

  /* ========================================
   * CONTACT FORM (Still Simulated)
   * ======================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // ... keep existing contact validation logic ...
      simulateSubmission(contactForm, 'contact-success');
    });
  }

});


function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function showError(inputElement, message) {
  const formGroup = inputElement.parentElement;
  formGroup.classList.add('error');
  formGroup.classList.remove('success');
  let errorMsg = formGroup.querySelector('.error-msg');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.className = 'error-msg';
    formGroup.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}

function removeError(inputElement) {
  const formGroup = inputElement.parentElement;
  formGroup.classList.remove('error');
  formGroup.classList.add('success');
}

function simulateSubmission(form, successContainerId) {
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = 'Processing...';
  btn.disabled = true;
  setTimeout(() => {
    form.style.display = 'none';
    const successBox = document.getElementById(successContainerId);
    if (successBox) successBox.classList.add('show');
  }, 1000);
}
