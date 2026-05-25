let tournamentCount = 1;

// --- MODAL HELPERS ---
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// --- TOURNAMENT ACTIONS ---
function openAddModal() { openModal('addModal'); }

function addTournament() {
    const name = document.getElementById('add-name').value;
    const status = document.getElementById('add-status').value;
    if (!name) return alert("Please enter a name");

    tournamentCount++;
    const row = document.createElement('tr');
    row.id = `row-${tournamentCount}`;
    row.innerHTML = `
        <td><strong id="name-${tournamentCount}">${name}</strong></td>
        <td><span class="badge ${status.toLowerCase()}" id="status-${tournamentCount}">${status}</span></td>
        <td>
            <button class="btn-edit" onclick="openEditModal(${tournamentCount})">Edit</button>
            <button class="btn-danger" onclick="deleteItem('row-${tournamentCount}')">Remove</button>
        </td>
    `;
    document.getElementById('tournament-list').appendChild(row);
    document.getElementById('add-name').value = '';
    closeModal('addModal');
}

function openEditModal(id) {
    openModal('editModal');
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = document.getElementById('name-' + id).innerText;
    document.getElementById('edit-status').value = document.getElementById('status-' + id).innerText;
}

function saveEdit() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const status = document.getElementById('edit-status').value;

    document.getElementById('name-' + id).innerText = name;
    const badge = document.getElementById('status-' + id);
    badge.innerText = status;
    badge.className = 'badge ' + status.toLowerCase();
    closeModal('editModal');
}

function deleteItem(id) { if(confirm("Confirm removal?")) document.getElementById(id).remove(); }

// --- OTHER ACTIONS ---
function updatePoints() {
    const pts = document.getElementById('point-amount').value;
    alert(`Successfully added ${pts} points!`);
}

function processApproval(btn, ok) {
    alert(ok ? "Team Approved!" : "Team Rejected.");
    btn.closest('.approval-card').remove();
}