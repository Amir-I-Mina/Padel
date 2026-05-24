let coaches = [
    {
        name: "Ahmed",
        age: 32,
        experience: "7 years",
        phone: "01012345678",
        location: "Smash Club",
        days: ["Monday-Wednesday"],
        time: "6-7PM",
        training: ""
    },
    {
        name: "Ali",
        age: 28,
        experience: "5 years",
        phone: "01098765432",
        location: "Smash Club",
        days: ["Monday-Wednesday"],
        time: "6-7PM",
        training: ""
    }
];

window.onload = function () {

    let container = document.getElementById("coachContainer");
    let template = document.getElementById("coachTemplate");

    if (!container || !template) {
        alert("Container or template missing");
        return;
    }

    for (let i = 0; i < coaches.length; i++) {

        let c = coaches[i];

        let card = template.cloneNode(true);
        card.style.display = "block";

        // fill data
        card.querySelector(".name").innerText = c.name;
        card.querySelector(".age").innerText = c.age;
        card.querySelector(".experience").innerText = c.experience;
        card.querySelector(".phone").innerText = c.phone;
        card.querySelector(".location").innerText = c.location;
        card.querySelector(".days").innerText = c.days.join(", ");
        card.querySelector(".time").innerText = c.time;

        // 🔥 BOOK BUTTON
        let button = document.createElement("button");
        button.innerText = "Book Coach";

    if (document.referrer.includes("Form.html")) {

    button.onclick = function () {
        bookCoach(c);
    };

} else {

    button.onclick = function () {
        bookCoachgroup(c);
    };
}

card.appendChild(button);

        container.appendChild(card);
    }
};


function bookCoach(coach) {

    let selected = JSON.parse(localStorage.getItem("selectedCoaches")) || [];
 
    selected.push({
        name: coach.name,
        age: coach.age,
        experience: coach.experience,
        phone: coach.phone,
        location: coach.location,
        days: coach.days,
        time: coach.time,
        training: "Private Training"
    });

    localStorage.setItem("selectedCoaches", JSON.stringify(selected));

    alert("Coach booked!");
}
function bookCoachgroup(coach) {

    let selected = JSON.parse(localStorage.getItem("selectedCoaches")) || [];
     
    selected.push({
        name: coach.name,
        age: coach.age,
        experience: coach.experience,
        phone: coach.phone,
        location: coach.location,
        days: coach.days,
        time: coach.time,
        training: "Group Training"
    });

    localStorage.setItem("selectedCoaches", JSON.stringify(selected));

    alert("Coach booked!");
}




