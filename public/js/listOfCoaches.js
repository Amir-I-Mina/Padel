window.onload = async function () {
    const container = document.querySelector("#dashboardContainer");
    const template = document.querySelector(".coach-card");

    if (!container || !template) return;

    try {
        const response = await fetch("/academy/admin/coaches-list");
        const data = await response.json();

        if (!data.success || data.coaches.length === 0) {
            container.innerHTML = "<p>No coaches found</p>";
            return;
        }

        container.innerHTML = "";

        data.coaches.forEach(coach => {
            const card = template.cloneNode(true);
            card.style.display = "block";

            card.querySelector(".name").innerText = coach.name;
            card.querySelector(".phone").innerText = coach.phone;
            card.querySelector(".experience").innerText = coach.experience;
            card.querySelector(".location").innerText = coach.location;
            card.querySelector(".days").innerText = coach.availableDays;
            card.querySelector(".time").innerText = coach.availableTimes;
            card.querySelector(".salary").innerText = coach.salary;

            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Error loading coaches</p>";
    }

    template.remove();
};
