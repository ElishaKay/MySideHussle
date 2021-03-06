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

const Profile = require('../../models/Profile');

// let stream = fs.createReadStream("./csv/applied_v2.csv");
 
// let csvStream = csv
//     .parseStream(stream, { headers: true })

    fs.createReadStream('./csv/applied.csv')
    .pipe(csv.parse({ headers: true }))
    .on("data", function(data){
         console.log(data);

         let githubusername = '';
         let youtube = '';
         let facebook = '';
         let instagram = '';
         let website = '';

         let { first_name, last_name, email, linkedin_url, twitter_url, headline, websites, location, current_positions,
                 at_current_companies, phone, message_sent_date } = data;

         let current_experience_date = new Date(message_sent_date);

         let name = `${first_name + ' ' + last_name}`;

         let password = `${first_name + '_' + last_name + '9376'}`;

         let linkedin = linkedin_url;
         let twitter = twitter_url;
         let status = headline;
         let bio = headline;

         if(current_positions && at_current_companies){
            current_positions = current_positions.split('|');
            at_current_companies = at_current_companies.split('|') 

         }

         let company = at_current_companies[0];

         let handle = linkedin.split('linkedin.com/in/')[1];

         if(websites){
            // console.log('websites, and typeof websites below: ', websites);

            // console.log(typeof websites);
            websites = websites.split("'");
            // console.log(typeof websites);
            // console.log(websites); 

            for (let i = 0; i < websites.length; i++) {
                let str = websites[i];


                if (str.match(/[a-z]/i)) {
                    // console.log('found alphabetic letter');
                    if(!str.includes('http')){
                      let prefix = 'https://';
                      str = prefix.concat(str);
                    }

                    if(str.includes('instagram')){
                        instagram = str;
                    } else if(str.includes('github')){
                        githubusername = str;
                    } else if(str.includes('youtube')){
                        youtube =  str;
                    } else if(str.includes('facebook')){
                        // console.log('string equals facebook');
                        facebook = str;
                    } else {
                        website = str;
                        // console.log('string should be website');
                    }
                }
            }

         }
     
        console.log('githubusername: ',githubusername);
        console.log('youtube: ',youtube);
        console.log('facebook: ',facebook);
        console.log('instagram: ',instagram);
        console.log('website: ',website);
        console.log('handle: ', handle);

         if(email!=null && email.includes("@")){


            User.findOne({ email: email }).then(user => {
                console.log('user: ', user)

                if (user) {
                  console.log('Email already exists');
                  
                } else {
                  const avatar = gravatar.url(email, {
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
                        .then(user => {
                            console.log("user succesfully saved. Heres the user.id:", user.id);

                            // Get fields
                            const profileFields = {};
                            profileFields.user = user.id;
                            if (handle) profileFields.handle = handle;
                            if (company) profileFields.company = company;
                            if (website) profileFields.website = website;
                            if (location) profileFields.location = location;
                            if (status) profileFields.status = status;
                            if (bio) profileFields.bio = bio;
                            if (phone) profileFields.phone = phone;
                            if (current_experience_date) profileFields.current_experience_date = current_experience_date;
                            if (githubusername) profileFields.githubusername = githubusername;
                            // Skills - Spilt into array
                            if (typeof skills !== 'undefined') {
                              profileFields.skills = skills.split(',');
                            }
                            // Social (optional fields)
                            profileFields.social = {};
                            if (youtube) profileFields.social.youtube = youtube;
                            if (twitter) profileFields.social.twitter = twitter;
                            if (facebook) profileFields.social.facebook = facebook;
                            if (linkedin) profileFields.social.linkedin = linkedin;
                            if (instagram) profileFields.social.instagram = instagram;

                            // Create or Edit current user profile with unique handle
                            Profile
                              .findOne({ user: user.id })
                              .then(profile => {
                                // If profile not exist, then create a new one, Otherwise just update 
                                
                                // Create new profile
                                if(!profile){
                                  // Check if handle exists (handle should be unoque for all profile)
                                  Profile
                                    .findOne({ handle: profileFields.handle})
                                    .then(profile => {
                                    if(profile){
                                      console.log('handle already exists');
                                    }
                                  });
                                  new Profile(profileFields).save().then(profile => {

                                        for (let i = 0; i < current_positions.length; i++) {
                                            
                                            console.log(current_positions[i].trim() + ' at ' + at_current_companies[i].trim());
                                            //save one experience at a time
                                              const newExp = {
                                                title: current_positions[i].trim(),
                                                company: at_current_companies[i].trim()
                                              };

                                              // Add to exp array
                                              profile.experience.unshift(newExp);

                                        }
                                      
                                     profile.save().then(
                                        profile => {console.log('relevant experience saved')}
                                    );
                                  
                                })}
                                // Update the profile
                                else{
                                  // Check if handle exists for other user
                                  Profile
                                    .findOne({ handle: profileFields.handle})
                                    .then(p => {
                                    if(profile.handle !== p.handle){
                                      console.log('handle already exists');
                                    }
                                  });
                                  Profile
                                    .findOneAndUpdate(
                                      {user: user.id},
                                      {$set: profileFields},
                                      {new: true}
                                    )
                                    .then(profile => {

                                        for (let i = 0; i < current_positions.length; i++) {
                                            
                                            console.log(current_positions[i].trim() + ' at ' + at_current_companies[i].trim());
                                            //save one experience at a time
                                              const newExp = {
                                                title: current_positions[i].trim(),
                                                company: at_current_companies[i].trim()
                                              };

                                              // Add to exp array
                                              profile.experience.unshift(newExp);

                                        }
                                      
                                     profile.save().then(
                                        profile => {console.log('relevant experience saved')}
                                    );
                                  
                                  })

                                }

                                }
                            )
                        .catch(err => console.log("error: ", err));
                    });
                  });
                }
            );     
         }
         
         //end of saving user profile logic
         })
         
         //end of reading csv rows logic
         }})

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