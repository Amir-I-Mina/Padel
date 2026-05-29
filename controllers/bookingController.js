const Booking = require('../models/bookingSchema');

// GET /clubs - Show clubs page
exports.getClubsPage = async (req, res) => {
  try {
    res.render('clubs', { currentPage: 'clubs' });
  } catch (error) {
    res.status(500).send('Error loading clubs page');
  }
};

// POST /api/select-club - Select a club
exports.selectClub = async (req, res) => {
  try {
    const { clubName } = req.body;
    
    if (!clubName) {
      return res.status(400).json({ success: false, message: 'Club name is required' });
    }
    
    // Store in session or send back
    req.session.selectedClub = clubName;
    
    res.json({ success: true, club: clubName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /booking - Show booking page
exports.getBookingPage = async (req, res) => {
  try {
    const club = req.session.selectedClub;
    if (!club) {
      return res.redirect('/clubs');
    }
    res.render('booking', { club, currentPage: 'booking' });
  } catch (error) {
    res.status(500).send('Error loading booking page');
  }
};

// GET /api/available-slots - Get available time slots for a court/date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { club, court, date } = req.query;
    
    const bookedSlots = await Booking.find({ 
      club, 
      court, 
      date,
      status: 'confirmed'
    }).select('time');
    
    const bookedTimes = bookedSlots.map(slot => slot.time);
    
    const allSlots = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', 
                      '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'];
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json({ success: true, availableSlots, bookedTimes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/create-booking - Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { club, court, date, time, paymentMethod, promoCode } = req.body;
    
    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      club,
      court,
      date,
      time,
      status: 'confirmed'
    });
    
    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked' 
      });
    }
    
    const booking = new Booking({
      club,
      court,
      date,
      time,
      price: 450,
      paymentMethod: paymentMethod || 'Cash',
      promoCode: promoCode || '',
      status: 'confirmed'
    });
    
    await booking.save();
    
    // Store in session for checkout
    req.session.currentBooking = booking;
    
    res.status(201).json({ 
      success: true, 
      booking, 
      message: 'Booking created successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /checkout - Show checkout page
exports.getCheckoutPage = async (req, res) => {
  try {
    const booking = req.session.currentBooking;
    if (!booking) {
      return res.redirect('/clubs');
    }
    res.render('checkout', { booking, currentPage: 'checkout' });
  } catch (error) {
    res.status(500).send('Error loading checkout page');
  }
};

// POST /api/confirm-booking - Confirm booking
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, paymentMethod, promoCode } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Apply promo code discount if valid
    let finalPrice = booking.price;
    if (promoCode && promoCode === 'DISCOUNT10') {
      finalPrice = booking.price * 0.9;
    }
    
    booking.paymentMethod = paymentMethod || booking.paymentMethod;
    booking.promoCode = promoCode || '';
    booking.status = 'confirmed';
    
    await booking.save();
    
    // Clear session
    req.session.currentBooking = null;
    
    res.json({ 
      success: true, 
      booking,
      finalPrice,
      message: 'Booking confirmed successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/my-bookings - Get user's bookings (optional)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};