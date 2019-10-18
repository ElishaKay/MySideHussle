const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const sg = require('sendgrid')(keys.SENDGRID_API_KEY);

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// @route   POST api/users/send-password-link
// @desc    User requests via GUI to reset his/her password
// @access  Public
router.post('/send-password-link', (req, res) => {

  console.log('called send-password-link api route')
  const errors = {};
  // const { errors, isValid } = validateRegisterInput(req.body);

  // // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      console.log('user coming back from db call:',user);

      res.json({success: true})
    
      // get the guys name from the db's response and send him a nicely formatted linkdein-style email here

        let {name, email} = user;
        let subject = 'heyo';
        let message = 'whadup';

        function sendGrid(sendTo){
            var helper = require('sendgrid').mail;
            var from = new helper.Email('support@ampitup.io');
            var to = new helper.Email(sendTo);
            var emailTitle = 'got your message. cool';
            var emailTemplate = require('../../emails/email_template.js')(
                name,
                subject,
                message
                );

            console.log('')
            var content = new helper.Content(
                    "text/html", emailTemplate);
            var mail = new helper.Mail(from, emailTitle, to, content);

            var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON(),
            });

            sg.API(request, function(error, response) {
              console.log('response from sendGrid:', response);
            });
        }

        //send to client
        sendGrid(email);

        //send to admin
        sendGrid('kramer1346@gmail.com');        
      

    } else {

      errors.email = 'Email already exists';
      return res.status(400).json(errors);
      
      
    }
  });

});


// @route   POST api/users/update-password
// @desc    handles the logic if a user clicks on custom email link to reset his password.
//          and then fills out form to update his password
// @access  Public
router.get('/update-password', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      
      //Update password within DB
      User
        .findOneAndUpdate(
          {user: user.id},
          {$set: profileFields},
          {new: true}
        )
        .then(profile => {
                //save one experience at a time
                  const newExp = {
                    title: current_positions[i].trim(),
                    company: at_current_companies[i].trim()
                  };

                  // Add to exp array
                  profile.experience.unshift(newExp);
         })     
         profile.save().then(
            profile => {console.log('relevant experience saved')}
        );  
      
      }})}); 




module.exports = router;
