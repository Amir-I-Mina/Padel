// Bracket Editor - Admin Tournament Setup
// Handles bracket creation, rendering, team selection, and winner management

const approvedTeamsData = window.approvedTeamsData || (() => {
    const el = document.getElementById('approved-teams-data');
    if (!el) return [];
    try {
        return JSON.parse(el.textContent || '[]');
    } catch (err) {
        console.error('Invalid approved teams JSON', err);
        return [];
    }
})();
let bracketRounds = [];

/**
 * Creates a knockout bracket structure from teams array
 * Pads teams to next power of 2 for balanced bracket
 */
function createBracket(teams) {
    const paddedTeams = [...teams];
    while ((paddedTeams.length & (paddedTeams.length - 1)) !== 0) {
        paddedTeams.push(null);
    }

    const rounds = [];
    const firstRound = [];
    let matchIndex = 1;

    for (let i = 0; i < paddedTeams.length; i += 2) {
        firstRound.push({
            id: matchIndex++,
            round: 0,
            team1: paddedTeams[i],
            team2: paddedTeams[i + 1],
            winner: null,
            childId: null
        });
    }
    rounds.push(firstRound);

    let previousRound = firstRound;
    while (previousRound.length > 1) {
        const nextRound = [];
        for (let i = 0; i < previousRound.length; i += 2) {
            const match = {
                id: matchIndex++,
                round: rounds.length,
                team1: null,
                team2: null,
                winner: null,
                from: [previousRound[i].id, previousRound[i + 1]?.id || null]
            };
            previousRound[i].childId = match.id;
            if (previousRound[i + 1]) previousRound[i + 1].childId = match.id;
            nextRound.push(match);
        }
        rounds.push(nextRound);
        previousRound = nextRound;
    }

    return rounds;
}

/**
 * Renders bracket rounds to DOM with team selectors and winner options
 */
function renderBracket(rounds) {
    const container = document.getElementById('bracket-container');
    if (!container) return;
    
    container.innerHTML = '';

    rounds.forEach((round, roundIndex) => {
        const stage = document.createElement('div');
        stage.className = `bracket-stage round-${roundIndex + 1}`;
        const title = document.createElement('h3');
        title.className = 'round-title';
        title.textContent = roundIndex === 0 ? 'Round 1' : `Round ${roundIndex + 1}`;
        stage.appendChild(title);

        round.forEach(match => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.dataset.matchId = match.id;
            card.dataset.round = roundIndex;

            const label = document.createElement('div');
            label.className = 'match-label';
            label.textContent = `Match #${match.id}`;
            card.appendChild(label);

            const teamRow = document.createElement('div');
            teamRow.className = 'team-row';

            ['team1', 'team2'].forEach(side => {
                const teamInput = document.createElement('div');
                teamInput.className = 'team-input';
                const teamLabel = document.createElement('label');
                teamLabel.textContent = side === 'team1' ? 'Team A' : 'Team B';
                teamLabel.htmlFor = `${side}-${match.id}`;
                teamInput.appendChild(teamLabel);

                if (roundIndex === 0) {
                    const select = document.createElement('select');
                    select.className = 'modal-input team-select';
                    select.id = `${side}-${match.id}`;
                    select.dataset.matchId = match.id;
                    select.dataset.position = side;
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = `-- Select ${side === 'team1' ? 'Team A' : 'Team B'} --`;
                    select.appendChild(defaultOption);

                    approvedTeamsData.forEach(team => {
                        const option = document.createElement('option');
                        option.value = team.id;
                        option.textContent = team.name;
                        select.appendChild(option);
                    });

                    if (match[side]) {
                        select.value = match[side].id;
                    }
                    select.addEventListener('change', () => updateWinnerOptions(match.id));
                    teamInput.appendChild(select);
                } else {
                    const span = document.createElement('div');
                    span.className = 'team-name';
                    span.id = `${side}-${match.id}`;
                    span.textContent = match[side] ? match[side].name : (match[side] === null ? '(bye)' : 'Waiting for winner');
                    teamInput.appendChild(span);
                }

                teamRow.appendChild(teamInput);
            });

            card.appendChild(teamRow);

            const winnerRow = document.createElement('div');
            winnerRow.className = 'winner-row';
            const winnerLabel = document.createElement('label');
            winnerLabel.htmlFor = `winner-${match.id}`;
            winnerLabel.textContent = 'Winner';
            winnerRow.appendChild(winnerLabel);

            const winnerSelect = document.createElement('select');
            winnerSelect.id = `winner-${match.id}`;
            winnerSelect.className = 'modal-input winner-select';
            winnerSelect.dataset.matchId = match.id;
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Winner';
            winnerSelect.appendChild(defaultOption);

            ['team1', 'team2'].forEach(side => {
                const option = document.createElement('option');
                option.value = side;
                option.textContent = side === 'team1' ? 'Team A' : 'Team B';
                winnerSelect.appendChild(option);
            });
            winnerSelect.disabled = roundIndex > 0 && (!match.team1 || !match.team2);
            winnerSelect.addEventListener('change', () => saveMatch(match.id));
            winnerRow.appendChild(winnerSelect);
            card.appendChild(winnerRow);

            const button = document.createElement('button');
            button.className = 'btn-primary match-button';
            button.textContent = 'Save Match';
            button.type = 'button';
            button.addEventListener('click', () => saveMatch(match.id));
            card.appendChild(button);

            const resultEl = document.createElement('div');
            resultEl.className = 'match-result';
            resultEl.id = `result-${match.id}`;
            card.appendChild(resultEl);

            stage.appendChild(card);
        });

        container.appendChild(stage);
    });
}

/**
 * Finds a match by ID across all rounds
 */
function getMatchById(rounds, id) {
    for (const round of rounds) {
        const found = round.find(match => match.id === id);
        if (found) return found;
    }
    return null;
}

/**
 * Updates winner dropdown to show actual team names
 */
function updateWinnerOptions(matchId) {
    const match = getMatchById(bracketRounds, Number(matchId));
    if (!match || match.round !== 0) return;
    
    const team1Select = document.getElementById(`team1-${matchId}`);
    const team2Select = document.getElementById(`team2-${matchId}`);
    const winnerSelect = document.getElementById(`winner-${matchId}`);
    
    if (!team1Select || !team2Select || !winnerSelect) return;
    
    const t1Name = team1Select.value ? approvedTeamsData.find(t => t.id === team1Select.value)?.name : 'Team A';
    const t2Name = team2Select.value ? approvedTeamsData.find(t => t.id === team2Select.value)?.name : 'Team B';

    winnerSelect.querySelector('option[value="team1"]').textContent = t1Name;
    winnerSelect.querySelector('option[value="team2"]').textContent = t2Name;
    winnerSelect.disabled = !team1Select.value || !team2Select.value;
    
    if (winnerSelect.value && !team1Select.value && winnerSelect.value === 'team1') winnerSelect.value = '';
    if (winnerSelect.value && !team2Select.value && winnerSelect.value === 'team2') winnerSelect.value = '';
}

/**
 * Saves match result and updates child matches
 */
function saveMatch(matchId) {
    const match = getMatchById(bracketRounds, Number(matchId));
    if (!match) return;
    
    const winnerSelect = document.getElementById(`winner-${matchId}`);
    const resultEl = document.getElementById(`result-${matchId}`);
    const winnerSide = winnerSelect.value;

    if (!winnerSide) {
        alert('Please choose a winner for Match #' + matchId + '.');
        return;
    }

    const team1Name = match.team1 ? match.team1.name : 'TBD';
    const team2Name = match.team2 ? match.team2.name : 'TBD';
    const winnerName = winnerSide === 'team1' ? team1Name : team2Name;
    
    match.winner = winnerSide;
    resultEl.textContent = `Winner: ${winnerName}`;
    resultEl.style.color = '#065f46';
    
    updateChildMatches();
    alert(`Match #${matchId} saved. Winner: ${winnerName}`);
}

/**
 * Updates downstream matches with winner data from parent matches
 */
function updateChildMatches() {
    bracketRounds.forEach(round => {
        round.forEach(match => {
            if (!match.from) return;
            
            const [source1, source2] = match.from;
            const fromMatch1 = getMatchById(bracketRounds, source1);
            const fromMatch2 = getMatchById(bracketRounds, source2);
            
            match.team1 = fromMatch1 && fromMatch1.winner ? {
                id: fromMatch1.winner === 'team1' ? fromMatch1.team1?.id : fromMatch1.team2?.id,
                name: fromMatch1.winner === 'team1' ? fromMatch1.team1?.name : fromMatch1.team2?.name
            } : null;
            
            match.team2 = fromMatch2 && fromMatch2.winner ? {
                id: fromMatch2.winner === 'team1' ? fromMatch2.team1?.id : fromMatch2.team2?.id,
                name: fromMatch2.winner === 'team1' ? fromMatch2.team1?.name : fromMatch2.team2?.name
            } : null;

            const team1Span = document.getElementById(`team1-${match.id}`);
            const team2Span = document.getElementById(`team2-${match.id}`);
            const winnerSelect = document.getElementById(`winner-${match.id}`);
            
            if (team1Span) team1Span.textContent = match.team1 ? match.team1.name : 'Waiting for winner';
            if (team2Span) team2Span.textContent = match.team2 ? match.team2.name : 'Waiting for winner';
            
            if (winnerSelect) {
                winnerSelect.querySelector('option[value="team1"]').textContent = match.team1 ? match.team1.name : 'Team A';
                winnerSelect.querySelector('option[value="team2"]').textContent = match.team2 ? match.team2.name : 'Team B';
                winnerSelect.disabled = !match.team1 || !match.team2;
                if (winnerSelect.disabled) winnerSelect.value = '';
            }
        });
    });
}

/**
 * Initialize bracket on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    bracketRounds = createBracket(approvedTeamsData);
    renderBracket(bracketRounds);
    updateChildMatches();
});
