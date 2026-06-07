function showAdminMessage(message, type = 'success') {
    const el = document.getElementById('admin-message');
    if (!el) return;
    el.textContent = message;
    el.className = `admin-message ${type}`;
    setTimeout(() => {
        el.className = 'admin-message hidden';
    }, 4000);
}

function askAddTournament() {
    const name = prompt('Enter the tournament name:');
    if (!name) return;

    const is2v2 = confirm('Click OK for 2v2, Cancel for Solo.');
    const type = is2v2 ? '2v2' : 'Solo';

    fetch('/admin/tournaments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, status: 'OPEN' })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            showAdminMessage(data.message || 'Unable to add tournament.', 'error');
            return;
        }
        addTournamentRow(data.tournament || { name, type, status: 'OPEN' });
        showAdminMessage(`Tournament created: ${name} (${type})`, 'success');
    })
    .catch(() => showAdminMessage('Unable to add the tournament.', 'error'));
}

function deleteItem(id) {
    if (!confirm('Remove this tournament?')) return;
    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    if (typeof id === 'string' && (id.startsWith('sample-') || id.startsWith('new-'))) {
        row.remove();
        return;
    }

    fetch(`/admin/tournaments/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                return alert(data.message || 'Unable to remove tournament.');
            }
            row.remove();
        })
        .catch(() => alert('Unable to remove the tournament.'));
}

function addTournamentRow(tournament) {
    const table = document.getElementById('tournament-list');
    const safeId = tournament._id || tournament.id || `new-${Date.now()}`;
    const row = document.createElement('tr');
    const statusClass = (tournament.status || 'CLOSED').toUpperCase() === 'OPEN' ? 'open' : 'closed';

    row.id = `row-${safeId}`;
    row.innerHTML = `
        <td><strong id="name-${safeId}">${tournament.name}</strong></td>
        <td>${tournament.type || '2v2'}</td>
        <td>
            <span class="badge ${statusClass}" id="status-${safeId}">${(tournament.status || 'CLOSED').toUpperCase()}</span>
            <button id="status-btn-${safeId}" class="status-toggle ${(tournament.status || 'CLOSED').toUpperCase() === 'OPEN' ? 'close' : 'open'}" onclick="toggleStatus('${safeId}')">
                ${(tournament.status || 'CLOSED').toUpperCase() === 'OPEN' ? 'Close' : 'Open'}
            </button>
        </td>
        <td>${tournament.registrations || 0}</td>
        <td>
            <div class="btn-group">
                <button class="btn-edit" onclick="editName('${safeId}')">Edit</button>
                <button class="btn-primary" onclick="window.location.href='/admin/tree-editor?tournamentId=${safeId}'">Edit Tree</button>
                <button class="btn-danger" onclick="deleteItem('${safeId}')">Remove</button>
            </div>
        </td>
    `;
    table.appendChild(row);
}

function editName(id) {
    const nameElement = document.getElementById(`name-${id}`);
    if (!nameElement) return alert('Tournament not found.');

    const newName = prompt('Enter new name:', nameElement.innerText);
    if (!newName) return;

    nameElement.innerText = newName;

    if (typeof id === 'string' && (id.startsWith('sample-') || id.startsWith('new-'))) {
        return;
    }

    fetch(`/admin/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            showAdminMessage(data.message || 'Unable to update tournament.', 'error');
            return;
        }
        showAdminMessage('Tournament updated successfully.', 'success');
    })
    .catch(() => showAdminMessage('Unable to update the tournament.', 'error'));
}
function toggleStatus(id) {
    const statusEl = document.getElementById(`status-${id}`);
    const statusBtn = document.getElementById(`status-btn-${id}`);
    if (!statusEl || !statusBtn) return;

    const currentStatus = statusEl.innerText.trim();
    const nextStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    // Optimistically update UI
    statusEl.innerText = nextStatus;
    statusEl.className = `badge ${nextStatus === 'OPEN' ? 'open' : 'closed'}`;
    statusBtn.innerText = nextStatus === 'OPEN' ? 'Close' : 'Open';
    statusBtn.className = `status-toggle ${nextStatus === 'OPEN' ? 'close' : 'open'}`;

    // Only attempt server update for valid Mongo ObjectId strings
    const isValidObjectId = (val) => /^[a-fA-F0-9]{24}$/.test(val);
    if (typeof id === 'string' && (id.startsWith('sample-') || id.startsWith('new-') || !isValidObjectId(id))) {
        // Skip server call for sample/new/non-ObjectId ids — keep UI change only
        return;
    }

    // Persist change to server; on failure, revert UI silently (no red banner)
    const prevStatus = currentStatus;
    fetch(`/admin/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            // revert UI
            statusEl.innerText = prevStatus;
            statusEl.className = `badge ${prevStatus === 'OPEN' ? 'open' : 'closed'}`;
            statusBtn.innerText = prevStatus === 'OPEN' ? 'Close' : 'Open';
            statusBtn.className = `status-toggle ${prevStatus === 'OPEN' ? 'close' : 'open'}`;
            console.warn('Status update failed:', data.message || 'unknown');
        }
    })
    .catch(err => {
        statusEl.innerText = prevStatus;
        statusEl.className = `badge ${prevStatus === 'OPEN' ? 'open' : 'closed'}`;
        statusBtn.innerText = prevStatus === 'OPEN' ? 'Close' : 'Open';
        statusBtn.className = `status-toggle ${prevStatus === 'OPEN' ? 'close' : 'open'}`;
        console.error('Status update error:', err);
    });
}

function updatePoints() {
    const pts = document.getElementById('point-amount').value;
    if (!pts || pts <= 0) return alert("Enter valid points");
    alert("Points updated successfully!");
}

function initApprovalButtons() {
    document.querySelectorAll('.approval-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const isApproved = btn.dataset.approved === 'true';
            processApproval(btn, isApproved);
        });
    });
}

document.addEventListener('DOMContentLoaded', initApprovalButtons);

function processApproval(btn, isApproved) {
    const card = btn.closest('.approval-card');
    if (confirm(`Confirm ${isApproved ? 'Approval' : 'Rejection'}?`)) {
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 300);
    }
}