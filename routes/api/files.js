const express = require('express');
const router = require('express').Router();
const multer  = require('multer');
const mongoose = require('mongoose');
const {connect, mongo,createConnection,connection} = mongoose;
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

// DB Config
const mongoURI = require('../../config/keys').mongoURI;

// Create mongo connection
const conn =  mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

console.log('connection.db',connection.db);   

// set up connection to db for file storage
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
// sets file input to single file
const singleUpload = multer({ storage: storage }).single('file');


router.get('/:filename', (req, res) => {
   gfs.files.find({ filename: req.params.filename }).toArray((err, files) => {
      if(!files || files.length === 0){
         return res.status(404).json({
            message: "Could not find file"
         });
      }

      var readstream = gfs.createReadStream({
         filename: files[0].filename
      })
      res.set('Content-Type', files[0].contentType);
      return readstream.pipe(res);
   });
});

router.get('/', (req, res) => {
   gfs.files.find().toArray((err, files) => {
      if(!files || files.length === 0){
         return res.status(404).json({
            message: "Could not find files"
         });
      }
      return res.json(files);
   });
});

router.post('/', singleUpload, (req, res) => {
   console.log('called file upload method');

   if (req.file) {
      return res.json({
         success: true,
         file: req.file
      });
   }
    res.send({ success: false });
});

router.delete('/:id', (req, res) => {
   console.log('req.params.id: ',req.params.id);
   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err) => {
      if (err) return res.status(500).json({ success: false })
      return res.json({ success: true });
   })
})

module.exports = router;
