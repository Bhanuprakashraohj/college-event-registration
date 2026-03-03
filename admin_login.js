// Admin Login Handler

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    setupPasswordToggle();
});

/**
 * Setup login form submission
 */
function setupLoginForm() {
    const form = document.getElementById('adminLoginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        authenticateAdmin();
    });
}

/**
 * Setup password visibility toggle
 */
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('admin_password');

    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        this.innerHTML = type === 'password' ? 
            '<i class="fas fa-eye"></i>' : 
            '<i class="fas fa-eye-slash"></i>';
    });
}

/**
 * Authenticate admin credentials
 */
function authenticateAdmin() {
    const username = document.getElementById('admin_username').value;
    const password = document.getElementById('admin_password').value;

    // Validate inputs
    const usernameError = validator.validateUsername(username);
    if (usernameError) {
        validator.displayError('usernameFeedback', usernameError);
        return;
    } else {
        validator.displayError('usernameFeedback', '');
    }

    const passwordError = validator.validatePassword(password);
    if (passwordError) {
        validator.displayError('passwordFeedback', passwordError);
        return;
    } else {
        validator.displayError('passwordFeedback', '');
    }

    // Submit login request
    const loginBtn = document.querySelector('button[type="submit"]');
    const originalText = loginBtn.innerHTML;
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        // Store auth token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.admin_name || 'Admin');
        
        // Redirect to admin dashboard
        window.location.href = 'admin_dashboard.html';
    })
    .catch(error => {
        console.error('Error:', error);
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
        
        validator.showAlert('danger', error.message || 'Invalid credentials. Please try again.');
    });
}
