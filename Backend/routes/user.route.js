const express = require('express');
const router= express.Router();
const usercontroller = require('../controllers/user.controller');
const {body}=require('express-validator');
const auth = require('../middlewares/auth.middleware');

router.post('/register',[
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], usercontroller.registeruser);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], usercontroller.loginuser);

router.get('/profile', auth.authUser, usercontroller.getuserprofile);    

router.post('/logout', auth.authUser, usercontroller.logoutuser);
module.exports = router;