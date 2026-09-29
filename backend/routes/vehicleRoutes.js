const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getVehicles)
  .post(protect, adminOnly, upload.single('image'), createVehicle);

router
  .route('/:id')
  .get(getVehicleById)
  .put(protect, adminOnly, upload.single('image'), updateVehicle)
  .delete(protect, adminOnly, deleteVehicle);

module.exports = router;
