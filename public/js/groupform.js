
document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("bookingForm");

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        let location = document.getElementById("location").value;

        let days = [];
        document.querySelectorAll('input[name="days"]:checked')
            .forEach(cb => days.push(cb.value));

        let time = [];
        document.querySelectorAll('input[name="time"]:checked')
            .forEach(cb => time.push(cb.value));

        localStorage.setItem("location", location);
        localStorage.setItem("days", JSON.stringify(days));
        localStorage.setItem("time", JSON.stringify(time));

        console.log("Saved:", location, days, time);

        window.location.href = "coach.html";
    });

});