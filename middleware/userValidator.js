const {check, validationResult} = require('express-validator');

const userValidationRulesSignup = (typeofauth) => {
    return [      
      check('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Username - Minimum 3 characters required!')
        .bail(),  
      check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('Invalid email address!')
        .bail(),
      check('password')
        .isLength({min: 6})
        .withMessage('Password - Minumum 6 characters required')
        .bail(),    
    ]
}

const userValidationRulesSignin = (typeofauth) => {
  return [      
    check('email')
      .trim()
      .normalizeEmail()
      .not()
      .isEmpty()
      .withMessage('Invalid email address!')
      .bail(),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty!')
      .bail(),    
  ]
}

const validate = (req, res, next) => {   
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({msg: err.msg}));
    
    console.log(extractedErrors);
    return res.status(400).json({
      errors: [...extractedErrors],      
    })
}

module.exports = {
    userValidationRulesSignin,
    userValidationRulesSignup,
    validate,
}

