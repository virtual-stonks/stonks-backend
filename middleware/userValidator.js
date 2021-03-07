const {check, validationResult} = require('express-validator');

const userValidationRules = () => {
    return [      
      check('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
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
        .withMessage('Minumum 6 characters required')
        .bail(),    
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(400).json({
      errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    validate,
}

