function toggleReg(id) {
    const btn = document.getElementById(`reg-btn-${id}`);
    const status = document.getElementById(`status-${id}`);
    const isNowOpen = btn.innerText === "Open";
    btn.innerText = isNowOpen ? "Close" : "Open";
    status.innerText = isNowOpen ? "OPEN" : "CLOSED";
    status.className = isNowOpen ? "badge open" : "badge closed";
}

function deleteItem(id) { if(confirm("Remove?")) document.getElementById(id).remove(); }

function editName(id) { 
    const newName = prompt("Enter new name:", document.getElementById(`name-${id}`).innerText);
    if(newName) document.getElementById(`name-${id}`).innerText = newName;
}

function updatePoints() {
    const pts = document.getElementById('point-amount').value;
    if (!pts || pts <= 0) return alert("Enter valid points");
    alert("Points updated successfully!");
}

function processApproval(btn, isApproved) {
    const card = btn.closest('.approval-card');
    if (confirm(`Confirm ${isApproved ? 'Approval' : 'Rejection'}?`)) {
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 300);
    }
}