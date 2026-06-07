const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


router.get("/admin", adminController.adminDashboard);


router.post("/admin/add-club", adminController.addClub);
router.post("/admin/update-club-price", adminController.updateClubPrice);
router.post("/admin/remove-club", adminController.removeClub);


router.post("/admin/disable-slot", adminController.disableSlot);
router.post("/admin/enable-slot", adminController.enableSlot);
router.post("/admin/reset-court-slots", adminController.resetCourtSlots);
router.post("/admin/reset-all-slots", adminController.resetAllSlots);


router.post("/admin/add-promo", adminController.addPromoCode);
router.post("/admin/remove-promo", adminController.removePromoCode);
router.post("/admin/update-global-rate", adminController.updateGlobalRate);


router.post("/admin/cancel-booking/:id", adminController.cancelBooking);
router.post("/admin/clear-bookings", adminController.clearAllBookings);

module.exports = router;
