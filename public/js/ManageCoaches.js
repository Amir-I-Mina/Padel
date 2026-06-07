window.onload = function () {
    const addCoachBtn = document.getElementById("addCoachBtn");
    const formContainer = document.getElementById("coachFormContainer");
    const formTitle = document.getElementById("formTitle");
    const coachForm = document.getElementById("coachForm");
    const closeFormBtn = document.getElementById("closeForm");
    const coachesContainer = document.querySelector(".dashboardContainer");

    // Show Add form
    addCoachBtn.addEventListener("click", () => {
        coachForm.reset();
        formTitle.innerText = "Add Coach";
        coachForm.dataset.mode = "add";
        formContainer.style.display = "block";
    });

    // Close form
    closeFormBtn.addEventListener("click", () => {
        formContainer.style.display = "none";
    });

    // Toggle dropdown menu
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("menu-dots")) {
            const menu = e.target.nextElementSibling;
            // Close all other menus
            document.querySelectorAll(".dropdown-menu").forEach(m => {
                if (m !== menu) m.style.display = "none";
            });
            // Toggle current menu
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        } else if (!e.target.closest(".menu-container")) {
            document.querySelectorAll(".dropdown-menu").forEach(m => {
                m.style.display = "none";
            });
        }
    });

    // Handle Edit button
    coachesContainer.addEventListener("click", e => {
        if (e.target.classList.contains("edit-btn")) {
            const btn = e.target;
            
            coachForm.reset();
            formTitle.innerText = "Edit Coach";
            coachForm.dataset.mode = "edit";
            coachForm.dataset.id = btn.dataset.id;
            
            // Fill form with coach data
            document.getElementById("name").value = btn.dataset.name;
            document.getElementById("age").value = btn.dataset.age;
            document.getElementById("phone").value = btn.dataset.phone;
            document.getElementById("location").value = btn.dataset.location;
            document.getElementById("experience").value = btn.dataset.experience;
            document.getElementById("availableDays").value = btn.dataset.days;
            document.getElementById("availableTimes").value = btn.dataset.times;
            document.getElementById("trainingType").value = btn.dataset.type;
            document.getElementById("salary").value = btn.dataset.salary;
            
            formContainer.style.display = "block";
            
            // Close dropdown
            e.target.closest(".dropdown-menu").style.display = "none";
        }
    });

    // Handle Delete button
    let coachToDelete = null;

// Handle Delete button
coachesContainer.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) {
        coachToDelete = {
            id: e.target.dataset.id,
            card: e.target.closest(".coach-card")
        };
        document.getElementById("deleteModal").style.display = "flex";
    }
});

// Confirm Delete
document.getElementById("confirmDelete").addEventListener("click", async () => {
    if (!coachToDelete) return;

    try {
        const response = await fetch(`/academy/admin/delete-coach/${coachToDelete.id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const result = await response.json();

        if (result.success) {
            coachToDelete.card.remove();
            document.getElementById("deleteModal").style.display = "none";
        } else {
            alert("Error: " + (result.message || "Something went wrong"));
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Something went wrong sending the delete request.");
    }
});

// Cancel Delete
document.getElementById("cancelDelete").addEventListener("click", () => {
    document.getElementById("deleteModal").style.display = "none";
    coachToDelete = null;
});

    // Handle form submit (Add or Edit)
    coachForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let valid = true;

        // Clear old errors
        document.querySelectorAll(".nameError, .ageError, .phoneError, .locationError, .experienceError, .daysError, .timesError")
            .forEach(el => el.innerText = "");

        const name = document.getElementById("name").value.trim();
        const age = document.getElementById("age").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const location = document.getElementById("location").value.trim();
        const experience = document.getElementById("experience").value.trim();
        const availableDays = document.getElementById("availableDays").value.trim();
        const availableTimes = document.getElementById("availableTimes").value.trim();
        const trainingType = document.getElementById("trainingType").value.trim();
        const salary = document.getElementById("salary").value.trim();
        
        const nameError = document.querySelector(".nameError");
        const ageError = document.querySelector(".ageError");
        const phoneError = document.querySelector(".phoneError");
        const locationError = document.querySelector(".locationError");
        const experienceError = document.querySelector(".experienceError");
        const daysError = document.querySelector(".daysError");
        const timesError = document.querySelector(".timesError");
        const salaryError = document.querySelector(".salaryError");

        // Regex patterns
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const ageRegex = /^[1-9][0-9]?$/;
        const phoneRegex = /^[0-9]{6,15}$/;
        const locationRegex = /^[A-Za-z\s]{2,}$/;
        const experienceRegex = /^[0-9]{1,2}$/;
        const daysRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;
        const timesRegex = /^([0-9]{1,2})-([0-9]{1,2})$/;
        const salaryRegex = /^\d+(\.\d{1,2})?$/;

        // Validation checks
        if (name === "" || !nameRegex.test(name)) {
            valid = false;
            nameError.innerText = "Name is required (letters only).";
        }
        if (age === "" || !ageRegex.test(age)) {
            valid = false;
            ageError.innerText = "Age is required (1–99).";
        }
        if (phone === "" || !phoneRegex.test(phone)) {
            valid = false;
            phoneError.innerText = "Phone is required (6–15 digits).";
        }
        if (location === "") {
            valid = false;
            locationError.innerText = "Location is required (letters only).";
        }
        if (experience === "" || !experienceRegex.test(experience)) {
            valid = false;
            experienceError.innerText = "Experience is required (1–99).";
        }
        if (availableDays === "") {
            valid = false;
            daysError.innerText = "Training type is required.";
        }
        if (availableTimes === "" ) {
            valid = false;
            timesError.innerText = "Available Times required";
        }
        if (trainingType === "") {
            valid = false;
            document.querySelector(".typeError").innerText = "Training type is required.";
        }
        if (salary === "" || !salaryRegex.test(salary)) {
            valid = false;
            salaryError.innerText = "Salary is required (non-negative number).";
        }

        if (!valid) return;

        // Collect form data
        const formData = new FormData(coachForm);
        const data = Object.fromEntries(formData.entries());

        // Decide if Add or Edit
        let url, method;
        if (coachForm.dataset.mode === "edit") {
            url = `/academy/admin/editcoaches/${coachForm.dataset.id}`;
            method = "PUT";
        } else {
            url = "/academy/admin/Add-coaches";
            method = "POST";
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const result = await response.json();

            if (result.success) {
                if (coachForm.dataset.mode === "add") {
                    alert("Coach added successfully!");
                } else {
                    alert("Coach updated successfully!");
                }

                coachForm.reset();
                formContainer.style.display = "none";
                location.reload();
            } else {
                alert("Error: " + (result.message || "Something went wrong"));
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Something went wrong sending the request.");
        }
    });
};
