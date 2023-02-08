var express = require("express");
var router = express.Router();
const ContactController = require('../controller/contactController');

/* GET home page. */
router.get("/", (req, res) => {
  res.redirect("/catalog");
});


router.get('/contact', ContactController.ContactForm_Get);
router.post('/contact', ContactController.ContactForm_Post); 

module.exports = router;
