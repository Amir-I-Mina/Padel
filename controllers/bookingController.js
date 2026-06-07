const Booking = require("../models/courtBooking");


const selectClub = (req, res) => {
  const { clubName } = req.body;
  const club = req.session.clubs.find(c => c.name === clubName);

  if (club) {
    req.session.selectedClub = club;
    res.redirect("/booking");
  } else {
    res.status(404).send("Club not found");
  }
};


const getBookingPage = (req, res) => {
  const club = req.session.selectedClub;
  if (!club) return res.redirect("/clubs");

  res.render("booking", {
    club: club.name,
    price: club.price,
    image: club.image,
    mapUrl: club.mapUrl
  });
};


const createBooking = async (req, res) => {
  try {
    const { court, date, time, paymentMethod, promoCode, customerName, teamName } = req.body;
    const club = req.session.selectedClub;

    let finalPrice = club.price;

    
    const promo = req.session.promoCodes.find(p => p.code === promoCode);
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
    res.redirect("/checkout");
  } catch (err) {
    res.status(400).send("Error creating booking: " + err.message);
  }
};


const getCheckoutPage = (req, res) => {
  const booking = req.session.booking;
  if (!booking) return res.redirect("/clubs");

  const club = req.session.selectedClub;

  res.render("checkout", {
    booking,
    image: club.image,
    mapUrl: club.mapUrl
  });
};


const confirmBooking = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const booking = req.session.booking;

    if (!booking) return res.redirect("/clubs");

    booking.paymentMethod = paymentMethod;
    booking.status = "confirmed";
    await booking.save();

    res.render("success", { booking });
  } catch (err) {
    res.status(400).send("Error confirming booking: " + err.message);
  }
};


