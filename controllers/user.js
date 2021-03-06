const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const schedule = require('node-schedule')

const UserModel = require("../models/user.js");

// CRON
const {userStockCronUpdateLtp} = require('../cron/userStockCronUpdateLtp.js');
const cronTime = process.env.CRON_TIME;

const signin = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ email });
        if (!oldUser) 
            return res.status(404).json({errors: [{ msg: "Invalid credentials"}] });
        
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) 
            return res.status(400).json({ errors: [{msg: "Invalid credentials"}] });

        
        const payload = {
            user: {
                email: oldUser.email,
                id: oldUser._id
            }
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" } 
        );

        // CRON
        schedule.scheduleJob(`*/${cronTime} * * * * *`, () => userStockCronUpdateLtp(oldUser.id));    

        res.status(201).json({ token });        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Invalid credentials!" });   
    }    
}

const signup = async (req, res) => {
    console.log(req.body);
    const { email, password, name } = req.body;

     try {
        // See if user exists
        const oldUser = await UserModel.findOne({ email });
        if (oldUser){            
            return res.status(400).json({ errors: [{msg: "User already exists"}] });
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });        

        // Encrypt the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save
        const result = await UserModel.create({ email, password: hashedPassword, name, avatar });
        
        // return jwt
        const payload = {
            user: {
                email: result.email,
                id: result._id
            }
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" } 
        );

        // CRON
        schedule.scheduleJob(`*/${cronTime} * * * * *`, () => userStockCronUpdateLtp(result._id));     
                        
        // send json 
        res.status(201).json({ token });

     } catch (error) {
         console.log(error.message);
         res.status(500).json({ errors: [{msg: "Failed to sign up!"}]});   
     }    
}

const userDetails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        res.status(201).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error" });   
    }
}

module.exports = {
    signin,
    signup,
    userDetails
}