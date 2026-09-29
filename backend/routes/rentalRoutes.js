const express = require('express');
const router = express.Router();
const {
  createRental,
  getMyRentals,
  getAllRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental
} = require('../controllers/rentalController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, createRental)
  .get(protect, adminOnly, getAllRentals);

router.get('/my-rentals', protect, getMyRentals);

router
  .route('/:id')
  .get(protect, getRentalById)
  .delete(protect, deleteRental);

router.put('/:id/status', protect, updateRentalStatus);

module.exports = router;
