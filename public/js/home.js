const slides = document.getElementById("slides");

if(slides){
    let index = 0;
    const total = slides.children.length;

    function showSlide(i) {
        slides.style.transform = "translateX(" + (-i * 100) + "%)";
    }

    function nextSlide() {
        index++;
        if (index >= total) index = 0;
        showSlide(index);
    }

    setInterval(nextSlide, 3000);
}




function validateL(){
    let valid = true;

    let username = document.getElementById("username").value;
    let phone = document.getElementById('pho').value;
    let password = document.getElementById("password").value;

    let phoneRegex = /^[0-9]{10,15}$/;

    document.getElementById("usernameError").innerText="";
    document.getElementById("phoneError").innerText="";
    document.getElementById("passwordError").innerText="";

    if(username.length < 3){
        document.getElementById("usernameError").innerText="Username must be at least 3 characters.";
        valid = false;
    }

    if(password.length < 8){
        document.getElementById("passwordError").innerText="Password must be at least 8 characters.";
        valid = false;
    }

    if(!phoneRegex.test(phone)){
        document.getElementById("phoneError").innerText="Phone must be 10-15 digits.";
        valid = false;
    }

   if(valid){
    return true;
}

return false;
}



function validate(){
    let valid = true;

    let username = document.getElementById("username").value;
    let phone = document.getElementById('pho').value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm").value;

    let phoneRegex = /^[0-9]{10,15}$/;

    document.getElementById("usernameError").innerText="";
    document.getElementById("phoneError").innerText="";
    document.getElementById("passwordError").innerText="";
    document.getElementById("confirmError").innerText="";

    if(username.length < 3){
        document.getElementById("usernameError").innerText="Username must be at least 3 characters.";
        valid = false;
    }

    if(password.length < 8){
        document.getElementById("passwordError").innerText="Password must be at least 8 characters.";
        valid = false;
    }

    if(!phoneRegex.test(phone)){
        document.getElementById("phoneError").innerText="Phone must be 10-15 digits.";
        valid = false;
    }

    if(password !== confirmPassword){
        document.getElementById("confirmError").innerText="Passwords do not match.";
        valid = false;
    }

   if(valid){
    return true;
}

return false;
}






let user = localStorage.getItem("username");

if(user){
    let welcome = document.getElementById("welcomeText");
    if(welcome){
        welcome.innerText = "Hey, " + user;
    }
}

