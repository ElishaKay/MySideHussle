// Create a user
// Within the callback, create a profile (using the user.id)


let fs = require('fs');
let csv = require('fast-csv');

// Load User model
const User = require('../../models/User');


var stream = fs.createReadStream("../csv/applied.csv");
 
var csvStream = csv()
    .on("data", function(data){
         console.log(data);
         let email = data[0];
         
             
            User.findOne({ email: email }).then(user => {
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



         })

    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);

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