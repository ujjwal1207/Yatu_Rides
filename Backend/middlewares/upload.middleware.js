const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'yatu_rides/profile_pictures', // A folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
    // Transformation to apply to the uploaded image (e.g., resize)
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    // A function to generate a unique public ID for the file
    public_id: (req, file) => {
        const userType = req.captain ? 'captain' : 'user';
        const userId = req.captain ? req.captain._id : req.user._id;
        return `${userType}-${userId}-${Date.now()}`;
    }
  },
});

// Check file type (optional but good practice)
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profilePicture');

module.exports = upload;