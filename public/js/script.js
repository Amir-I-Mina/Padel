// ===== SELECT CLUB PAGE =====
function selectClub(clubName) {
    localStorage.setItem("club", clubName);
    window.location.href = "b.html";
}


// ===== BOOKING PAGE =====
function book(btn) {

    let date = document.getElementById("date").value;

    if (!date) {
        alert("Please select a date first ❗");
        return;
    }

    let court = btn.parentElement.parentElement.querySelector("h2").innerText;
    let time = btn.parentElement.innerText.replace("Book","").trim();
    let club = localStorage.getItem("club");

    let booking = {
        club: club,
        court: court,
        time: time,
        date: date
    };

    localStorage.setItem("booking", JSON.stringify(booking));

    btn.innerText = "Selected";
    btn.style.background = "green";
}


// ===== CHECKOUT PAGE =====
function loadCheckout() {
    let data = JSON.parse(localStorage.getItem("booking"));

    if (data) {
        document.getElementById("club").innerText = data.club;
        document.getElementById("court").innerText = data.court;
        document.getElementById("time").innerText = data.time;
        document.getElementById("date").innerText = data.date;
    }
}

function confirmBooking() {
    alert("Booking Confirmed ✅");
}

// ===== SIMPLE ADMIN JS =====

// Data
let clubs = [
    { name: "Shams Club", price: 450 },
    { name: "Wadi Degla", price: 450 },
    { name: "HPark", price: 450 },
    { name: "Cairo Stadium", price: 450 },
    { name: "Smash Club", price: 450 }
];

let slots = {
    "Court 1": {},
    "Court 2": {},
    "Court 3": {}
};

let promos = { "WELCOME10": 10, "YALLA15": 15 };
let bookings = [];

// Time slots
let times = ["10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM"];

// Setup slots
for(let c in slots) {
    for(let t of times) {
        slots[c][t] = true;
    }
}

// Load/Save
function loadData() {
    let saved = localStorage.getItem("adminData");
    if(saved) {
        let data = JSON.parse(saved);
        clubs = data.clubs || clubs;
        slots = data.slots || slots;
        promos = data.promos || promos;
        bookings = data.bookings || bookings;
    }
    refreshAll();
}

function saveData() {
    localStorage.setItem("adminData", JSON.stringify({clubs, slots, promos, bookings}));
}

// Toast message
function toast(msg) {
    let t = document.createElement("div");
    t.className = "message-toast";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

// ===== CLUB FUNCTIONS =====
function showClubs() {
    let tbody = document.getElementById("clubsTableBody");
    if(!tbody) return;
    tbody.innerHTML = "";
    for(let i = 0; i < clubs.length; i++) {
        tbody.innerHTML += `<tr>
            <td>${clubs[i].name}</td>
            <td>${clubs[i].price} EGP</td>
            <td><button onclick="editClub(${i})" style="background:#2563eb;padding:5px 10px;">Edit</button></td>
        </tr>`;
    }
}

function editClub(i) {
    let newPrice = prompt("New price:", clubs[i].price);
    if(newPrice && !isNaN(newPrice)) {
        clubs[i].price = parseInt(newPrice);
        saveData();
        showClubs();
        updateSelects();
        toast("Price updated");
    }
}

function addClub() {
    let name = document.getElementById("newClubName").value.trim();
    let price = parseInt(document.getElementById("newClubPrice").value);
    if(!name) { toast("Enter name"); return; }
    if(isNaN(price)) price = 450;
    clubs.push({name, price});
    saveData();
    showClubs();
    updateSelects();
    document.getElementById("newClubName").value = "";
    toast("Club added");
}

function updateClubPrice() {
    let i = document.getElementById("clubSelectForPrice").value;
    let price = parseInt(document.getElementById("updatePriceValue").value);
    if(isNaN(price)) { toast("Enter price"); return; }
    clubs[i].price = price;
    saveData();
    showClubs();
    updateSelects();
    toast("Price updated");
}

function removeClub() {
    let i = document.getElementById("clubSelectForRemove").value;
    if(clubs.length > 1) {
        clubs.splice(i, 1);
        saveData();
        showClubs();
        updateSelects();
        toast("Club removed");
    } else {
        toast("Cannot delete last club");
    }
}

function updateSelects() {
    let sel1 = document.getElementById("clubSelectForPrice");
    let sel2 = document.getElementById("clubSelectForRemove");
    let sel3 = document.getElementById("promoSelectRemove");
    
    if(sel1) {
        sel1.innerHTML = "";
        for(let i = 0; i < clubs.length; i++) {
            sel1.innerHTML += `<option value="${i}">${clubs[i].name} (${clubs[i].price} EGP)</option>`;
        }
    }
    if(sel2) {
        sel2.innerHTML = "";
        for(let i = 0; i < clubs.length; i++) {
            sel2.innerHTML += `<option value="${i}">${clubs[i].name}</option>`;
        }
    }
    if(sel3) {
        sel3.innerHTML = "";
        for(let code in promos) {
            sel3.innerHTML += `<option value="${code}">${code} (${promos[code]}%)</option>`;
        }
    }
}

// ===== SLOT FUNCTIONS =====
function disableTimeSlot() {
    let court = document.getElementById("courtManageSelect").value;
    let time = document.getElementById("timeSlotManage").value.trim();
    if(time && slots[court][time] !== undefined) {
        slots[court][time] = false;
        saveData();
        showPreview();
        toast(`Disabled ${court} at ${time}`);
    } else {
        toast("Enter valid time (e.g., 10 AM)");
    }
}

function enableTimeSlot() {
    let court = document.getElementById("courtManageSelect").value;
    let time = document.getElementById("timeSlotManage").value.trim();
    if(time && slots[court][time] !== undefined) {
        slots[court][time] = true;
        saveData();
        showPreview();
        toast(`Enabled ${court} at ${time}`);
    } else {
        toast("Enter valid time");
    }
}

function resetAllSlotsForCourt() {
    let court = document.getElementById("courtManageSelect").value;
    for(let t of times) {
        slots[court][t] = true;
    }
    saveData();
    showPreview();
    toast(`Reset ${court}`);
}

function resetAllBookingsGlobally() {
    for(let c in slots) {
        for(let t of times) {
            slots[c][t] = true;
        }
    }
    saveData();
    showPreview();
    toast("All slots reset");
}

function showPreview() {
    let div = document.getElementById("slotPreview");
    if(div) {
        let s = slots["Court 1"];
        let text = "";
        for(let t of times) {
            text += `${t}: ${s[t] ? '✅' : '❌'} `;
        }
        div.innerHTML = text;
    }
}

// ===== PROMO FUNCTIONS =====
function showPromos() {
    let tbody = document.getElementById("promoTableBody");
    if(!tbody) return;
    tbody.innerHTML = "";
    for(let code in promos) {
        tbody.innerHTML += `<tr>
            <td>${code}</td>
            <td>${promos[code]}%</td>
            <td><span class="badge-status">Active</span></td>
        </tr>`;
    }
}

function addPromoCode() {
    let code = document.getElementById("promoCodeName").value.trim().toUpperCase();
    let disc = parseInt(document.getElementById("promoDiscount").value);
    if(code && !isNaN(disc)) {
        promos[code] = disc;
        saveData();
        showPromos();
        updateSelects();
        document.getElementById("promoCodeName").value = "";
        document.getElementById("promoDiscount").value = "";
        toast(`Added ${code}`);
    } else {
        toast("Enter code and discount");
    }
}

function removePromoCode() {
    let code = document.getElementById("promoSelectRemove").value;
    if(promos[code]) {
        delete promos[code];
        saveData();
        showPromos();
        updateSelects();
        toast(`Removed ${code}`);
    }
}

function updateGlobalRate() {
    let rate = parseInt(document.getElementById("globalRateInput").value);
    if(!isNaN(rate)) {
        toast(`Rate set to ${rate} EGP`);
        saveData();
    }
}

// ===== BOOKING FUNCTIONS =====
function showBookings() {
    let tbody = document.getElementById("bookingsListAdmin");
    let noMsg = document.getElementById("noBookingsMsg");
    if(!tbody) return;
    tbody.innerHTML = "";
    if(bookings.length === 0) {
        if(noMsg) noMsg.style.display = "block";
        return;
    }
    if(noMsg) noMsg.style.display = "none";
    for(let i = 0; i < bookings.length; i++) {
        let b = bookings[i];
        tbody.innerHTML += `<tr>
            <td>${b.club}</td>
            <td>${b.court}</td>
            <td>${b.date}</td>
            <td>${b.time}</td>
            <td><span class="badge-status">Confirmed</span></td>
            <td><button onclick="cancelBooking(${i})" style="background:#dc2626;padding:5px 10px;">Cancel</button></td>
        </tr>`;
    }
}

function cancelBooking(i) {
    let b = bookings[i];
    if(slots[b.court]) {
        slots[b.court][b.time] = true;
    }
    bookings.splice(i, 1);
    saveData();
    showBookings();
    showPreview();
    toast("Booking cancelled");
}

function clearAllBookings() {
    if(confirm("Cancel ALL bookings?")) {
        for(let b of bookings) {
            if(slots[b.court]) {
                slots[b.court][b.time] = true;
            }
        }
        bookings = [];
        saveData();
        showBookings();
        showPreview();
        toast("All bookings cleared");
    }
}

// ===== REFRESH ALL =====
function refreshAll() {
    showClubs();
    updateSelects();
    showPreview();
    showPromos();
    showBookings();
}

// ===== EXPORT FUNCTIONS FOR OTHER PAGES =====
window.getSlots = function() { return slots; }
window.getClubs = function() { return clubs; }
window.getPromos = function() { return promos; }
window.addBooking = function(booking) {
    bookings.push(booking);
    saveData();
    showBookings();
}

// ===== START =====
loadData();