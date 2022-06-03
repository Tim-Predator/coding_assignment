const express = require('express');
const salesRoutes = require('./sales.route');
const router = express.Router();

router.use('/sales', salesRoutes);

module.exports = router;