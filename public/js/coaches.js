document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.getElementById("paymentForm");
  const trainingPrice = document.getElementById("trainingPrice");
  const confirmationMessage = document.getElementById("confirmationMessage");

  const trainingType = paymentForm.dataset.type;

  if (trainingType === "private") {
    trainingPrice.textContent = "Amount to Pay: 6,000 EGP";
  } else if (trainingType === "group") {
    trainingPrice.textContent = "Amount to Pay: 3,000 EGP";
  }

  paymentForm.addEventListener("submit", async (e) => {
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

    // ✅ Collect hidden booking fields
    const bookingData = {
      coachId: paymentForm.querySelector("input[name='coachId']").value,
      coachName: paymentForm.querySelector("input[name='coachName']").value,
      trainingType: paymentForm.querySelector("input[name='trainingType']").value,
      day: paymentForm.querySelector("input[name='day']").value,
      time: paymentForm.querySelector("input[name='time']").value,
      location: paymentForm.querySelector("input[name='location']").value
    };

    try {
      const response = await fetch("/academy/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        confirmationMessage.style.display = "block";
        confirmationMessage.innerHTML = `<p>Payment successful! Your booking has been confirmed.</p>`;
        paymentForm.querySelector("button").disabled = true;
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error(err);
    }
  });
});


