function show(id) {
    document.getElementById('list-view').classList.add('section-hidden');
    document.getElementById('details-view').classList.add('section-hidden');

    document.getElementById(id + '-view').classList.remove('section-hidden');

    window.scrollTo(0,0);
}

function goReg(mode) {
    const p2Section = document.getElementById('player2-section');
    const title = document.getElementById('title-display');

    if (mode === "solo") {
        p2Section.style.display = 'none';
        title.innerText = "Solo Masters League";
    } 
    else {
        p2Section.style.display = 'block';
        title.innerText = "Spring Doubles Cup";
    }

    show('details');
}