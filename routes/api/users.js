const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const sg = require('sendgrid')(keys.SENDGRID_API_KEY);
const nodemailer = require('nodemailer');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// Load Message model
const Message = require('../../models/Message');


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

       let {id, name, email, password} = user;
       let subject = 'Password Reset Request';

       const output = require('../../emails/reset_password.js')(
                name,
                password,
                keys.baseURL
                );

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: keys.mailHost,
        port: 465,
        auth: {
            user: keys.mailUser, // generated ethereal user
            pass: keys.mailPass  // generated ethereal password
        },
        secure: true
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"MySideHussle Support" <Support@MySideHussle.com>', // sender address
          to: email, // list of receivers
          subject: subject, // Subject line
          text: 'Hello world?', // plain text body
          html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      });

      const newMessage = new Message({
        subject: subject,
        content: 'reset password link available here',
        sent_to_id: id,
        sent_to_details: {
          name,
          email
        }
      });

      newMessage.save().then(message => { console.log(message)
          res.json({success: true})
      });

      // res.json({success: true})
    
      // get the guys name from the db's response and send him a nicely formatted linkdein-style email here

        // let {name, email, password} = user;
        // name = name.split(' ')[0]; 
        // let subject = 'heyo';
        // let message = 'whadup';
        // let uuid = password;
        // let baseURL = 'https://mysidehussle.herokuapp.com';

        // function sendGrid(sendTo){
        //     var helper = require('sendgrid').mail;
        //     var from = new helper.Email('storks@mysidehussle.com');
        //     var to = new helper.Email(sendTo);
        //     var emailTitle = `${name} 🤗 - attaching your password-reset link here`;
        //     var emailTemplate = require('../../emails/reset_password.js')(
        //         name,
        //         password,
        //         keys.baseURL
        //         );

        //     console.log('')
        //     var content = new helper.Content(
        //             "text/html", emailTemplate);
        //     var mail = new helper.Mail(from, emailTitle, to, content);

        //     var request = sg.emptyRequest({
        //       method: 'POST',
        //       path: '/v3/mail/send',
        //       body: mail.toJSON(),
        //     });

        //     sg.API(request, function(error, response) {
        //       console.log('response from sendGrid:', response);
        //     });
        // }

        // //send to client
        // sendGrid(email);

        //send to admin
        // sendGrid('kramer1346@gmail.com');        
      

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
  //Check this logic in Traversy tutorial
  // const { errors, isValid } = validateRegisterInput(req.body);

  // // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  console.log('ran update password route');

  // get password from uuid params or default to first page
  const uuid = req.query.uuid || 'couldnt find uuid';
  let newPassword = req.query.newPassword || 'couldnt find newPassword';

  console.log('uuid',uuid);
  console.log('newPassword',newPassword)

  User.findOne({ password: uuid }).then(user => {
    console.log('user:', user)
    
    if (user) {
      
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
          if (err) throw err;
          newPassword = hash;
          let profileFields = {};
          profileFields.password = newPassword;

          //Update password within DB
          User
            .findOneAndUpdate(
              {password: uuid},
              {$set: {password: newPassword}},
              {new: true, useFindAndModify:false}, (err, user)=> {
                if(err){
                  console.log(err);
                } else {
                  console.log('successfully updated password for the following user: ', user);
                  res.json(user)
                }
            })

    })})} else {  
      errors.password = 'Try another password';
      return res.status(400).json(errors);
    } 

})}); 




module.exports = router;
