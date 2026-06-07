// Function to switch between Group Stage and Bracket Tree tabs
function switchView(tab, btn) {
    const group = document.getElementById('group-content');
    const tree = document.getElementById('tree-content');

    if (tab === 'group') {
        group.classList.remove('hidden');
        tree.classList.add('hidden');
    } else {
        group.classList.add('hidden');
        tree.classList.remove('hidden');
    }

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Function to handle showing/hiding main sections
function show(id) {
    const listView = document.getElementById('list-view');
    const detailsView = document.getElementById('details-view');

    if (id === 'list') {
        listView.classList.remove('section-hidden');
        detailsView.classList.add('section-hidden');
    } else {
        listView.classList.add('section-hidden');
        detailsView.classList.remove('section-hidden');
    }
}

// Function to trigger registration and update the title
function goReg(type) {
    const title = document.getElementById('title-display');
    const p2Section = document.getElementById('player2-section');
    if (type === 'doubles') {
        title.innerText = 'Register for Spring Doubles Cup';
        p2Section.style.display = 'block';
    } else {
        title.innerText = 'Register for Solo Masters League';
        p2Section.style.display = 'none';
    }
    
    show('details');
}