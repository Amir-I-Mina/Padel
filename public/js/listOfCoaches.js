let coaches = JSON.parse(localStorage.getItem("coaches")) || [];

let container = document.querySelector("#dashboardContainer");
let template = document.querySelector(".coach-card");

if (!container || !template) {
    console.error("HTML elements missing!");
}

function render() {
    container.innerHTML = "";

    coaches.forEach(function (coach) {
        let card = template.cloneNode(true);
        card.style.display = "block";

        card.querySelector(".name").innerText = coach.name;
        card.querySelector(".phone").innerText = coach.phone;
        card.querySelector(".exprience").innerText = coach.exprience;
        card.querySelector(".location").innerText = coach.location;
        card.querySelector(".days").innerText =
            Array.isArray(coach.days) ? coach.days.join(", ") : coach.days;
        card.querySelector(".time").innerText = coach.time;
        card.querySelector(".Salary").innerText = coach.salary;

        container.appendChild(card);
    });
}

template.remove();
render();