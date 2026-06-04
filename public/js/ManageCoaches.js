window.onload = function () {

const addCoachBtn =
    document.querySelector(".addCoachBtn");

const formContainer =
    document.getElementById("coachFormContainer");

const formTitle =
    document.getElementById("formTitle");

const coachForm =
    document.getElementById("coachForm");


addCoachBtn.addEventListener("click", function () {

    coachForm.reset();

    formTitle.innerText = "Add Coach";

    coachForm.action =
        "/academy/admin/Add-coach";

    formContainer.style.display = "block";
});


document
    .querySelectorAll(".edit-btn")
    .forEach(button => {

        button.addEventListener("click", function () {

            formTitle.innerText = "Edit Coach";

            document.getElementById("name").value =
                this.dataset.name;

            document.getElementById("age").value =
                this.dataset.age;

            document.getElementById("phone").value =
                this.dataset.phone;

            document.getElementById("location").value =
                this.dataset.location;

            document.getElementById("experience").value =
                this.dataset.experience;

            document.getElementById("availableDays").value =
                this.dataset.days;

            document.getElementById("availableTimes").value =
                this.dataset.times;

            document.getElementById("trainingType").value =
                this.dataset.type;

            coachForm.action =
                "/academy/admin/editcoach/" +
                this.dataset.id;

            formContainer.style.display =
                "block";
        });

    });


};
