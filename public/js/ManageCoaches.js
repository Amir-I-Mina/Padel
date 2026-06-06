window.onload = function () {
    const addCoachBtn = document.getElementById("addCoachBtn"); // use ID
    const formContainer = document.getElementById("coachFormContainer");
    const formTitle = document.getElementById("formTitle");
    const coachForm = document.getElementById("coachForm");
    const closeFormBtn = document.getElementById("closeForm");
   

    addCoachBtn.addEventListener("click", function () {
        coachForm.reset();
        formTitle.innerText = "Add Coach";
        coachForm.action = "/academy/admin/add-coach";
        formContainer.style.display = "block"; // show the form
    });
    // Close form when Cancel is clicked
    closeFormBtn.addEventListener("click", function () {
        formContainer.style.display = "none";
    });


    coachForm.addEventListener("submit", function (e) {
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

    const nameError = document.querySelector(".nameError");
    const ageError = document.querySelector(".ageError");
    const phoneError = document.querySelector(".phoneError");
    const locationError = document.querySelector(".locationError");
    const experienceError = document.querySelector(".experienceError");
    const daysError = document.querySelector(".daysError");
    const timesError = document.querySelector(".timesError");

    // Empty + regex checks
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
    if (location === "" || !locationRegex.test(location)) {
        valid = false;
        locationError.innerText = "Location is required (letters only).";
    }
    if (experience === "" || !experienceRegex.test(experience)) {
        valid = false;
        experienceError.innerText = "Experience is required (1–99).";
    }
    if (availableDays === "" || !daysRegex.test(availableDays)) {
        valid = false;
        daysError.innerText = "Available Days required (e.g. Monday-Wednesday).";
    }
    if (availableTimes === "" || !timesRegex.test(availableTimes)) {
        valid = false;
        timesError.innerText = "Available Times required (e.g. 6-7).";
    }

    // 🚨 Stop submission if invalid
    if (!valid) {
        e.preventDefault();
    }
});


};


    