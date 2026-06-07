// Tournament Matches Display - Public Bracket View
// Handles tournament selection and bracket display

/**
 * Shows selected tournament and hides others
 */
function showTournament(tournamentId, button) {
    // Hide all tournament views
    const views = document.querySelectorAll('.tournament-view');
    views.forEach(view => view.style.display = 'none');
    
    // Show selected tournament
    const selectedView = document.getElementById('tournament-' + tournamentId);
    if (selectedView) {
        selectedView.style.display = 'block';
    }
    
    // Update button styles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.style.background = '#e2e8f0';
        btn.style.color = '#333';
    });
    button.style.background = '#3b82f6';
    button.style.color = 'white';
}

/**
 * Initialize on page load - show first tournament by default
 */
window.addEventListener('load', () => {
    const firstBtn = document.querySelector('.tab-btn');
    if (firstBtn) {
        firstBtn.click();
    }
});
