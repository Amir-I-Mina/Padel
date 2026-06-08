// payment.js
window.addEventListener("DOMContentLoaded", () => {
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
