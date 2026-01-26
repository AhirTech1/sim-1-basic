document.addEventListener('DOMContentLoaded', () => {
    // --- constants & state ---
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const upgradeSection = document.getElementById('upgrade-section');
    const hiddenResources = document.getElementById('hidden-resources');
    const accountTypeBadge = document.getElementById('account-type');
    const displayName = document.getElementById('display-name');
    const premiumCards = document.querySelectorAll('.study-card.is-locked');

    let state = {
        isLoggedIn: false,
        username: '',
        isPremium: false
    };

    // --- init logic ---
    const loadState = () => {
        const savedState = localStorage.getItem('gradeup_user_session');
        if (savedState) {
            state = JSON.parse(savedState);
            updateUI();
        }
    };

    const saveState = () => {
        localStorage.setItem('gradeup_user_session', JSON.stringify(state));
    };

    // --- UI Update Logic ---
    const updateUI = () => {
        if (state.isLoggedIn) {
            loginView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            displayName.textContent = state.username;

            if (state.isPremium) {
                // Unlock premium content
                upgradeSection.classList.add('hidden');
                hiddenResources.classList.remove('hidden');
                accountTypeBadge.classList.remove('hidden');
                premiumCards.forEach(card => card.classList.remove('is-locked'));
            } else {
                // Lock premium content
                upgradeSection.classList.remove('hidden');
                hiddenResources.classList.add('hidden');
                accountTypeBadge.classList.add('hidden');
                premiumCards.forEach(card => card.classList.add('is-locked'));
            }
        } else {
            loginView.classList.remove('hidden');
            dashboardView.classList.add('hidden');
        }
    };

    // --- Handlers ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        
        state.isLoggedIn = true;
        state.username = usernameInput.value || 'Student';
        state.isPremium = false; // Default for new login
        
        saveState();
        updateUI();
    });

    upgradeBtn.addEventListener('click', () => {
        // Mock upgrade process
        const confirmUpgrade = confirm("Would you like to upgrade to Premium for access to all resources?");
        if (confirmUpgrade) {
            state.isPremium = true;
            saveState();
            updateUI();
            alert("Congratulations! You are now a Premium Member.");
        }
    });

    logoutBtn.addEventListener('click', () => {
        state = { isLoggedIn: false, username: '', isPremium: false };
        localStorage.removeItem('gradeup_user_session');
        updateUI();
    });

    // Run on start
    loadState();
});
