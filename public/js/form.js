document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("bookingForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const trainingType =
        form.dataset.type;

    const endpoint =
        trainingType === "private"
            ? "/academy/find-private-coaches"
            : "/academy/find-group-coaches";

    const location =
        document.getElementById("location").value;

    const day =
        document.querySelector('input[name="days"]:checked')?.value;

    const time =
        document.querySelector('input[name="time"]:checked')?.value;

    try {

        const response = await fetch(
            endpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    location,
                    day,
                    time
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "coaches",
                JSON.stringify(data.coaches)
            );

            window.location.href =
                "/academy/coach-list";
        }

    } catch (err) {

        console.error(err);

    }

});


});
