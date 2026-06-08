const Booking = require("../models/courtBooking");


// SELECT CLUB
const selectClub = (req, res) => {
  const { clubName } = req.body;

  if (!req.session.clubs) {
    return res.status(400).send("Clubs not loaded in session");
  }

  const club = req.session.clubs.find(c => c.name === clubName);

  if (!club) {
    return res.status(404).send("Club not found");
  }

  req.session.selectedClub = club;

  // ✅ Redirect to booking page under /court
  res.redirect("/court/booking");
};

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { court, date, time, paymentMethod, promoCode, customerName, teamName } = req.body;
    const club = req.session.selectedClub;

    if (!club) {
      return res.redirect("/court/booking");
    }

    let finalPrice = club.price;

    const promo = req.session.promoCodes?.find(p => p.code === promoCode);
    if (promo) {
      finalPrice = finalPrice * (1 - promo.discount / 100);
    }

    const booking = new Booking({
      club: club.name,
      court,
      date,
      time,
      price: finalPrice,
      paymentMethod,
      promoCode,
      customerName,
      teamName
    });

    await booking.save();
    req.session.booking = booking;

    // ✅ Redirect to checkout under /court
    res.redirect("/court/checkout");
  } catch (err) {
    res.status(400).send("Error creating booking: " + err.message);
  }
};


module.exports = {
  selectClub,
  //getBookingPage,
  createBooking,
  //getCheckoutPage,
  //confirmBooking
};
