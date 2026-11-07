document.addEventListener('DOMContentLoaded', () => {
    const userListContainer = document.getElementById('user-list');
    const editModal = document.getElementById('edit-modal');
    const historyModal = document.getElementById('history-modal');
    const editForm = document.getElementById('edit-user-form');
    const logoutBtn = document.getElementById('logout-btn');
    const closeModals = document.querySelectorAll('.close-modal');

    // Check if auth passed via URL
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    if (userParam) {
        localStorage.setItem('fitnessUser', userParam);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if admin is logged in
    const currentUser = JSON.parse(localStorage.getItem('fitnessUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access Denied. Admins only.');
        window.location.href = 'https://kerala-fitness-main-site.netlify.app/login.html';
        return;
    }

    const API_BASE = 'https://kerala-fitness-main-site.netlify.app';

    // --- Fetch and Display Users ---
    async function fetchUsers() {
        try {
            const response = await fetch(`${API_BASE}/api/admin/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error(error);
            userListContainer.innerHTML = '<p>Error loading users.</p>';
        }
    }

    function renderUsers(users) {
        userListContainer.innerHTML = '';
        users.forEach(user => {
            // Skip admin user in list (optional, but good practice)
            if (user.username === 'admin') return;

            const card = document.createElement('div');
            card.classList.add('user-card');
            card.innerHTML = `
                <h3>${user.username}</h3>
                <p>Email: ${user.email}</p>
                <div class="btn-group">
                    <button class="btn-small btn-view" onclick="viewHistory(${user.id}, '${user.username}')">View History</button>
                    <button class="btn-small btn-edit" onclick="openEditModal(${user.id}, '${user.username}')">Edit</button>
                </div>
            `;
            userListContainer.appendChild(card);
        });
    }

    // --- History Logic ---
    window.viewHistory = async (userId, username) => {
        document.getElementById('history-title').textContent = `${username}'s History`;
        const tbody = document.getElementById('history-body');
        tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

        historyModal.style.display = 'block';

        try {
            const response = await fetch(`${API_BASE}/api/admin/history/${userId}`);
            const history = await response.json();

            tbody.innerHTML = '';
            if (history.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No history found.</td></tr>';
                return;
            }

            history.forEach(record => {
                const row = `
                    <tr>
                        <td>${new Date(record.date).toLocaleDateString()}</td>
                        <td>${record.weight}</td>
                        <td>${record.height}</td>
                        <td>${record.bmi_value}</td>
                        <td>${record.goal || '-'}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="5">Error loading history.</td></tr>';
        }
    };

    // --- Edit User Logic ---
    window.openEditModal = (id, username) => {
        document.getElementById('edit-user-id').value = id;
        document.getElementById('edit-username').value = username;
        document.getElementById('edit-password').value = ''; // Clear password field
        editModal.style.display = 'block';
    };

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-user-id').value;
        const username = document.getElementById('edit-username').value;
        const password = document.getElementById('edit-password').value;

        const payload = { username };
        if (password) payload.password = password;

        try {
            const response = await fetch(`${API_BASE}/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('User updated successfully');
                editModal.style.display = 'none';
                fetchUsers(); // Refresh list
            } else {
                const msg = await response.text();
                alert('Error: ' + msg);
            }
        } catch (error) {
            alert('Network error');
        }
    });

    // --- Modal Closing ---
    closeModals.forEach(span => {
        span.onclick = function () {
            editModal.style.display = "none";
            historyModal.style.display = "none";
        }
    });

    window.onclick = function (event) {
        if (event.target == editModal) editModal.style.display = "none";
        if (event.target == historyModal) historyModal.style.display = "none";
    }

    // --- Logout ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('fitnessUser');
        window.location.href = 'https://kerala-fitness-main-site.netlify.app/login.html';
    });

    // Initialize
    fetchUsers();
});
