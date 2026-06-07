const approvedTeamsData = (() => {
    const el = document.getElementById('approved-teams-data');
    if (!el) return [];
    try {
        return JSON.parse(el.textContent || '[]');
    } catch (err) {
        console.error('Invalid approved teams JSON', err);
        return [];
    }
})();

function createBracket(teams) {
    const paddedTeams = [...teams];
    while ((paddedTeams.length & (paddedTeams.length - 1)) !== 0) {
        paddedTeams.push(null);
    }

    const rounds = [];
    let matchIndex = 1;
    let currentRound = [];

    for (let i = 0; i < paddedTeams.length; i += 2) {
        currentRound.push({
            matchNumber: matchIndex++,
            team1: paddedTeams[i],
            team2: paddedTeams[i + 1],
            from1: null,
            from2: null
        });
    }
    rounds.push(currentRound);

    while (currentRound.length > 1) {
        const nextRound = [];
        for (let i = 0; i < currentRound.length; i += 2) {
            nextRound.push({
                matchNumber: matchIndex++,
                team1: null,
                team2: null,
                from1: currentRound[i].matchNumber,
                from2: currentRound[i + 1] ? currentRound[i + 1].matchNumber : null
            });
        }
        rounds.push(nextRound);
        currentRound = nextRound;
    }

    return rounds;
}

function renderBracket(container, rounds) {
    container.innerHTML = '';

    for (let i = rounds.length - 1; i >= 0; i--) {
        const stage = document.createElement('div');
        stage.className = 'bracket-stage';

        rounds[i].forEach(match => {
            const node = document.createElement('div');
            node.className = `match-node ${i === 0 ? 'first-stage' : ''} ${i === rounds.length - 1 ? 'last-stage' : ''}`;

            const title = document.createElement('div');
            title.className = 'match-title';
            title.textContent = `M${match.matchNumber}`;
            node.appendChild(title);

            const teamRow = document.createElement('div');
            teamRow.className = 'team-row';

            const team1 = document.createElement('div');
            team1.className = 'team-name';
            team1.textContent = match.team1 ? match.team1.teamName : (match.from1 ? `Winner of M${match.from1}` : '(bye)');
            teamRow.appendChild(team1);

            const vsText = document.createElement('div');
            vsText.className = 'vs-text';
            vsText.textContent = 'VS';
            teamRow.appendChild(vsText);

            const team2 = document.createElement('div');
            team2.className = 'team-name';
            team2.textContent = match.team2 ? match.team2.teamName : (match.from2 ? `Winner of M${match.from2}` : '(bye)');
            teamRow.appendChild(team2);

            node.appendChild(teamRow);
            stage.appendChild(node);
        });

        container.appendChild(stage);
    }
}

function renderAllBrackets() {
    if (!approvedTeamsData.length) return;

    const rounds = createBracket(approvedTeamsData);
    document.querySelectorAll('.bracket-container').forEach(container => {
        renderBracket(container, rounds);
    });
}

function showTournament(tournamentId, button) {
    const views = document.querySelectorAll('.tournament-view');
    views.forEach(view => view.style.display = 'none');

    const target = document.getElementById('tournament-' + tournamentId);
    if (!target) return;
    target.style.display = 'block';

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.style.background = '#e2e8f0';
        btn.style.color = '#333';
    });

    if (button) {
        button.style.background = '#3b82f6';
        button.style.color = 'white';
    }
}

function initMatchTabs() {
    document.querySelectorAll('.tab-btn[data-show-tournament]').forEach(btn => {
        btn.addEventListener('click', () => showTournament(btn.dataset.showTournament, btn));
    });

    const firstBtn = document.querySelector('.tab-btn[data-show-tournament]');
    if (firstBtn) firstBtn.click();
}

document.addEventListener('DOMContentLoaded', () => {
    initMatchTabs();
    renderAllBrackets();
});
