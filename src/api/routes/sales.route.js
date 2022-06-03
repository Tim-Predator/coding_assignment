const express = require('express');
const controller = require(`../controllers/sales_controller`);
const file_handler = require(`../helpers/file_handler`);

const router = express.Router();

router
  .route("/record")
  .post( file_handler.save_temp_file('file','text/csv'), controller.record)
router
  .route("/report")
  .get(controller.report)

module.exports = router;