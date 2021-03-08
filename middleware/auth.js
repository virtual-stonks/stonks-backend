const jwt =  require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    // Get the token from the header
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);

    // Check if no token
    if(!token){
      res.status(401).json({ msg: "No token, authorization denied"});
    }

    // Verify token    
    const decodedData = jwt.verify(token, secret);
    req.user = decodedData.user;        

    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: "Invalid token"});
  }
};

module.exports = auth;