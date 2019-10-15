// Create a user
// Within the callback, create a profile (using the user.id)


const fs = require('fs');
const csv = require('fast-csv');
const gravatar = require('gravatar');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// DB Config
const db = require('../../config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true }) // Let us remove that nasty deprecation warrning :)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Load User model
const User = require('../../models/User');

// let stream = fs.createReadStream("./csv/applied_v2.csv");
 
// let csvStream = csv
//     .parseStream(stream, { headers: true })

    fs.createReadStream('./csv/applied_v2.csv')
    .pipe(csv.parse({ headers: true }))
    .on("data", function(data){
         console.log(data);

         let { first_name, last_name, email } = data;

         let name = `${first_name + ' ' + last_name}`;

         let password = `${first_name + '_' + last_name + '9376'}`;
         
         if(email!=null && email.includes("@")){


            User.findOne({ email: email }).then(user => {
                console.log('user: ', user)

                if (user) {
                  console.log('Email already exists');
                  
                } else {
                  const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                  });

                  const newUser = new User({
                    name,
                    email,
                    avatar,
                    password
                  });

                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                        .save()
                        .then(user => console.log("user succesfully saved. Heres the user.id:", user.id))
                        .catch(err => console.log("error: ", err));
                    });
                  });
                }
            });     
         }
         

         })

    .on("end", function(){
         console.log("done");
    });
 
// stream.pipe(csvStream);

function formatCurrencyToInt(amountPaid){
  return parseInt(amountPaid.match(/\d+/)[0], 10);
}

function insertBackslashBeforeDoubleQuote(str){
 var reg = /"/g;
 var newstr = '\\"';
 str = str.replace(reg,newstr);

 var reg2 = /'/g;
 return  str.replace(reg2,newstr);
}