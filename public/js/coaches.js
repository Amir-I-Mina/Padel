document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".tournament-card button");
     const confirmationDiv = document.getElementById("confirmation");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const card = btn.closest(".tournament-card");
            const coachId = card.querySelector("input[name='coachId']").value;

            // Only send coachId (and trainingType if needed)
            const bookingData = { coachId };

            try {
                const response = await fetch("/academy/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData)
                });

                  const result = await response.json();

   if (result.success) {
          // ✅ Refresh the page automatically
          window.location.reload();
        } else {
          alert("Error: " + result.error);
        }
      } catch (err) {
        alert("Server error. Please try again later.");
        console.error(err);
      }
        });
    });
});
