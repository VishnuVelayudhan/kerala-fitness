document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleLogin = document.getElementById('toggle-login');
    const toggleSignup = document.getElementById('toggle-signup');
    const emailGroup = document.getElementById('email-group');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    let isLoginMode = true;

    // Toggle Mode
    const setMode = (login) => {
        isLoginMode = login;
        if (isLoginMode) {
            formTitle.textContent = 'Login';
            submitBtn.textContent = 'Login';
            emailGroup.classList.add('hidden');
            toggleLogin.classList.add('active');
            toggleSignup.classList.remove('active');
            emailInput.removeAttribute('required');
        } else {
            formTitle.textContent = 'Sign Up';
            submitBtn.textContent = 'Sign Up';
            emailGroup.classList.remove('hidden');
            toggleLogin.classList.remove('active');
            toggleSignup.classList.add('active');
            emailInput.setAttribute('required', 'true');
        }
        // Clear errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-group').forEach(el => el.classList.remove('error'));
    };

    toggleLogin.addEventListener('click', () => setMode(true));
    toggleSignup.addEventListener('click', () => setMode(false));

    // Password Toggle
    document.getElementById('toggle-password').addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    // Validation (Simplified for API integration)
    const showMessage = (msg, isError = true) => {
        alert(msg); // For now, using alert. Ideally invoke a toast or UI element.
    };

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;
        const email = emailInput.value;

        // Basic Client-side Validation
        if (!username || !password || (!isLoginMode && !email)) {
            showMessage("Please fill in all required fields.");
            return;
        }

        const endpoint = isLoginMode ? '/login' : '/signup';
        const payload = isLoginMode ? { username, password } : { username, email, password };

        const API_BASE = '';
        try {
            const response = await fetch(`${API_BASE}/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json(); // Parse JSON
                showMessage(data.message, false);

                if (!isLoginMode) {
                    // Switch to login after successful signup
                    setMode(true);
                    usernameInput.value = '';
                    passwordInput.value = '';
                    emailInput.value = '';
                } else {
                    // Login success logic
                    console.log("Logged in!", data.user);
                    // Store user info
                    localStorage.setItem('fitnessUser', JSON.stringify(data.user));

                    if (data.user.role === 'admin') {
                        const userStr = encodeURIComponent(JSON.stringify(data.user));
                        window.location.href = `https://kerala-fitness-admin-site.netlify.app/admin.html?user=${userStr}`;
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            } else {
                const text = await response.text();
                showMessage(text, true); // Error message from server
            }
        } catch (error) {
            showMessage("Network error: " + error.message);
        }
    });
});
