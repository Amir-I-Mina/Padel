// ===== SELECT CLUB PAGE =====
function selectClub(clubName) {
    localStorage.setItem("club", clubName);
    window.location.href = "b.html";
}


// ===== BOOKING PAGE =====
function book(btn) {

    let date = document.getElementById("date").value;

    if (!date) {
        alert("Please select a date first ❗");
        return;
    }

    let court = btn.parentElement.parentElement.querySelector("h2").innerText;
    let time = btn.parentElement.innerText.replace("Book","").trim();
    let club = localStorage.getItem("club");

    let booking = {
        club: club,
        court: court,
        time: time,
        date: date
    };

    localStorage.setItem("booking", JSON.stringify(booking));

    btn.innerText = "Selected";
    btn.style.background = "green";
}


// ===== CHECKOUT PAGE =====
function loadCheckout() {
    let data = JSON.parse(localStorage.getItem("booking"));

    if (data) {
        document.getElementById("club").innerText = data.club;
        document.getElementById("court").innerText = data.court;
        document.getElementById("time").innerText = data.time;
        document.getElementById("date").innerText = data.date;
    }
}

function confirmBooking() {
    alert("Booking Confirmed ✅");
}