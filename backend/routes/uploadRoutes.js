const path = require('path');
const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Use memory storage so we don't save to local disk
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! We only support JPG, JPEG, PNG, WEBP, and GIF. (SVG is not allowed)'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, (req, res) => {
  upload.single('image')(req, res, async function (err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    try {
      const fileName = `uploads/image-${Date.now()}${path.extname(req.file.originalname)}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Firebase Storage default media URL format
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
      
      res.send(publicUrl);
    } catch (uploadError) {
      console.error('Error uploading to Firebase Storage:', uploadError);
      res.status(500).send('Failed to upload image to cloud storage');
    }
  });
});

module.exports = router;
