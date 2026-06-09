const Booking = require("../models/courtBooking");

const mapUrls = {
    "Shams Club": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409e9e9e9e9d%3A0x9e9e9e9e9e9e9e9e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890",
    "Wadi Degla": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409e9e9e9e9d%3A0x9e9e9e9e9e9e9e9e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890",
    "HPark": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409e9e9e9e9d%3A0x9e9e9e9e9e9e9e9e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890",
    "Cairo Stadium": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409e9e9e9e9d%3A0x9e9e9e9e9e9e9e9e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890",
    "Smash Club": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409e9e9e9e9d%3A0x9e9e9e9e9e9e9e9e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890"
};

const showClubs = (req, res) => {
    try {
        res.render("pages/booking", { error: null });
    } catch (error) {
        console.error("Error in showClubs:", error);
        res.status(500).send("Something went wrong");
    }
};

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { club, court, date, time } = req.body;

        // Validate required fields
        if (!club || !court || !date || !time) {
            return res.render("pages/courts", {
                club: club || "",
                mapUrl: mapUrls[club] || mapUrls["Shams Club"],
                error: "Please fill in all fields"
            });
        }

        // Check if the time slot is already booked
        const existingBooking = await Booking.findOne({
            club: club,
            court: court,
            date: date,
            time: time,
            status: "confirmed"
        });

        if (existingBooking) {
            return res.render("pages/courts", {
                club: club,
                mapUrl: mapUrls[club] || mapUrls["Shams Club"],
                error: "This time slot is already booked. Please choose another time."
            });
        }

        // Create new booking
        const booking = new Booking({
            club: club,
            court: court,
            date: date,
            time: time,
            price: 450,
            status: "confirmed"
        });

        await booking.save();

        // Render checkout page
        res.render("pages/checkoutcourt", {
            booking: booking,
            success: false,
            error: null
        });

    } catch (error) {
        console.error("Error in createBooking:", error);
        res.render("pages/courts", {
            club: req.body.club || "",
            mapUrl: mapUrls[req.body.club] || mapUrls["Shams Club"],
            error: "An error occurred while creating your booking. Please try again."
        });
    }
};

// Confirm booking with payment
const confirmBooking = async (req, res) => {
    try {
        const { bookingId, paymentMethod, promoCode } = req.body;

        if (!bookingId) {
            return res.redirect("/");
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.render("pages/checkoutcourt", {
                booking: null,
                success: false,
                error: "Booking not found"
            });
        }

        // Check if booking is already cancelled
        if (booking.status === "cancelled") {
            return res.render("pages/checkoutcourt", {
                booking: booking,
                success: false,
                error: "This booking has been cancelled and cannot be confirmed."
            });
        }

        // Apply promo code discount (optional)
        let finalPrice = booking.price;
        if (promoCode) {
            const promoDiscounts = {
                "WELCOME10": 0.10,
                "PADEL20": 0.20,
                "SPECIAL50": 50
            };

            if (promoDiscounts[promoCode.toUpperCase()]) {
                const discount = promoDiscounts[promoCode.toUpperCase()];
                if (typeof discount === 'number' && discount < 1) {
                    finalPrice = booking.price * (1 - discount);
                } else if (typeof discount === 'number') {
                    finalPrice = booking.price - discount;
                }
                finalPrice = Math.max(0, finalPrice);
            }
        }

        // Update booking with payment details
        booking.paymentMethod = paymentMethod;
        booking.promoCode = promoCode || "";
        booking.price = Math.round(finalPrice);
        booking.status = "confirmed";

        await booking.save();

        // Render success page
        res.render("pages/checkoutcourt", {
            booking: booking,
            success: true,
            error: null
        });

    } catch (error) {
        console.error("Error in confirmBooking:", error);
        res.render("pages/checkoutcourt", {
            booking: null,
            success: false,
            error: "An error occurred while confirming your booking. Please try again."
        });
    }
};

module.exports = {
    showClubs,
    createBooking,
    confirmBooking
};