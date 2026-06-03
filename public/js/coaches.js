const coaches =
JSON.parse(localStorage.getItem("coaches")) || [];

window.onload = function () {

const container =
    document.getElementById("coachContainer");

const template =
    document.getElementById("coachTemplate");

if (!container || !template) {
    return;
}

coaches.forEach((coach) => {

    const card = template.cloneNode(true);

    card.style.display = "block";

    card.querySelector(".name").innerText =
        coach.name;

    card.querySelector(".age").innerText =
        coach.age;

    card.querySelector(".experience").innerText =
        coach.experience;

    card.querySelector(".phone").innerText =
        coach.phone;

    card.querySelector(".location").innerText =
        coach.location;

    card.querySelector(".days").innerText =
        coach.availableDays;

    card.querySelector(".time").innerText =
        coach.availableTimes;

    const button =
        document.createElement("button");

    button.innerText = "Book Coach";

    button.onclick = async () => {

        try {

            const response = await fetch(
                "/academy/book-training",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        coachId: coach._id,
                        trainingType:
                            coach.trainingType,
                        day:
                            coach.availableDays,
                        time:
                            coach.availableTimes,
                        location:
                            coach.location
                    })
                }
            );

            const data =
                await response.json();

            if (data.success) {

                alert(
                    "Coach booked successfully"
                );
            }
            else {

                alert(data.message);
            }

        } catch (err) {

            console.error(err);

        }

    };

    card.appendChild(button);

    container.appendChild(card);

});

template.remove();


};





