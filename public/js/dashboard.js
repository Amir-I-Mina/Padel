window.onload = function () {
    const container = document.querySelector(".dashboard-container");
    const cancelModal = document.getElementById("cancelModal");
    const confirmCancelBtn = document.getElementById("confirmCancel");
    const cancelBtnModal = document.getElementById("cancelBtn");

    let bookingToCancel = null;

    // Handle cancel button clicks
    container.addEventListener("click", e => {
        if (e.target.classList.contains("cancel-btn")) {
            bookingToCancel = {
                id: e.target.dataset.bookingId,
                card: e.target.closest(".coach-card")
            };
            cancelModal.style.display = "flex";
        }
    });

    // Confirm cancel
    confirmCancelBtn.addEventListener("click", async () => {
        if (!bookingToCancel) return;

        try {
            const response = await fetch(`/academy/bookings/${bookingToCancel.id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (result.success) {
                alert("Booking cancelled successfully!");
                bookingToCancel.card.remove();
                cancelModal.style.display = "none";
                bookingToCancel = null;
            } else {
                alert("Error: " + (result.message || "Failed to cancel"));
            }
        } catch (err) {
            console.error(err);
            alert("Error cancelling booking");
        }
    });

    // Cancel the cancel action
    cancelBtnModal.addEventListener("click", () => {
        cancelModal.style.display = "none";
        bookingToCancel = null;
    });

    // Close modal when clicking outside
    cancelModal.addEventListener("click", (e) => {
        if (e.target === cancelModal) {
            cancelModal.style.display = "none";
            bookingToCancel = null;
        }
    });
};