const express = require('express');
const router = express.Router()

const adminController = require('../controllers/adminController')
const middleware = require('../middlewares/session')

router.get('/adminlogin',adminController.adminLogin)




module.exports = router