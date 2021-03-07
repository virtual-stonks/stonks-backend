const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');

const UserModel = require("../models/user.js");

const secret = 'test';

//  const signin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const oldUser = await UserModal.findOne({ email });

//     if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

//     const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

//     if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

//     res.status(200).json({ result: oldUser, token });
//   } catch (err) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

const signin = (req, res) => {
    console.log(req.body);
    res.send('signin')
}

//  const signup = async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;

//   try {
//     const oldUser = await UserModal.findOne({ email });

//     if (oldUser) 
//         return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

//     const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

//     res.status(201).json({ result, token });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });    
//     console.log(error);
//   }
// };

const signup = async (req, res) => {
    console.log(req.body);
    const { email, password, name } = req.body;

     try {
        // See if user exists
        const oldUser = await UserModal.findOne({ email });
        if (oldUser) 
            return res.status(400).json({ errors: [{message: "User already exists"}] });

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });        

        // Encrypt the password
        
        const hashedPassword = await bcrypt.hash(password, 12);

        // return jwt

     } catch (error) {
         console.log(error.message);
         res.status(500).json({ message: "Something went wrong" });   
     }

    res.send('signup')
}

module.exports = {
    signin,
    signup
}