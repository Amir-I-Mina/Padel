document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".form-card button");
     const confirmationDiv = document.getElementById("confirmation");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const card = btn.closest(".form-card");
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


    // payment.js
  const paymentForm = document.getElementById("paymentForm");
  const trainingPrice = document.getElementById("trainingPrice");
  const confirmationMessage = document.getElementById("confirmationMessage");

  const trainingType = paymentForm.dataset.type;

  if (trainingType === "private") {
    trainingPrice.textContent = "Amount to Pay: 6,000 EGP";
  } else if (trainingType === "group") {
    trainingPrice.textContent = "Amount to Pay: 3,000 EGP";
  }

  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardRegex.test(cardNumber)) {
      alert("Card number must be 16 digits.");
      return;
    }
    if (!expiryRegex.test(expiry)) {
      alert("Expiry must be in MM/YY format.");
      return;
    }
    if (!cvvRegex.test(cvv)) {
      alert("CVV must be 3 digits.");
      return;
    }

    // ✅ Show confirmation div instead of redirect
    confirmationMessage.style.display = "block";

    // Optionally disable the form so user can’t resubmit
    paymentForm.querySelector("button").disabled = true;
  });
});

