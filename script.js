document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const adminView = document.getElementById('admin-view');
    const loginForm = document.getElementById('login-form');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const upgradeSection = document.getElementById('upgrade-section');
    const accountTypeBadge = document.getElementById('account-type');
    const displayName = document.getElementById('display-name');
    const premiumCards = document.querySelectorAll('.study-card.is-locked');
    const hiddenResources = document.getElementById('hidden-resources');
    const adminUsersTableBody = document.getElementById('admin-users-tbody');

    // --- Application State ---
    let state = {
        isLoggedIn: false,
        username: '',
        userRole: 'student', // 'student' or 'admin'
        isPremium: false
    };

    // --- Mock User Database (for admin to manage) ---
    let mockUsers = [
        { id: 1, username: 'john_doe', status: 'active', isPremium: true },
        { id: 2, username: 'jane_smith', status: 'active', isPremium: false },
        { id: 3, username: 'alex_wilson', status: 'active', isPremium: true },
        { id: 4, username: 'maria_garcia', status: 'active', isPremium: false },
        { id: 5, username: 'amit_patel', status: 'inactive', isPremium: false },
        { id: 6, username: 'sara_khan', status: 'active', isPremium: true },
    ];

    /**
     * Load user session from localStorage
     */
    const loadState = () => {
        const savedState = localStorage.getItem('gradeup_user_session');
        if (savedState) {
            state = JSON.parse(savedState);
            updateUI();
        }
    };

    /**
     * Save user session to localStorage
     */
    const saveState = () => {
        localStorage.setItem('gradeup_user_session', JSON.stringify(state));
    };

    /**
     * Check if login credentials match admin credentials
     * Admin secret is stored in a hidden input (client-side only)
     */
    const isAdminLogin = (username, password) => {
        const adminSecret = document.getElementById('admin-secret').value;
        // Simple client-side check: username is 'admin' and password matches the hidden secret
        return username.toLowerCase() === 'admin' && password === adminSecret;
    };

    /**
     * Render the admin user management table
     */
    const renderAdminUserTable = () => {
        adminUsersTableBody.innerHTML = '';
        
        mockUsers.forEach(user => {
            const row = document.createElement('tr');
            
            // Status Badge
            const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
            const statusText = user.status.charAt(0).toUpperCase() + user.status.slice(1);
            
            // Premium Badge
            const premiumClass = user.isPremium ? 'yes' : 'no';
            const premiumText = user.isPremium ? 'Yes' : 'No';
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td><span class="premium-badge ${premiumClass}">${premiumText}</span></td>
                <td>
                    <button class="admin-action-btn toggle-premium" data-user-id="${user.id}">
                        ${user.isPremium ? 'Remove Premium' : 'Grant Premium'}
                    </button>
                </td>
            `;
            
            adminUsersTableBody.appendChild(row);
        });

        // Add event listeners to toggle buttons
        document.querySelectorAll('.admin-action-btn.toggle-premium').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.getAttribute('data-user-id'));
                const user = mockUsers.find(u => u.id === userId);
                if (user) {
                    user.isPremium = !user.isPremium;
                    renderAdminUserTable(); // Re-render the table
                }
            });
        });
    };

    /**
     * Update UI based on current state
     * Shows/hides login, dashboard, or admin views
     */
    const updateUI = () => {
        if (!state.isLoggedIn) {
            // Not logged in - show login view
            loginView.classList.remove('hidden');
            dashboardView.classList.add('hidden');
            adminView.classList.add('hidden');
        } else if (state.userRole === 'admin') {
            // Admin logged in - show admin dashboard
            loginView.classList.add('hidden');
            dashboardView.classList.add('hidden');
            adminView.classList.remove('hidden');
            renderAdminUserTable();
        } else {
            // Student logged in - show student dashboard
            loginView.classList.add('hidden');
            adminView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            displayName.textContent = state.username;

            // Update premium content visibility
            if (state.isPremium) {
                upgradeSection.classList.add('hidden');
                hiddenResources.classList.remove('hidden');
                accountTypeBadge.classList.remove('hidden');
                premiumCards.forEach(card => card.classList.remove('is-locked'));
            } else {
                upgradeSection.classList.remove('hidden');
                hiddenResources.classList.add('hidden');
                accountTypeBadge.classList.add('hidden');
                premiumCards.forEach(card => card.classList.add('is-locked'));
            }
        }
    };

    // --- Event Handlers ---

    /**
     * Handle login form submission
     */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        // Check if this is an admin login
        if (isAdminLogin(usernameInput, passwordInput)) {
            // Admin login successful
            state.isLoggedIn = true;
            state.username = 'Admin';
            state.userRole = 'admin';
            state.isPremium = false;
        } else {
            // Regular student login (any username and password)
            state.isLoggedIn = true;
            state.username = usernameInput || 'Student';
            state.userRole = 'student';
            state.isPremium = false;
        }

        // Save state and update UI
        saveState();
        updateUI();

        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });

    /**
     * Handle student upgrade button
     */
    upgradeBtn.addEventListener('click', () => {
        const confirmUpgrade = confirm(
            "Would you like to upgrade to Premium for access to all resources?"
        );
        if (confirmUpgrade) {
            state.isPremium = true;
            saveState();
            updateUI();
            alert("Congratulations! You are now a Premium Member.");
        }
    });

    /**
     * Handle student logout
     */
    logoutBtn.addEventListener('click', () => {
        state = {
            isLoggedIn: false,
            username: '',
            userRole: 'student',
            isPremium: false
        };
        localStorage.removeItem('gradeup_user_session');
        updateUI();
    });

    /**
     * Handle admin logout
     */
    adminLogoutBtn.addEventListener('click', () => {
        state = {
            isLoggedIn: false,
            username: '',
            userRole: 'student',
            isPremium: false
        };
        localStorage.removeItem('gradeup_user_session');
        updateUI();
    });

    // --- Initialize App ---
    loadState();
});
