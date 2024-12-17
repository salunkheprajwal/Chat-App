const express = require('express');

const { resgisterUser, authUser, allUsers }=require("../controllers/userControllers");
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(resgisterUser).get(protect, allUsers);
router.post('/login',authUser)
module.exports = router;
