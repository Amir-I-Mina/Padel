window.onload = function () {

    let coaches = JSON.parse(localStorage.getItem("coaches")) || [];
    let editingIndex = null;

    let container = document.querySelector(".dashboardContainer");
    let template = document.querySelector(".coach-card");
    let form = document.querySelector("#coach");
    let saveBtn = document.querySelector("#saveCoach");
    let addBtn = document.querySelector(".addCoachBtn");

    addBtn.onclick = function () {
        editingIndex = null;
        document.querySelector(".coachForm").reset();
        form.style.display = "block";
    };

    function render() {
        container.innerHTML = "";

        coaches.forEach(function (coach, index) {
            let card = template.cloneNode(true);
            card.style.display = "block";

            card.querySelector(".name").innerText = coach.name;
            card.querySelector(".phone").innerText = coach.phone;
            card.querySelector(".location").innerText = coach.location;
            card.querySelector(".days").innerText = coach.days;
            card.querySelector(".time").innerText = coach.time;
            card.querySelector(".Salary").innerText = coach.salary;

            setupMenu(card, index);
            container.appendChild(card);
        });
    }

    
saveBtn.onclick = function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let exprience = document.getElementById("exprience").value.trim();
    let location = document.getElementById("location").value.trim();
    let days = document.getElementById("days").value.trim();
    let time = document.getElementById("time").value.trim();
    let salary = document.getElementById("salary").value.trim();

    let valid = true;

    
    document.querySelector(".nameError").innerText = "";
    document.querySelector(".ExError").innerText = "";
    document.querySelector(".phoneError").innerText = "";
    document.querySelector(".LocError").innerText = "";
    document.querySelector(".DayError").innerText = "";
    document.querySelector(".timeError").innerText = "";
    document.querySelector(".SalaryError").innerText = "";

    

    let nameRegex = /^.{3,}$/;
    if (!nameRegex.test(name)) {
        document.querySelector(".nameError").innerText =
            "Name must be at least 3 characters";
        valid = false;
    }

    let phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
        document.querySelector(".phoneError").innerText =
            "Phone must be exactly 11 digits";
        valid = false;
    }

    if (exprience === "") {
        document.querySelector(".ExError").innerText = "Invalid input";
        valid = false;
    }

    if (location === "") {
        document.querySelector(".LocError").innerText = "Invalid input";
        valid = false;
    }

    if (days === "") {
        document.querySelector(".DayError").innerText = "Invalid input";
        valid = false;
    }

    if (time === "") {
        document.querySelector(".timeError").innerText = "Invalid input";
        valid = false;
    }

    if (salary === "") {
        document.querySelector(".SalaryError").innerText = "Invalid input";
        valid = false;
    }

    if (!valid) return;

    let coach = {
        name,
        phone,
        exprience,
        location,
        days,
        time,
        salary
    };

    if (editingIndex !== null) {
        coaches[editingIndex] = coach;
    } else {
        coaches.push(coach);
    }

    localStorage.setItem("coaches", JSON.stringify(coaches));
    render();

    form.style.display = "none";
};

    function setupMenu(card, index) {
        let menu = card.querySelector(".menu");
        let options = card.querySelector(".menu-options");

        menu.onclick = function () {
            options.style.display = options.style.display === "block" ? "none" : "block";
        };

        card.querySelector(".delete").onclick = function () {
            coaches.splice(index, 1);
            localStorage.setItem("coaches", JSON.stringify(coaches));
            render();
        };

        card.querySelector(".edit").onclick = function () {
            editingIndex = index;
            let coach = coaches[index];

            document.querySelector("#name").value = coach.name;
            document.querySelector("#phone").value = coach.phone;
            document.querySelector("#exprience").value = coach.exprience;
            document.querySelector("#location").value = coach.location;
            document.querySelector("#days").value = coach.days;
            document.querySelector("#time").value = coach.time;
            document.querySelector("#salary").value = coach.salary;

            form.style.display = "block";
        };
    }

    template.remove();
    render();
};