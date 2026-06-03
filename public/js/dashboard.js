window.onload = async function () {

const container =
    document.getElementById("dashboardContainer");

const template =
    document.querySelector(".coach-card");

if (!container || !template) {
    return;
}

try {

    const response =
        await fetch("/academy/dashboard");

    const data =
        await response.json();

    if (
        !data.success ||
        data.bookings.length === 0
    ) {

        container.innerHTML =
            "<p>No bookings found</p>";

        return;
    }

    container.innerHTML = "";

    data.bookings.forEach((booking) => {

        const card =
            template.cloneNode(true);

        card.style.display = "block";

        card.querySelector(".Training").innerText =
            booking.trainingType;

        card.querySelector(".name").innerText =
            booking.coachId.name;

        card.querySelector(".phone").innerText =
            booking.coachId.phone;

        card.querySelector(".location").innerText =
            booking.location;

        card.querySelector(".days").innerText =
            booking.day;

        card.querySelector(".time").innerText =
            booking.time;

        container.appendChild(card);

    });

} catch (err) {

    console.error(err);

    container.innerHTML =
        "<p>Error loading bookings</p>";

}


};
