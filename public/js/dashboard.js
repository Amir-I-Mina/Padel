window.onload = function () {

    // get saved coaches
    let data = JSON.parse(localStorage.getItem("selectedCoaches")) || [];

    let container = document.getElementById("dashboardContainer");
    let template = document.querySelector(".coach-card");

    // safety check
    if (!container || !template) {
        alert("Dashboard elements missing");
        return;
    }

    // no data
    if (data.length === 0) {
        container.innerHTML = "No coaches booked yet";
        return;
    }

    // clear old content
    container.innerHTML = "";

    // loop through coaches
    data.forEach(function (coach) {

        let card = template.cloneNode(true);
        card.style.display = "block";

        // fill data
        card.querySelector(".Training").innerText = coach.training;
        card.querySelector(".name").innerText = coach.name;
        card.querySelector(".phone").innerText = coach.phone;
        card.querySelector(".location").innerText = coach.location;
        card.querySelector(".days").innerText =
            Array.isArray(coach.days) ? coach.days.join(", ") : coach.days;
        card.querySelector(".time").innerText = coach.time;

        container.appendChild(card);
    });
    
};